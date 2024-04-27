import Emitter from '../abstract/Emitter.js';

/**
 * @module
 *
 * The Ticker is responsible for running the game loop
 */
export default class Ticker extends Emitter {
  /** @type {number} */
  static DEFAULT_TICK_RATE = 60;

  /** @type {number} */
  static DEFAULT_MAX_LAG_FRAMES = 4;

  /** @type {number | null} */
  #animationFrame = null;

  /** @type {number} */
  #frames = 0;

  /** @type {number} */
  #fps = 0;

  /** @type {number} */
  #lag = 0;

  /** @type {boolean} */
  #paused = false;

  /** @type {number|null} */
  #previousTime = null;

  /**
   * @readonly
   * @type {number}
   */
  tickRate = Ticker.DEFAULT_TICK_RATE;

  /**
   * @readonly
   * @type {number}
   */
  tickDuration = 1000 / this.tickRate;

  /**
   * @readonly
   * @type {number}
   */
  maxLag = Ticker.DEFAULT_MAX_LAG_FRAMES * this.tickRate;

  /**
   * Create a new Ticker
   */
  constructor() {
    super();
    Object.seal(this);
  }

  /** @returns {boolean} */
  get isStopped() {
    return this.#animationFrame === null;
  }

  /** @returns {boolean} */
  get isPaused() {
    return this.#paused;
  }

  getFPS() {
    return this.#fps;
  }

  /**
   * Pauses but does not stop the game loop
   * @returns {this}
   * @fires Ticker#pause
   */
  pause() {
    if (!this.#animationFrame || this.#paused) return this;
    this.#paused = true;
    this.emit('pause');
    return this;
  }

  /**
   * Resumes the game loop if it was paused
   * @returns {this}
   * @fires Ticker#resume
   */
  resume() {
    if (!this.#animationFrame || !this.#paused) return this;
    this.#paused = false;
    this.#previousTime = globalThis.performance.now();
    this.emit('resume');
    return this;
  }

  /**
   * Start the game loop
   * @returns {this}
   * @fires Ticker#start
   */
  start() {
    if (this.#animationFrame) {
      this.resume();
      return this;
    }

    /** @param {number} time */
    const run = (time) => {
      this.#animationFrame = globalThis.requestAnimationFrame(run);
      this.#paused = false;
      if (!this.#previousTime) this.#previousTime = time;
      this.#step(time);
    };

    this.#animationFrame = globalThis.requestAnimationFrame(run);
    this.emit('start');
    return this;
  }

  /**
   * Advance the game loop by one frame
   * @param {number} [time] - The current time in milliseconds. Defaults to performance.now()
   * @returns {this}
   * @fires Ticker#preUpdate
   * @fires Ticker#update
   * @fires Ticker#postUpdate
   */
  #step(time = globalThis.performance.now()) {
    if (this.#paused) return this;
    let delta = time - (this.#previousTime || time);
    if (delta > this.maxLag) {
      delta = this.tickDuration;
    }
    this.#lag += delta;
    this.emit('preUpdate');
    while (this.#lag >= this.tickDuration) {
      this.emit('update', this.tickDuration);
      this.#lag -= this.tickDuration;
    }
    this.#frames++;
    if (time > (this.#previousTime || time) + 1000) {
      this.#fps = Math.round((this.#frames * 1000) / (time - (this.#previousTime || time)));
      this.#previousTime = time;
      this.#frames = 0;
    }
    this.#previousTime = time;
    this.emit('postUpdate', this.#lag / this.tickDuration);
    return this;
  }

  /**
   * Stop the game loop
   * @returns {this}
   * @fires Ticker#stop
   */
  stop() {
    if (!this.#animationFrame) return this;
    globalThis.cancelAnimationFrame(this.#animationFrame);
    this.#animationFrame = null;
    this.#paused = false;
    this.emit('stop');
    return this;
  }
}
