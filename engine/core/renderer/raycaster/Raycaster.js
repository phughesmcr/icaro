/**
 * @module       Raycaster
 * @description  The RayCaster class is responsible for generating an iterable of Rays.
 * @author       P. Hughes <code@phugh.es>
 * @copyright    2024. All rights reserved.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Mat2 from '../../../math/Mat2.js';
import RotVec2 from '../../../math/RotVec2.js';
import Ray from './Ray.js';

export default class RayCaster {
  static RAY_WIDTH = 8;
  static FOCAL_LENGTH = 3.5;
  static FOV_RATIO = 1 / RayCaster.FOCAL_LENGTH;
  static PROJECTION_PLANE_WIDTH = 2 * RayCaster.FOV_RATIO;
  static FIRST_RAY_DIRECTION = -RayCaster.FOV_RATIO;

  /** @type {RotVec2} */
  #direction;

  /** @type {Array<Ray>} */
  #rays;

  /** @type {number} */
  #rayStep;

  /** @type {Mat2} */
  #rotationMatrix;

  /**
   * Create a new RayCaster
   * @param {number} width
   */
  constructor(width) {
    this.#direction = new RotVec2(1, 0);
    this.#rays = Array.from({ length: width / RayCaster.RAY_WIDTH }, () => new Ray(this.#direction));
    this.#rotationMatrix = new Mat2();
    this.#rayStep = RayCaster.PROJECTION_PLANE_WIDTH / this.#rays.length;
  }

  /** @type {Array<Ray>} */
  get rays() {
    return this.#rays;
  }

  /**
   * Cast all rays from a given origin
   * @param {import('../../game/Game.js').default} game
   * @param {number} tileSize
   * @returns {this}
   */
  castAll(game, tileSize) {
    if (!game.currentMap) return this;
    this.#direction.setRotation(RayCaster.FIRST_RAY_DIRECTION).multiplyBy(game.player.rotationMatrix);
    this.#rotationMatrix.rotateBy(this.#rayStep);
    for (let i = 0; i < this.#rays.length; i++) {
      const ray = this.#rays[i];
      if (!ray) continue;
      ray.direction.set(this.#direction.x, this.#direction.y);
      ray.cast(game.currentMap, game.player.position, tileSize);
      this.#direction.multiplyBy(this.#rotationMatrix);
    }
    return this;
  }

  /**
   *
   * @param {number} width
   * @returns {this}
   */
  resize(width) {
    this.#rays = Array.from({ length: width / RayCaster.RAY_WIDTH }, () => new Ray(this.#direction));
    this.#rayStep = RayCaster.PROJECTION_PLANE_WIDTH / this.#rays.length;
    return this;
  }
}
