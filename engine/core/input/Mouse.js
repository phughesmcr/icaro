/**
 * @module Mouse
 *
 * The Mouse data object
 */
export default class Mouse {
  /** @type {number} */
  moveX = 0;

  /** @type {number} */
  moveY = 0;

  /** @type {number} */
  x = 0;

  /** @type {number} */
  y = 0;

  /** @type {boolean} */
  leftBtn = false;

  /** @type {boolean} */
  rightBtn = false;

  /**
   * Create a new mouse handler
   */
  constructor() {
    Object.seal(this);
  }

  /**
   * Initialize the Mouse handler and add all event listeners
   * @returns {this}
   */
  init() {
    this.reset();
    return this;
  }

  /**
   * Reset the mouse state to default
   * @returns {this}
   */
  reset() {
    this.moveX = 0;
    this.moveY = 0;
    this.x = 0;
    this.y = 0;
    this.leftBtn = false;
    this.rightBtn = false;
    return this;
  }

  /**
   * Update the mouse state
   * @returns {this}
   */
  update() {
    return this;
  }
}
