import Emitter from '../abstract/Emitter.js';
import { debounce, requestFullscreenSafely, requestPointerLockSafely } from '../utils.js';
import Ticker from './Ticker.js';
import Game from './game/Game.js';
import InputManager from './input/InputManager.js';
import Renderer from './renderer/Renderer.js';

/**
 * @typedef {Object} EngineSpec
 * @property {HTMLCanvasElement} canvas
 */

/**
 * @module
 *
 * The Engine class is the central context, holding the game state and logic.
 */
export default class Engine extends Emitter {
  /** @type {Game} */
  game;

  /** @type {InputManager} */
  input;

  /** @type {Renderer} */
  renderer;

  /** @type {Ticker} */
  ticker;

  /**
   * Create a new Engine.
   * @param {EngineSpec} spec
   */
  constructor(spec) {
    super();
    this.ticker = new Ticker();
    this.input = new InputManager();
    this.game = new Game();
    this.renderer = new Renderer(spec.canvas);

    // note: these go here to ensure they run first
    this.ticker.on('preUpdate', this.#preUpdate, { context: this });
    this.ticker.on('postUpdate', this.#postUpdate, { context: this });
    this.ticker.on('update', this.#update, { context: this });

    Object.freeze(this);
  }

  /**
   * Setup the engine elements and load the game assets.
   * @param {import('./game/Game.js').GameSpec} game
   * @returns {Promise<this>}
   */
  async init(game) {
    // add external event listeners
    globalThis.onresize = debounce(() => this.renderer.canvas.resizeDOM(), this.ticker.tickDuration);
    globalThis.onblur = () => this.input.reset();
    globalThis.onfocus = () => {};
    globalThis.document.onfullscreenchange = () => this.input.mouse.reset();
    globalThis.document.onpointerlockchange = () => {
      this.input.mouse.reset();
      if (globalThis.document?.pointerLockElement === this.renderer.canvas.element) {
        // reset the mouse position to the center of the canvas
        this.input.mouse.x = this.renderer.canvas.element.width / 2;
        this.input.mouse.y = this.renderer.canvas.element.height / 2;
      }
    };

    globalThis.onkeydown = (e) => this.input.keyboard.keyDown(e);
    globalThis.onkeyup = (e) => this.input.keyboard.keyUp(e);

    const { element } = this.renderer.canvas;
    element.onmousedown = (e) => mouseDown(this, e);
    element.onmouseup = (e) => mouseUp(this, e);
    element.onmousemove = (e) => mouseMove(this, e);
    element.oncontextmenu = (e) => e.preventDefault();

    // add internal event listeners
    this.game.on('mapChange', () => {
      this.renderer.camera.reset();
      this.renderer.camera.centerOn(Math.round(this.game.player.position.x), Math.round(this.game.player.position.y));
    });

    // initialize the engine elements
    this.input.init();
    this.renderer.init(game.tileSize);

    // load the game assets
    await this.game.init(game);

    return this;
  }

  /**
   * @returns {void}
   */
  #preUpdate() {
    if (this.input.keyboard.isDown('KeyW')) {
      this.game.player.walkDirection = 1;
    } else if (this.input.keyboard.isDown('KeyS')) {
      this.game.player.walkDirection = -1;
    } else {
      this.game.player.walkDirection = 0;
    }

    if (this.input.keyboard.isDown('KeyA')) {
      this.game.player.turnDirection = -1;
    } else if (this.input.keyboard.isDown('KeyD')) {
      this.game.player.turnDirection = 1;
    } else {
      this.game.player.turnDirection = 0;
    }

    if (this.input.keyboard.isDown('Equal')) {
      this.renderer.camera.zoomBy(1.05);
    } else if (this.input.keyboard.isDown('Minus')) {
      this.renderer.camera.zoomBy(0.95);
    }

    if (this.input.keyboard.isDown('ArrowUp')) {
      this.renderer.camera.y -= 5;
    } else if (this.input.keyboard.isDown('ArrowDown')) {
      this.renderer.camera.y += 5;
    } else if (this.input.keyboard.isDown('ArrowLeft')) {
      this.renderer.camera.x -= 5;
    } else if (this.input.keyboard.isDown('ArrowRight')) {
      this.renderer.camera.x += 5;
    }
  }

  /**
   * @param {number} alpha
   * @returns {void}
   */
  #postUpdate(alpha) {
    this.renderer.draw2d(this.game);
    this.renderer.render();
    this.input.update();
  }

  /**
   * @param {number} delta
   * @returns {void}
   */
  #update(delta) {
    this.game.update(delta);
  }
}

async function mouseDown(/** @type {Engine} */ engine, /** @type {MouseEvent} */ e) {
  e.preventDefault();
  const { mouse } = engine.input;
  const element = engine.renderer.canvas.element;
  if (e.button === 0) {
    mouse.leftBtn = true;
    await requestPointerLockSafely(element);
    // await requestFullscreenSafely(element);
  } else if (e.button === 2) {
    mouse.rightBtn = true;
  }
}

function mouseUp(/** @type {Engine} */ engine, /** @type {MouseEvent} */ e) {
  const { mouse } = engine.input;
  e.preventDefault();
  if (e.button === 0) {
    mouse.leftBtn = false;
  } else if (e.button === 2) {
    mouse.rightBtn = false;
  }
}

function mouseMove(/** @type {Engine} */ engine, /** @type {MouseEvent} */ e) {
  const { mouse } = engine.input;
  e.preventDefault();
  if (globalThis.document.pointerLockElement === e.target) {
    mouse.dx += e.movementX;
    mouse.dy += e.movementY;
  } else if (globalThis.document.fullscreenElement === e.target) {
    mouse.x = e.pageX / window.innerWidth;
    mouse.y = e.pageY / window.innerHeight;
  } else {
    const offset = engine.renderer.canvas.boundingClientRect;
    mouse.x = (e.clientX - offset.left) / offset.width;
    mouse.y = (e.clientY - offset.top) / offset.height;
  }
}
