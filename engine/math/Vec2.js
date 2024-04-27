export default class Vec2 {
  /** @type {number} */
  x = 0;

  /** @type {number} */
  y = 0;

  /**
   * Create a new Vec2
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
    Object.seal(this);
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
    const { a, b, c, d } = mat2;
    const { x, y } = this;
    this.x = a * x + c * y;
    this.y = b * x + d * y;
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
   * @param {Vec2} target
   * @returns {number}
   */
  project(target) {
    return this.x * target.x + this.y * target.y;
  }

  /**
   * Move this vector towards a target by a given amount
   * @param {Vec2} target - The target vector
   * @param {Vec2} [out] - Optional output vector
   * @returns {Vec2}
   */
  to(target, out = new Vec2(0, 0)) {
    return out.set(target.x - this.x, target.y - this.y);
  }

  /**
   * Calculate the squared distance between this vector and another
   * @param {Vec2} target
   * @returns {number}
   */
  squaredDistanceBetween(target) {
    return (target.x - this.x) * (target.x - this.x) + (target.y - this.y) * (target.y - this.y);
  }
}
