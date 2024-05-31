/**
 * @module       Canvas
 * @description  A wrapper around the HTML5 Canvas API.
 * @author       P. Hughes <code@phugh.es>
 * @copyright    2024. All rights reserved.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

export default class Canvas {
  /** @type {OffscreenCanvasRenderingContext2D} */
  #bufferCtx;

  /** @type {boolean} */
  #dirty;

  /** @type {number} */
  #dpi;

  constructor(width = 640, height = 480, dpi = 2) {
    // @ts-ignore
    this.#bufferCtx = new OffscreenCanvas(width, height).getContext('2d');
    this.#bufferCtx.imageSmoothingEnabled = false;
    this.#dpi = Math.floor(dpi);
    this.#dirty = true;
  }

  /** @returns {OffscreenCanvasRenderingContext2D} */
  get ctx() {
    return this.#bufferCtx;
  }

  /** @returns {number} */
  get dpi() {
    return this.#dpi;
  }

  /** @param {number} value */
  set dpi(value) {
    this.#dpi = Math.abs(Math.floor(value) || 1);
    this.resize(this.width, this.height);
  }

  /** @returns {number} */
  get height() {
    return this.#bufferCtx.canvas.height;
  }

  /** @returns {number} */
  get width() {
    return this.#bufferCtx.canvas.width;
  }

  /** @returns {boolean} */
  get isDirty() {
    return this.#dirty;
  }

  /**
   * Clear the canvas
   * @returns {this}
   */
  clear() {
    this.#dirty = true;
    this.#bufferCtx.clearRect(
      //
      0,
      0,
      this.#bufferCtx.canvas.width,
      this.#bufferCtx.canvas.height
    );
    return this;
  }

  /**
   * Draw the buffer to the context
   * @param {CanvasRenderingContext2D} ctx
   * @param {import('./Camera.js').default} [camera]
   * @returns {this}
   */
  render(ctx, camera) {
    this.#bufferCtx.imageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    ctx.clearRect(0, 0, this.width, this.height);

    ctx.drawImage(
      //
      this.#bufferCtx.canvas,
      camera?.x || 0,
      camera?.y || 0,
      this.#bufferCtx.canvas.width,
      this.#bufferCtx.canvas.height,
      0,
      0,
      this.#bufferCtx.canvas.width,
      this.#bufferCtx.canvas.height
    );

    this.#dirty = false;

    return this;
  }

  /**
   * Reset the canvas
   * @returns {this}
   */
  reset() {
    this.clear(); // NOTE: add this.clear() if this is removed
    this.#bufferCtx.restore(); // NOTE: can be removed once .reset() is widely supported
    this.#bufferCtx.resetTransform();
    this.#bufferCtx.reset && this.#bufferCtx.reset(); // NOTE: .reset() new in 2023
    this.resize(this.width, this.height); // NOTE: add this.#bufferCtx.save() if this is removed
    return this;
  }

  /**
   * Resize the canvas
   * @param {number} width
   * @param {number} height
   * @returns {this}
   */
  resize(width, height) {
    this.#dirty = true;
    this.#bufferCtx.canvas.height = height * this.#dpi;
    this.#bufferCtx.canvas.width = width * this.#dpi;
    this.#bufferCtx.scale(this.#dpi, this.#dpi);
    this.#bufferCtx.save();
    return this;
  }
}
