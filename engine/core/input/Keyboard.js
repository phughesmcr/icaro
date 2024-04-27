/**
 * @module
 *
 * The Keyboard handler manages the state of the keyboard input.
 */
export default class Keyboard {
  static GLOBAL_LISTENERS = [
    { name: 'keydown', handler: 'keyDown' },
    { name: 'keyup', handler: 'keyUp' },
  ];

  /** @type {Readonly<Record<string, string>>} */
  static KEYCODES = Object.freeze({
    KeyW: 'KeyW',
    KeyA: 'KeyA',
    KeyS: 'KeyS',
    KeyD: 'KeyD',
    Space: 'Space',
    Escape: 'Escape',
    ShiftLeft: 'ShiftLeft',
    ControlRight: 'ControlRight',
    CapsLock: 'CapsLock',
    Tab: 'Tab',
    Enter: 'Enter',
    ArrowUp: 'ArrowUp',
    ArrowDown: 'ArrowDown',
    ArrowLeft: 'ArrowLeft',
    ArrowRight: 'ArrowRight',
    Equal: 'Equal',
    Minus: 'Minus',
  });

  /** @type {Readonly<Array<string>>} */
  static USED_KEYS = Object.freeze(Object.keys(Keyboard.KEYCODES));

  /** @type {Map<string, boolean>} */
  #state;

  /** @type {Map<string, boolean>} */
  #previousState;

  /**
   * Create a new Keyboard handler
   */
  constructor() {
    this.#state = new Map(Array.from(Keyboard.USED_KEYS, (key) => [key, false]));
    this.#previousState = new Map(this.#state);
    Object.seal(this);
  }

  #addEventListeners() {
    for (const { name, handler } of Keyboard.GLOBAL_LISTENERS) {
      if (!(handler in this)) continue;
      // @ts-ignore
      document.addEventListener(name, (e) => this[handler](e));
    }
  }

  /**
   * Set the key state to false on key up
   * @param {KeyboardEvent} e
   * @returns {void}
   */
  keyUp(e) {
    const { code } = e;
    if (code in Keyboard.KEYCODES) {
      e.preventDefault();
      this.#state.set(code, false);
    }
  }

  /**
   * Set the key state to true on key down
   * @param {KeyboardEvent} e
   * @returns {void}
   */
  keyDown(e) {
    const { code } = e;
    if (code in Keyboard.KEYCODES) {
      e.preventDefault();
      this.#state.set(code, true);
    }
  }

  /**
   * Update the previous state to match the current state
   * @returns {void}
   */
  #updatePreviousState() {
    // NOTE: instead of this.#previousState = new Map(this.#state);
    for (const [key, value] of this.#state) {
      this.#previousState.set(key, value);
    }
  }

  /**
   * Initialize the Keyboard handler and add all event listeners
   * @returns {this}
   */
  init() {
    this.reset();
    this.#addEventListeners();
    return this;
  }

  /**
   * Check if a key is down
   * @param {string} code - The key code to check e.g. 'KeyW'
   * @returns {boolean} - True if the key is down
   */
  isDown(code) {
    return !!this.#state.get(code);
  }

  /**
   * Check if a key was pressed in the current frame
   * @param {string} code - The key code to check e.g. 'KeyW'
   * @returns {boolean} - True if the key was pressed
   */
  wasPressed(code) {
    return !!(this.#state.get(code) && !this.#previousState.get(code));
  }

  /**
   * Reset all key states to false
   * @returns {this}
   */
  reset() {
    // NOTE: instead of this.#state = new Map(...);
    for (const [key, _] of this.#state) {
      this.#state.set(key, false);
    }
    this.#updatePreviousState();
    return this;
  }

  /**
   * Update key states
   * @returns {this}
   */
  update() {
    this.#updatePreviousState();
    return this;
  }
}
