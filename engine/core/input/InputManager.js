import Keyboard from './Keyboard.js';
import Mouse from './Mouse.js';

/**
 * @module
 *
 * The InputHandler manages the keyboard and mouse input.
 */
export default class InputManager {
  /**
   * @readonly
   * @type {Keyboard}
   */
  keyboard;

  /**
   * @readonly
   * @type {Mouse}
   */
  mouse;

  /**
   * Create a new InputHandler
   */
  constructor() {
    this.keyboard = new Keyboard();
    this.mouse = new Mouse();
    Object.seal(this);
  }

  /**
   * Initialize the InputHandler and add all event listeners
   * @returns {this}
   */
  init() {
    this.keyboard.init();
    this.mouse.init();
    return this;
  }

  /** @returns {boolean} - True if document.pointerLockElement is set */
  isPointerLocked() {
    return !!document?.pointerLockElement;
  }

  /**
   * Reset the keyboard and mouse states
   * @returns {this}
   */
  reset() {
    this.keyboard.reset();
    this.mouse.reset();
    return this;
  }

  /**
   * Update the keyboard and mouse states
   * @returns {this}
   */
  update() {
    this.keyboard.update();
    this.mouse.update();
    return this;
  }
}
