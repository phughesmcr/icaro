/**
 * @module       InputManager
 * @description  The InputManager handles the keyboard and mouse input.
 * @author       P. Hughes <code@phugh.es>
 * @copyright    2024. All rights reserved.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import GamePad from './GamePad.js';
import Keyboard from './Keyboard.js';
import Mouse from './Mouse.js';

export default class InputManager {
  /**
   * @readonly
   * @type {GamePad}
   */
  gamepad;

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
    this.gamepad = new GamePad();
    this.keyboard = new Keyboard();
    this.mouse = new Mouse();
  }

  /**
   * Initialize the InputHandler and add all event listeners
   * @returns {this}
   */
  init() {
    this.gamepad.init();
    this.keyboard.init();
    this.mouse.init();
    return this;
  }

  /** @returns {boolean} - True if document.pointerLockElement is set */
  isPointerLocked() {
    return !!globalThis.document?.pointerLockElement;
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
    return this;
  }
}
