/**
 * @module       Ticker
 * @description  A fixed-rate game loop
 * @author       P. Hughes <code@phugh.es>
 * @copyright    2024. All rights reserved.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Emitter from '../abstract/Emitter.js';
import { floor } from '../math/utils.js';

export default class Ticker extends Emitter {
  /** @type {number} */
  static DEFAULT_TICK_RATE = 60;

  /** @type {number} */
  static DEFAULT_MAX_LAG_FRAMES = 4;

  /** @type {number | null} */
  #animationFrame = null;

  /** @type {number} */
  #fps = 0;

  /** @type {number} */
  #framesInPastSecond = 0;

  /** @type {number} */
  #lag = 0;

  /** @type {boolean} */
  #paused = false;

  /** @type {number|null} */
  #previousTime = null;

  /** @type {number} */
  #tickRate = Ticker.DEFAULT_TICK_RATE;

  /** @type {number} */
  #tickDurationMs = 1000 / this.#tickRate;

  /** @type {number} */
  #maxLag = Ticker.DEFAULT_MAX_LAG_FRAMES * this.#tickRate;

  /**
   * Create a new Ticker
   */
  constructor() {
    super();
  }

  /** @returns {number} */
  get fps() {
    return this.#fps;
  }

  /** @returns {boolean} */
  get isStopped() {
    return this.#animationFrame === null;
  }

  /** @returns {boolean} */
  get isPaused() {
    return this.#paused;
  }

  /** @returns {number} */
  get tickDurationMs() {
    return this.#tickDurationMs;
  }

  /**
   * @param {number} ticksPerSecond
   * @example ticker.tickRate = 60; // sets the tick rate to 60 ticks per second
   */
  set tickRate(ticksPerSecond) {
    this.#tickRate = ticksPerSecond;
    this.#tickDurationMs = 1000 / this.#tickRate;
    this.#maxLag = Ticker.DEFAULT_MAX_LAG_FRAMES * this.#tickRate;
  }

  /**
   * Pauses but does not stop the game loop
   * @fires Ticker#pause
   * @returns {this}
   */
  pause() {
    if (!this.#animationFrame || this.#paused) return this;
    this.#paused = true;
    this.emit('pause');
    return this;
  }

  /**
   * Resumes the game loop if it was paused
   * @fires Ticker#resume
   * @returns {this}
   */
  resume() {
    if (!this.#animationFrame || !this.#paused) return this;
    this.#paused = false;
    this.#previousTime = performance.now();
    this.emit('resume');
    return this;
  }

  /**
   * Start the game loop
   * @fires Ticker#start
   * @returns {this}
   */
  start() {
    // bail early if we're just paused
    if (this.#animationFrame) {
      this.resume();
      return this;
    }

    /** @param {number} time */
    const run = (time) => {
      this.#animationFrame = requestAnimationFrame(run);
      this.#paused = false;
      if (!this.#previousTime) this.#previousTime = time;
      this.#step(time);
    };

    this.#animationFrame = requestAnimationFrame(run);
    this.emit('start');
    return this;
  }

  /**
   * Advance the game loop by one frame
   * @param {number} [time] - The current time in milliseconds. Defaults to performance.now()
   * @fires Ticker#preUpdate
   * @fires Ticker#update
   * @fires Ticker#postUpdate
   */
  #step(time = performance.now()) {
    if (this.#paused) return;

    // calculate the time since the last frame
    let delta = time - (this.#previousTime || time);
    if (delta > this.#maxLag) {
      delta = this.tickDurationMs;
    }
    this.#lag += delta;

    // update the game state
    this.emit('preUpdate');
    while (this.#lag >= this.tickDurationMs) {
      this.emit('update', this.tickDurationMs);
      this.#lag -= this.tickDurationMs;
    }

    // update FPS
    this.#framesInPastSecond++;
    if (time > (this.#previousTime || time) + 1000) {
      this.#fps = floor((this.#framesInPastSecond * 1000) / (time - (this.#previousTime || time)));
      this.#previousTime = time;
      this.#framesInPastSecond = 0;
    }

    this.#previousTime = time;

    // NOTE: emit already checks if the event exists but this avoids the overhead of division
    if (this.hasListener('postUpdate')) {
      this.emit('postUpdate', this.#lag / this.tickDurationMs);
    }
  }

  /**
   * Stop the game loop
   * @returns {this}
   * @fires Ticker#stop
   */
  stop() {
    if (!this.#animationFrame) return this;
    cancelAnimationFrame(this.#animationFrame);
    this.#animationFrame = null;
    this.#paused = false;
    this.emit('stop');
    return this;
  }
}
