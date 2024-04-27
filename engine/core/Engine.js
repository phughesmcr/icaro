/**
 * @typedef {Object} EngineSpec
 * @property {HTMLCanvasElement} canvas
 * @property {import('./game/Game.js').GameSpec} game
 */

import Game from './game/Game.js';
import InputManager from './input/InputManager.js';
import Ticker from './Ticker.js';
import Renderer from './renderer/Renderer.js';
import { debounce } from '../utils.js';

/**
 * @module
 *
 * The Engine class is the central context, holding the game state and logic.
 */
export default class Engine {
  /** @type {Game} */
  #game;

  /** @type {InputManager} */
  #input;

  /** @type {Renderer} */
  #renderer;

  /** @type {Ticker} */
  #ticker;

  /**
   * Create a new Engine.
   * @param {EngineSpec} spec
   */
  constructor(spec) {
    const { canvas, game } = spec;
    this.#ticker = new Ticker();
    this.#input = new InputManager();
    this.#game = new Game(game);
    this.#renderer = new Renderer(canvas, game.tileSize);

    this.#ticker.on('preUpdate', this.#preUpdate, { context: this });
    this.#ticker.on('postUpdate', this.#postUpdate, { context: this });
    this.#ticker.on('update', this.#update, { context: this });
  }

  #addEventListeners() {
    [
      {
        event: 'resize',
        el: globalThis,
        handler: debounce(() => this.#renderer.canvas.resizeDOM(), 16),
      },
      { event: 'blur', el: globalThis, handler: () => this.#input.reset() },
      { event: 'focus', el: globalThis, handler: () => {} },
      {
        event: 'mousedown',
        el: this.#renderer.canvas.element,
        handler: async (/** @type {MouseEvent} */ e) => {
          e.preventDefault();
          if (e.button === 0) {
            this.#input.mouse.leftBtn = true;
            if (!document.pointerLockElement) {
              // @ts-ignore
              await this.#renderer.canvas.element.requestPointerLock({
                unadjustedMovement: true,
              });
            }
          } else if (e.button === 2) {
            this.#input.mouse.rightBtn = true;
          }
        },
      },
      {
        event: 'mouseup',
        el: this.#renderer.canvas.element,
        handler: (/** @type {MouseEvent} */ e) => {
          e.preventDefault();
          if (e.button === 0) {
            this.#input.mouse.leftBtn = false;
          } else if (e.button === 2) {
            this.#input.mouse.rightBtn = false;
          }
        },
      },
      {
        event: 'mousemove',
        el: this.#renderer.canvas.element,
        handler: (/** @type {MouseEvent} */ e) => {
          const { mouse } = this.#input;
          e.preventDefault();
          if (globalThis.document.pointerLockElement === e.target) {
            mouse.moveX += e.movementX;
            mouse.moveY += e.movementY;
          } else if (globalThis.document.fullscreenElement === e.target) {
            mouse.x = e.pageX / window.innerWidth;
            mouse.y = e.pageY / window.innerHeight;
          } else {
            // @ts-ignore
            const offset = e.target.getBoundingClientRect();
            mouse.x = (e.pageX - offset.left) / document.body.clientWidth;
            mouse.y = (e.pageY - offset.top) / document.body.clientHeight;
          }
        },
      },
      {
        event: 'contextmenu',
        el: this.#renderer.canvas.element,
        handler: (/** @type {MouseEvent} */ e) => e.preventDefault(),
      },
    ].forEach(({ event, el, handler }) => {
      // @ts-ignore
      el.addEventListener(event, handler);
    });
  }

  /**
   * Setup the engine elements and load the game assets.
   * @returns {Promise<Engine>}
   */
  async init() {
    this.#addEventListeners();

    this.#game.on('mapChange', () => {
      this.#renderer.camera.reset();
      this.#renderer.camera.centerOn(
        Math.round(this.#game.player.position.x),
        Math.round(this.#game.player.position.y)
      );
    });

    this.#ticker.on('preUpdate', () => {
      if (this.#input.keyboard.isDown('KeyW') || this.#input.keyboard.isDown('ArrowUp')) {
        this.#game.player.walkDirection = 1;
      } else if (this.#input.keyboard.isDown('KeyS') || this.#input.keyboard.isDown('ArrowDown')) {
        this.#game.player.walkDirection = -1;
      } else {
        this.#game.player.walkDirection = 0;
      }

      if (this.#input.keyboard.isDown('KeyA') || this.#input.keyboard.isDown('ArrowLeft')) {
        this.#game.player.turnDirection = -1;
      } else if (this.#input.keyboard.isDown('KeyD') || this.#input.keyboard.isDown('ArrowRight')) {
        this.#game.player.turnDirection = 1;
      } else {
        this.#game.player.turnDirection = 0;
      }

      if (this.#input.keyboard.isDown('Equal')) {
        this.#renderer.camera.zoomBy(1.05);
      } else if (this.#input.keyboard.isDown('Minus')) {
        this.#renderer.camera.zoomBy(0.95);
      }
    });

    /*  this.#ticker.on('postUpdate', () => {
      console.log(this.#ticker.getFPS());
    }); */

    this.#input.init();
    this.#renderer.init();
    await this.#game.init();

    return this;
  }

  /**
   * @returns {this}
   */
  start() {
    this.#ticker.start();
    return this;
  }

  /**
   * @returns {this}
   */
  stop() {
    this.#ticker.stop();
    return this;
  }

  /**
   * @returns {this}
   */
  pause() {
    this.#ticker.pause();
    return this;
  }

  /**
   * @returns {this}
   */
  resume() {
    this.#ticker.resume();
    return this;
  }

  /**
   * @param {number} index
   */
  changeMap(index) {
    this.#game.changeMap(index);
    return this;
  }

  /**
   * @returns {void}
   */
  #preUpdate() {
    this.#input.update();
  }

  /**
   * @param {number} alpha
   * @returns {void}
   */
  #postUpdate(alpha) {
    this.#renderer.draw2d(this.#game);
  }

  /**
   * @param {number} delta
   * @returns {void}
   */
  #update(delta) {
    this.#game.update(delta);
  }
}
