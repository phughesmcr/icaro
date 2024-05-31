/**
 * @module       Keyboard
 * @description  The Keyboard handler manages the state of the keyboard input.
 * @author       P. Hughes <code@phugh.es>
 * @copyright    2024. All rights reserved.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

export default class Keyboard {
  /** @type {Set<string>} */
  static CAPTURED_KEYCODES = new Set([
    'KeyW',
    'KeyA',
    'KeyS',
    'KeyD',
    'Space',
    'Escape',
    'ShiftLeft',
    'ControlRight',
    'CapsLock',
    'Tab',
    'Enter',
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'Equal',
    'Minus',
  ]);

  /** @type {Set<string>} */
  #state = new Set();

  /** @type {Set<string>} */
  #previousState = new Set();

  /**
   * Set the key state to false on key up
   * @param {KeyboardEvent} e
   * @returns {void}
   */
  keyUp(e) {
    if (Keyboard.CAPTURED_KEYCODES.has(e.code)) {
      e.preventDefault();
      this.#state.delete(e.code);
    }
  }

  /**
   * Set the key state to true on key down
   * @param {KeyboardEvent} e
   * @returns {void}
   */
  keyDown(e) {
    if (Keyboard.CAPTURED_KEYCODES.has(e.code)) {
      e.preventDefault();
      this.#state.add(e.code);
    }
  }

  /**
   * Initialize the Keyboard handler and add all event listeners
   * @returns {this}
   */
  init() {
    this.reset();
    return this;
  }

  /**
   * Check if a key is down
   * @param {string} code - The key code to check e.g. 'KeyW'
   * @returns {boolean} - True if the key is down
   */
  isDown(code) {
    return this.#state.has(code);
  }

  /**
   * Check if a key was pressed in the current frame
   * @param {string} code - The key code to check e.g. 'KeyW'
   * @returns {boolean} - True if the key was pressed
   */
  wasPressed(code) {
    return this.#state.has(code) && !this.#previousState.has(code);
  }

  /**
   * Reset all key states to false
   * @returns {this}
   */
  reset() {
    this.#state.clear();
    this.#previousState.clear();
    return this;
  }

  /**
   * Update key states
   * @returns {this}
   */
  update() {
    // NOTE: instead of this.#previousState = new Set(this.#state);
    this.#previousState.clear();
    for (const key of this.#state) {
      this.#previousState.add(key);
    }
    return this;
  }
}
