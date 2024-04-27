export default class Mat2 {
  /** @type {number} */
  a = 1;

  /** @type {number} */
  b = 0;

  /** @type {number} */
  c = 0;

  /** @type {number} */
  d = 1;

  /**
   * Create a new Mat2
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
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
  }

  get rotation() {
    return Math.atan2(this.b, this.a);
  }

  /**
   * Set the values of the matrix
   * @param {import('./Vec2.js').default} vec2
   * @returns {this}
   */
  setRotation(vec2) {
    const { x, y } = vec2;
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
    return this.setRotation({ x: (1 - t2) * mult, y: 2 * angle * mult });
  }
}
