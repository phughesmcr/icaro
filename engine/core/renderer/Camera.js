import Vec2 from '../../math/Vec2.js';
import { clamp } from '../../utils.js';

/**
 * @module
 * Based on:
 * @see {@link https://github.com/robashton/camera/}
 * @license Unlicensed
 */
export default class Camera {
  height;
  width;
  x;
  y;
  #zoom;

  /**
   * Create a new Camera.
   * @param {number} width
   * @param {number} height
   */
  constructor(width, height) {
    this.height = height;
    this.width = width;
    this.x = 0;
    this.y = 0;
    this.#zoom = 1;
    Object.seal(this);
  }

  get zoom() {
    return this.#zoom;
  }

  set zoom(value) {
    this.#zoom = clamp(value, 0.5, 2);
  }

  /**
   *
   * @param {MouseEvent} evt
   * @returns {Vec2}
   */
  getMouse(evt) {
    return new Vec2(
      (evt.offsetX - this.width / 2) * this.zoom - this.x,
      (evt.offsetY - this.height / 2) * this.zoom - this.y
    );
  }

  /**
   * Centers the camera on a given x, y coordinate
   * @param {number} x
   * @param {number} y
   * @returns {this}
   */
  centerOn(x, y) {
    this.x = x - this.width / this.zoom / 2;
    this.y = y - this.height / this.zoom / 2;
    return this;
  }

  /**
   * Correctly scales and translates the canvas context ahead of rendering
   * @param {CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D} ctx - the canvas context to render to
   * @param {Function} callback - the rendering function
   * @returns {this}
   */
  render(ctx, callback) {
    ctx.save();
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.x, -this.y);
    callback();
    ctx.restore();
    return this;
  }

  /**
   * Zooms by a given factor
   * @param {number} factor
   */
  zoomBy(factor) {
    this.zoom *= factor;
    return this;
  }

  /**
   * Moves the centre of the viewport to new x, y coords (updates Camera.lookAt)
   * @param {number} x
   * @param {number} y
   */
  moveTo(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Transform a coordinate pair from screen coordinates into world coordinates
   * @param {number} x
   * @param {number} y
   * @param {any} [obj]
   * @returns
   */
  screenToWorld(x, y, obj = {}) {
    obj.x = x / this.zoom + this.x;
    obj.y = y / this.zoom + this.y;
    return obj;
  }

  /**
   * Transform a coordinate pair from world coordinates into screen coordinates
   * @param {number} x
   * @param {number} y
   * @param {any} obj
   * @returns
   */
  worldToScreen(x, y, obj = {}) {
    obj.x = (x - this.x) * this.zoom;
    obj.y = (y - this.y) * this.zoom;
    return obj;
  }

  /**
   * Returns true if the given rectangle is visible on the canvas
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @returns {boolean}
   */
  isVisible(x, y, width, height) {
    const { x: screenX, y: screenY } = this.worldToScreen(x, y);
    const screenWidth = width * this.zoom;
    const screenHeight = height * this.zoom;
    if (screenX + screenWidth < 0 || screenX > this.width) return false;
    if (screenY + screenHeight < 0 || screenY > this.height) return false;
    return true;
  }

  /**
   * Resets the camera to default values
   * @returns {this}
   */
  reset() {
    this.x = 0;
    this.y = 0;
    this.zoom = 1;
    return this;
  }

  /**
   * Resizes the camera viewport
   * @param {number} width
   * @param {number} height
   * @returns {this}
   */
  resize(width, height) {
    this.width = width;
    this.height = height;
    return this;
  }
}
