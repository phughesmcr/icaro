/**
 * @module       Engine
 * @description  The central game engine class
 * @author       P. Hughes <code@phugh.es>
 * @copyright    2024. All rights reserved.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { round } from '../math/utils.js';
import { NOOP, requestPointerLockSafely } from '../utils.js';
import Ticker from './Ticker.js';
import Game from './game/Game.js';
import InputManager from './input/InputManager.js';
import Renderer from './renderer/Renderer.js';

export default class Engine {
  /**
   * @readonly
   * @type {Game}
   */
  game;

  /**
   * @readonly
   * @type {InputManager}
   */
  input;

  /**
   * @readonly
   * @type {Renderer}
   */
  renderer;

  /**
   * @readonly
   * @type {Ticker}
   */
  ticker;

  /**
   * Create a new Engine.
   */
  constructor() {
    this.game = new Game();
    this.input = new InputManager();
    this.renderer = new Renderer();
    this.ticker = new Ticker();
  }

  /**
   * Setup the engine elements.
   * @param {HTMLCanvasElement} canvas
   * @returns {Promise<this>}
   */
  async init(canvas) {
    const canvasCtx = canvas.getContext('2d', { desynchronized: true });
    if (!canvasCtx) throw new Error('Failed to get 2D canvas context');

    // note: these go here to ensure they run first
    this.ticker.on('preUpdate', this.#preUpdate, { context: this });
    this.ticker.on('update', this.#update, { context: this });
    this.ticker.on('postUpdate', this.#postUpdate.bind(this, canvasCtx));

    // add external event listeners
    globalThis.onblur = () => this.input.reset();
    globalThis.onfocus = NOOP;

    globalThis.document.onfullscreenchange = () => this.input.mouse.reset();
    globalThis.document.onpointerlockchange = () => NOOP;

    globalThis.onkeydown = (e) => this.input.keyboard.keyDown(e);
    globalThis.onkeyup = (e) => this.input.keyboard.keyUp(e);

    canvas.onmousedown = (e) => mouseDown(this, e);
    canvas.onmouseup = (e) => mouseUp(this, e);
    canvas.onmousemove = (e) => mouseMove(this, e);
    canvas.oncontextmenu = (e) => e.preventDefault();

    // add internal event listeners
    this.game.onmapchange = () => {
      this.renderer.camera.reset();
      this.renderer.camera.centerOn(round(this.game.player.position.x), round(this.game.player.position.y));
    };

    // initialize the engine elements
    this.input.init();
    this.renderer.init(this.game.tileSize);

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
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} alpha
   * @returns {void}
   */
  #postUpdate(ctx, alpha) {
    this.renderer.draw2d(this.game);
    this.renderer.render(ctx);
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
  const element = e.currentTarget;
  if (!element) return;
  const { mouse } = engine.input;
  if (e.button === 0) {
    mouse.leftBtn = true;
    await requestPointerLockSafely(/** @type {Element} */ (element));
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
  const element = e.currentTarget;
  if (!element) return;
  const { mouse } = engine.input;
  e.preventDefault();
  if (globalThis.document.pointerLockElement === e.target) {
    mouse.dx += e.movementX;
    mouse.dy += e.movementY;
  } else if (globalThis.document.fullscreenElement === e.target) {
    mouse.x = e.pageX / window.innerWidth;
    mouse.y = e.pageY / window.innerHeight;
  } else {
    // @ts-ignore
    const offset = element.getBoundingClientRect();
    mouse.x = (e.clientX - offset.left) / offset.width;
    mouse.y = (e.clientY - offset.top) / offset.height;
  }
}
