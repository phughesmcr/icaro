/**
 * @module       Mat2
 * @description  2x2 Matrix
 * @author       P. Hughes <code@phugh.es>
 * @copyright    2024. All rights reserved.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

export default class Mat2 {
  /** @type {Float32Array} */
  #buffer = new Float32Array(4);

  /**
   * Create a new 2x2 Matrix
   * @param {number} [a=1] The top-left value
   * @param {number} [b=0] The top-right value
   * @param {number} [c=0] The bottom-left value
   * @param {number} [d=1] The bottom-right value
   * @note ```
   * | a  b |
   * | c  d |
   * ```
   */
  constructor(a = 1, b = 0, c = 0, d = 1) {
    this.#buffer[0] = a;
    this.#buffer[1] = b;
    this.#buffer[2] = c;
    this.#buffer[3] = d;
  }

  /**
   * @returns {number}
   * @note ```
   * | a  b |
   * | c  d |
   * ```
   */
  get a() {
    // @ts-ignore
    return this.#buffer[0];
  }

  /** @param {number} value */
  set a(value) {
    this.#buffer[0] = value;
  }

  /**
   * @returns {number}
   * @note ```
   * | a  b |
   * | c  d |
   * ```
   */
  get b() {
    // @ts-ignore
    return this.#buffer[1];
  }

  /** @param {number} value */
  set b(value) {
    this.#buffer[1] = value;
  }

  /**
   * @returns {number}
   * @note ```
   * | a  b |
   * | c  d |
   * ```
   */
  get c() {
    // @ts-ignore
    return this.#buffer[2];
  }

  /** @param {number} value */
  set c(value) {
    this.#buffer[2] = value;
  }

  /**
   * @returns {number}
   * @note ```
   * | a  b |
   * | c  d |
   * ```
   */
  get d() {
    // @ts-ignore
    return this.#buffer[3];
  }

  /** @param {number} value */
  set d(value) {
    this.#buffer[3] = value;
  }

  /** @returns {number} */
  get rotation() {
    return Math.atan2(this.b, this.a);
  }

  /**
   * Set the values of the matrix
   * @param {number} x
   * @param {number} y
   * @returns {this}
   */
  setRotation(x, y) {
    this.#buffer[0] = x;
    this.#buffer[1] = y;
    this.#buffer[2] = -y;
    this.#buffer[3] = x;
    return this;
  }

  /**
   * Rotate the matrix by a given angle
   * @param {number} angle
   * @returns {this}
   */
  rotateBy(angle) {
    const t2 = angle * angle;
    const mult = 1 / (1 + t2);
    return this.setRotation((1 - t2) * mult, 2 * angle * mult);
  }
}
