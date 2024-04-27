import Mat2 from './Mat2.js';
import Vec2 from './Vec2.js';

export default class RotVec2 extends Vec2 {
  /** @type {Mat2} */
  #rotationMatrix;

  /**
   * Create a new Rotatable Vec2
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    super(x, y);
    this.#rotationMatrix = new Mat2();
  }

  get rotationMatrix() {
    return this.#rotationMatrix;
  }

  get rotation() {
    return this.#rotationMatrix.rotation;
  }

  /**
   * Rotate the vector towards a given angle
   * @param {number} theta
   * @returns {this}
   */
  rotateBy(theta) {
    return this.multiplyBy(this.#rotationMatrix.rotateBy(theta));
  }
}
