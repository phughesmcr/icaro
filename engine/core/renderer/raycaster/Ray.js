import Vec2 from '../../../math/Vec2.js';

/**
 * @module
 *
 * Based on:
 * @see {@link https://github.com/HardCoreCodin/Rational-Ray-Casting}
 * @license MIT
 */
export default class Ray {
  /** @type {Vec2} */
  direction;

  /** @type {Vec2} */
  wallHit;

  /** @type {boolean} */
  wasHitVertical;

  /** @type {Vec2} */
  #horizontalIntersect;

  /** @type {Vec2} */
  #nextHorizontalIntersect;

  /** @type {Vec2} */
  #verticalIntersect;

  /** @type {Vec2} */
  #nextVerticalIntersect;

  /**
   * Create a new Ray
   * @param {Vec2} direction
   */
  constructor(direction) {
    this.direction = direction.clone();
    this.wallHit = new Vec2(0, 0);
    this.wasHitVertical = false;
    this.#horizontalIntersect = new Vec2(0, 0);
    this.#verticalIntersect = new Vec2(0, 0);
    this.#nextHorizontalIntersect = new Vec2(0, 0);
    this.#nextVerticalIntersect = new Vec2(0, 0);
    Object.seal(this);
  }

  /** @returns {boolean} */
  get isFacingRight() {
    return this.direction.x > 0;
  }

  /** @returns {boolean} */
  get isFacingDown() {
    return this.direction.y > 0;
  }

  /** @returns {boolean} */
  get isFacingUp() {
    return !this.isFacingDown;
  }

  /** @returns {boolean} */
  get isFacingLeft() {
    return !this.isFacingRight;
  }

  /**
   *
   * @param {number} n
   * @param {number} tileSize
   * @param {boolean} vertical
   * @returns {number}
   */
  getClosestIntercept(n, tileSize, vertical) {
    let intercept = Math.floor(n / tileSize) * tileSize;
    if (vertical && this.isFacingDown) {
      intercept += tileSize;
    } else if (this.isFacingRight) {
      intercept += tileSize;
    }
    return intercept;
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} yIntercept
   * @returns
   */
  getXIntercept(x, y, yIntercept) {
    return x + ((yIntercept - y) * this.direction.x) / this.direction.y;
  }

  /**
   * Cast the ray to detect the closest wall
   * @param {import('../../game/GameMap.js').default} map
   * @param {Vec2} origin
   * @param {number} tileSize
   */
  cast(map, origin, tileSize) {
    /** @type {number} */
    let yIntercept;

    /** @type {number} */
    let xIntercept;

    /** @type {number} */
    let xStep;

    /** @type {number} */
    let yStep;

    /** @type {boolean} */
    let foundHorizontalWall = false;

    /** @type {boolean} */
    let foundVerticalWall = false;

    // Reset the previous intersection points
    this.#horizontalIntersect.set(0, 0);
    this.#verticalIntersect.set(0, 0);
    this.#nextHorizontalIntersect.set(0, 0);
    this.#nextVerticalIntersect.set(0, 0);

    // HORIZONTAL INTERSECTION DETECTION
    yIntercept = Math.floor(origin.y / tileSize) * tileSize;
    yIntercept += this.isFacingDown ? tileSize : 0;

    // Find the x-coordinate of the closest horizontal grid intersection
    xIntercept = origin.x + ((yIntercept - origin.y) * this.direction.x) / this.direction.y;

    // Calculate the increment xstep and ystep
    xStep = (tileSize * this.direction.x) / this.direction.y;
    xStep *= this.isFacingLeft && xStep > 0 ? -1 : 1;
    xStep *= this.isFacingRight && xStep < 0 ? -1 : 1;

    yStep = tileSize;
    yStep *= this.isFacingUp ? -1 : 1;

    this.#nextHorizontalIntersect.set(xIntercept, yIntercept);

    // Increment xstep and ystep until we find a wall
    while (
      this.#nextHorizontalIntersect.x >= 0 &&
      this.#nextHorizontalIntersect.x <= map.width * tileSize &&
      this.#nextHorizontalIntersect.y >= 0 &&
      this.#nextHorizontalIntersect.y <= map.height * tileSize
    ) {
      const cell = map.getGridAt(
        this.#nextHorizontalIntersect.x,
        this.#nextHorizontalIntersect.y + (this.isFacingUp ? -1 : 0) // if ray is facing up, force one pixel up so we are inside a grid cell
      );
      if (cell === 0) {
        this.#nextHorizontalIntersect.set(
          this.#nextHorizontalIntersect.x + xStep,
          this.#nextHorizontalIntersect.y + yStep
        );
      } else {
        foundHorizontalWall = true;
        this.#horizontalIntersect.set(this.#nextHorizontalIntersect.x, this.#nextHorizontalIntersect.y);
        break;
      }
    }

