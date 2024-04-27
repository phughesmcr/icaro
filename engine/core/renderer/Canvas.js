/**
 * @module
 *
 * The Canvas is a wrapper around the HTML5 Canvas API.
 */
export default class Canvas {
  /** @type {OffscreenCanvasRenderingContext2D} */
  #bufferCtx;

  /** @type {CanvasRenderingContext2D} */
  #ctx;

  /** @type {HTMLCanvasElement} */
  #element;

  /** @type {boolean} */
  #dirty = true;

  /** @type {number} */
  #dpi;

  /**
   * Create a new Canvas.
   * @param {HTMLCanvasElement} el
   * @param {number} [dpi]
   */
  constructor(el, dpi = 1) {
    // @ts-ignore
    this.#bufferCtx = new OffscreenCanvas(el.width, el.height).getContext('2d');
    // @ts-ignore
    this.#ctx = el.getContext('2d', { desynchronized: true });
    this.#dpi = Math.floor(dpi);
    this.#element = el;
    Object.seal(this);
  }

  get buffer() {
    return this.#bufferCtx;
  }

  /** @returns {CanvasRenderingContext2D} */
  get ctx() {
    return this.#ctx;
  }

  /** @returns {number} */
  get dpi() {
    return this.#dpi;
  }

  /** @param {number} value */
  set dpi(value) {
    this.#dpi = Math.floor(value);
    this.resize(this.width, this.height);
  }

  /** @returns {HTMLCanvasElement} */
  get element() {
    return this.#element;
  }

  /** @returns {number} */
  get height() {
    return this.#element.height;
  }

  /** @returns {number} */
  get width() {
    return this.#element.width;
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
    this.#bufferCtx.clearRect(0, 0, this.width, this.width);
    this.#dirty = true;
    return this;
  }

  /**
   * Draw an image to the canvas
   * @param {CanvasImageSource} img
   * @param {number} sx
   * @param {number} sy
   * @param {number} sWidth
   * @param {number} sHeight
   * @param {number} [dx]
   * @param {number} [dy]
   * @param {number} [dWidth]
   * @param {number} [dHeight]
   * @returns {this}
   */
  draw(img, sx, sy, sWidth, sHeight, dx = sx, dy = sy, dWidth = sWidth, dHeight = sHeight) {
    this.#bufferCtx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    this.#dirty = true;
    return this;
  }

  /**
   * Setup the canvas
   * @returns {this}
   */
  init() {
    this.#bufferCtx.imageSmoothingEnabled = false;
    this.#ctx.imageSmoothingEnabled = false;
    this.resize(this.#element.width, this.#element.height);
    this.#ctx.save();
    this.#element.tabIndex = 0;
    this.#element.focus();
    return this;
  }

  /**
   * Draw the buffer to the context
   * @returns {this}
   */
  render() {
    this.#bufferCtx.imageSmoothingEnabled = false;
    this.#ctx.imageSmoothingEnabled = false;
    this.#ctx.clearRect(0, 0, this.width, this.height);
    this.#ctx.drawImage(this.#bufferCtx.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
    this.#dirty = false;
    return this;
  }

  /**
   * Reset the canvas
   * @returns {this}
   */
  reset() {
    this.#dirty = true;
    this.#ctx.restore();
    this.#bufferCtx.resetTransform();
    this.#ctx.resetTransform();
    this.#ctx.save();
    this.clear();
    this.#ctx.clearRect(0, 0, this.width, this.height);
    this.resize(this.width, this.height);
    return this;
  }

  resizeDOM() {
    this.element.style.width = '';
    this.element.style.height = '';
    this.element.style.width = `${Math.floor(this.element.offsetWidth)}px`;
    this.element.style.height = `${Math.floor(this.element.offsetHeight)}px`;
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
    this.#element.height = height * this.#dpi;
    this.#element.width = width * this.#dpi;
    this.#ctx.scale(this.#dpi, this.#dpi);
    this.#ctx.save();
    this.#bufferCtx.canvas.height = height;
    this.#bufferCtx.canvas.width = width;
    // this.resizeDOM();
    return this;
  }
}
