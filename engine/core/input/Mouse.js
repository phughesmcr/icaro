/**
 * @module       Mouse
 * @description  A Mouse class for handling mouse input.
 * @author       P. Hughes <code@phugh.es>
 * @copyright    2024. All rights reserved.
 */

export default class Mouse {
  /** @type {number} */
  dx = 0;

  /** @type {number} */
  dy = 0;

  /** @type {number} */
  x = 0;

  /** @type {number} */
  y = 0;

  /** @type {boolean} */
  leftBtn = false;

  /** @type {boolean} */
  rightBtn = false;

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
    this.dx = 0;
    this.dy = 0;
    this.x = 0;
    this.y = 0;
    this.leftBtn = false;
    this.rightBtn = false;
    return this;
  }
}