    // VERTICAL INTERSECTION DETECTION
    // Find the x-coordinate of the closest vertical grid intersenction
    xIntercept = Math.floor(origin.x / tileSize) * tileSize;
    xIntercept += this.isFacingRight ? tileSize : 0;

    // Find the y-coordinate of the closest vertical grid intersection
    yIntercept = origin.y + ((xIntercept - origin.x) * this.direction.y) / this.direction.x;

    // Calculate the increment xstep and ystep
    yStep = (tileSize * this.direction.y) / this.direction.x;
    yStep *= this.isFacingUp && yStep > 0 ? -1 : 1;
    yStep *= this.isFacingDown && yStep < 0 ? -1 : 1;

    xStep = tileSize;
    xStep *= this.isFacingLeft ? -1 : 1;

    this.#nextVerticalIntersect.set(xIntercept, yIntercept);

    // Increment xstep and ystep until we find a wall
    while (
      this.#nextVerticalIntersect.x >= 0 &&
      this.#nextVerticalIntersect.x <= map.width * tileSize &&
      this.#nextVerticalIntersect.y >= 0 &&
      this.#nextVerticalIntersect.y <= map.height * tileSize
    ) {
      const cell = map.getGridAt(
        this.#nextVerticalIntersect.x + (this.isFacingLeft ? -1 : 0), // if ray is facing left, force one pixel left so we are inside a grid cell
        this.#nextVerticalIntersect.y
      );
      if (cell === 0) {
        this.#nextVerticalIntersect.set(this.#nextVerticalIntersect.x + xStep, this.#nextVerticalIntersect.y + yStep);
      } else {
        foundVerticalWall = true;
        this.#verticalIntersect.set(this.#nextVerticalIntersect.x, this.#nextVerticalIntersect.y);
        break;
      }
    }

    // Calculate the distance to the closest wall
    const horizontalDistance = foundHorizontalWall
      ? origin.squaredDistanceBetween(this.#horizontalIntersect)
      : Number.MAX_SAFE_INTEGER;
    const verticalDistance = foundVerticalWall
      ? origin.squaredDistanceBetween(this.#verticalIntersect)
      : Number.MAX_SAFE_INTEGER;

    // update the wallHit and wasHitVertical properties
    if (verticalDistance < horizontalDistance) {
      this.wallHit.set(this.#verticalIntersect.x, this.#verticalIntersect.y);
      this.wasHitVertical = true;
    } else {
      this.wallHit.set(this.#horizontalIntersect.x, this.#horizontalIntersect.y);
      this.wasHitVertical = false;
    }

    return this;
  }

  /**
   * Draw the ray to a canvas context
   * @param {CanvasRenderingContext2D} ctx
   * @param {Vec2} origin
   * @returns {this}
   */
  draw2d(ctx, origin) {
    ctx.save();
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(this.wallHit.x, this.wallHit.y);
    ctx.stroke();
    ctx.restore();
    return this;
  }
}
