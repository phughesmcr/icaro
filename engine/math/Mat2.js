/**
 * @module
 *
 * A 2x2 Matrix
 */
export default class Mat2 {
  /** @type {Float32Array} */
  #buffer;

  /**
   * Create a new 2x2 Matrix
   * @param {number} [a=1]
   * @param {number} [b=0]
   * @param {number} [c=0]
   * @param {number} [d=1]
   * @note ```
   * | a  b |
   * | c  d |
   * ```
   */
  constructor(a = 1, b = 0, c = 0, d = 1) {
    this.#buffer = Float32Array.from([a, b, c, d]);
    Object.freeze(this);
  }

  /** @returns {number} */
  get a() {
    // @ts-ignore
    return this.#buffer[0];
  }

  /** @param {number} value */
  set a(value) {
    this.#buffer[0] = value;
  }

  /** @returns {number} */
  get b() {
    // @ts-ignore
    return this.#buffer[1];
  }

  /** @param {number} value */
  set b(value) {
    this.#buffer[1] = value;
  }

  /** @returns {number} */
  get c() {
    // @ts-ignore
    return this.#buffer[2];
  }

  /** @param {number} value */
  set c(value) {
    this.#buffer[2] = value;
  }

  /** @returns {number} */
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
    this.a = x;
    this.b = y;
    this.c = -y;
    this.d = x;
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
    // @ts-ignore
    return this.setRotation((1 - t2) * mult, 2 * angle * mult);
  }
}
