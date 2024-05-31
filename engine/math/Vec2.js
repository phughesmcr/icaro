/**
 * @module       Vec2
 * @description  A 2d Vector with x and y components
 * @author       P. Hughes <code@phugh.es>
 * @copyright    2024. All rights reserved.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

export default class Vec2 {
  /** @type {Float32Array} */
  #buffer = new Float32Array(2);

  /**
   * Create a new 2d Vector
   * @param {number} [x=0]
   * @param {number} [y=0]
   */
  constructor(x = 0, y = 0) {
    this.#buffer[0] = x;
    this.#buffer[1] = y;
  }

  /** @returns {number} */
  get x() {
    // @ts-ignore
    return this.#buffer[0];
  }

  /** @param {number} value */
  set x(value) {
    this.#buffer[0] = value;
  }

  /** @returns {number} */
  get y() {
    // @ts-ignore
    return this.#buffer[1];
  }

  /** @param {number} value */
  set y(value) {
    this.#buffer[1] = value;
  }

  /**
   * Create a new Vec2 with the same values as this one
   * @returns {Vec2}
   */
  clone() {
    return new Vec2(this.x, this.y);
  }

  /**
   * Multiply this vector by a 2d matrix
   * @param {import('./Mat2.js').default} mat2
   * @returns {this}
   */
  multiplyBy(mat2) {
    this.x = mat2.a * this.x + mat2.c * this.y;
    this.y = mat2.b * this.x + mat2.d * this.y;
    return this;
  }

  /**
   * Rotate towards a given angle
   * @param {number} theta
   * @returns {this}
   */
  setRotation(theta) {
    const t2 = theta * theta;
    const mult = 1 / (1 + t2);
    this.set((1 - t2) * mult, 2 * theta * mult);
    return this;
  }

  /**
   * Set the values of the vector
   * @param {number} x
   * @param {number} y
   * @returns {this}
   */
  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Project this vector onto another
   * @param {Vec2} source - The source vector
   * @param {Vec2} target - The target vector
   * @returns {number}
   */
  static project(source, target) {
    return source.x * target.x + source.y * target.y;
  }

  /**
   * Move this vector towards a target by a given amount
   * @param {Vec2} source - The source vector
   * @param {Vec2} target - The target vector
   * @param {Vec2} [out] - Optional output vector
   * @returns {Vec2}
   */
  static to(source, target, out = new Vec2(0, 0)) {
    return out.set(target.x - source.x, target.y - source.y);
  }

  /**
   * Calculate the squared distance between this vector and another
   * @param {Vec2} source - The source vector
   * @param {Vec2} target - The target vector
   * @returns {number}
   */
  static squaredDistanceBetween(source, target) {
    return (target.x - source.x) * (target.x - source.x) + (target.y - source.y) * (target.y - source.y);
  }
}
