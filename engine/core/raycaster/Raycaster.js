import Mat2 from '../../math/Mat2.js';
import Vec2 from '../../math/Vec2.js';
import Ray from './Ray.js';

/**
 * @typedef {Object} RayCasterSpec
 * @property {number} width - Width of the viewport
 * @property {number} height - Height of the viewport
 * @property {{ x: number, y: number }} [direction=RayCaster.DEFAULT_DIRECTION] - Initial direction
 */

/**
 * @module
 *
 * The RayCaster class is responsible for generating an iterable of Rays.
 */
export default class RayCaster {
  static RAY_WIDTH = 8;
  static FOCAL_LENGTH = 3.5;
  static FOV_RATIO = 1 / RayCaster.FOCAL_LENGTH;
  static PROJECTION_PLANE_WIDTH = 2 * RayCaster.FOV_RATIO;
  static FIRST_RAY_DIRECTION = -RayCaster.FOV_RATIO;
  static DEFAULT_DIRECTION = { x: 1, y: 0 };

  /** @type {Vec2} */
  #direction;

  /** @type {Array<Ray>} */
  #rays;

  /** @type {number} */
  #rayStep;

  /** @type {Mat2} */
  #rotationMatrix;

  /**
   * Create a new RayCaster
   * @param {RayCasterSpec} spec
   */
  constructor(spec) {
    const { width, direction = RayCaster.DEFAULT_DIRECTION } = spec;
    this.#direction = new Vec2(direction?.x || 0, direction?.y || 0);
    this.#rays = Array.from({ length: width / RayCaster.RAY_WIDTH }, () => new Ray(this.#direction));
    this.#rotationMatrix = new Mat2();
    this.#rayStep = RayCaster.PROJECTION_PLANE_WIDTH / this.#rays.length;
    Object.seal(this);
  }

  get rays() {
    return this.#rays;
  }

  /**
   * Cast all rays from a given origin
   * @param {import('../game/Game.js').default} game
   * @returns {this}
   */
  castAll(game) {
    if (!game.currentMap) return this;
    this.#direction.setRotation(RayCaster.FIRST_RAY_DIRECTION).multiplyBy(origin.rotationMatrix);
    this.#rotationMatrix.rotateBy(this.#rayStep);
    for (let i = 0; i < this.#rays.length; i++) {
      const ray = this.#rays[i];
      if (!ray) throw new Error(`Ray ${i} is undefined`);
      ray.direction.set(this.#direction.x, this.#direction.y);
      ray.cast(game.currentMap, game.player.position);
      this.#direction.multiplyBy(this.#rotationMatrix);
    }
    return this;
  }
}
