/**
 * @module       Camera
 * @description  A Camera class for rendering to a canvas context with a given viewport size and zoom level.
 * @author       P. Hughes <code@phugh.es>
 * @copyright    2024. All rights reserved.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 * @see          {@link https://github.com/robashton/camera/}
 */

import Vec2 from '../../math/Vec2.js';
import { clamp } from '../../math/utils.js';

export default class Camera {
  height;
  width;
  x = 0;
  y = 0;
  #zoom = 1;

  /**
   * Create a new Camera.
   * @param {number} width
   * @param {number} height
   */
  constructor(width, height) {
    this.height = height;
    this.width = width;
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

    /* (screenPos.x - mainCanvasSize.x/2 + .5) /  cameraScale + cameraPos.x,
      (screenPos.y - mainCanvasSize.y/2 + .5) / -cameraScale + cameraPos.y */
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

    /*    (worldPos.x - cameraPos.x) *  cameraScale + mainCanvasSize.x/2 - .5,
        (worldPos.y - cameraPos.y) * -cameraScale + mainCanvasSize.y/2 - .5 */
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
   * @note remember to resize the raycaster too!
   */
  resize(width, height) {
    this.width = width;
    this.height = height;
    return this;
  }
}
