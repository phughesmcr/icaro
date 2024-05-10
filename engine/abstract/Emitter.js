/**
 * @module
 *
 * The Emitter class is a simple event emitter implementation.
 */
export default class Emitter {
  /**
   * The event subscription map
   * @type {Map<string, { fn: Function, context?: any }[]>}
   */
  #listeners;

  /**
   * Create a new Emitter.
   * @abstract
   */
  constructor() {
    this.#listeners = new Map();
  }

  /** @returns a copy of the event subscription map. */
  get observers() {
    return Object.fromEntries(this.#listeners.entries());
  }

  /**
   * Subscribes a listener to an event.
   *
   * @param {string} key - The key of the event to subscribe to.
   * @param {Function} observer - The listener/callback function to subscribe.
   * @param {Object} [options] - Optional subscription options.
   * @param {boolean} [options.once] - If `true`, the listener will be automatically unsubscribed after being called.
   * @param {any} [options.context] - The `this` value to use when calling the listener function.
   * @returns {Function} A function that can be used to unsubscribe the listener.
   */
  on(key, observer, options) {
    const { context, once } = options || {};
    if (once) return this.once(key, observer, context);
    if (!this.#listeners.has(key)) {
      this.#listeners.set(key, [{ fn: observer, context }]);
    } else {
      this.#listeners.get(key)?.push({ fn: observer, context });
    }
    return this.removeListener.bind(this, key, observer);
  }

  /**
   * Remove all listeners for a given key.
   *
   * @param {string} key The key of the event to clear.
   * @returns {boolean} `true` if listeners were found and removed, `false` otherwise.
   */
  clearListeners(key) {
    if (this.hasListener(key)) {
      this.#listeners.delete(key);
      return true;
    }
    return false;
  }

  /**
   * Emits an event, calling all subscribed listeners.
   *
   * @param {string} key - The key of the event to emit.
   * @param {Array<any>} args - The arguments to pass to the listener functions.
   * @returns {this} - the event emitter.
   */
  emit(key, ...args) {
    const subscribers = this.#listeners.get(key);
    if (!subscribers) return this;
    for (const subscriber of subscribers) {
      subscriber.fn.apply(subscriber.context, args);
    }
    return this;
  }

  /**
   * Test if a key has listeners.
   *
   * @param {string} key The key of the event to test for.
   * @returns {boolean} `true` if key has listeners, `false` otherwise.
   */
  hasListener(key) {
    return !!((this.#listeners.get(key)?.length ?? -1) > 0);
  }

  /**
   * Unsubscribes a listener from an event.
   *
   * @param {string} key - The key of the event to unsubscribe from.
   * @param {Function} callback - The listener function to unsubscribe.
   * @returns `true` if the listener was successfully unsubscribed, `false` if listener not found.
   */
  removeListener(key, callback) {
    const subscribers = this.#listeners.get(key);
    if (subscribers) {
      const idx = subscribers.findIndex((subscriber) => subscriber.fn === callback);
      if (idx > -1) {
        subscribers.splice(idx, 1);
        return true;
      }
    }
    return false;
  }

  /**
   * Subscribes a listener to an event that will be unsubscribed after being called once.
   *
   * @param {string} key - The key of the event to subscribe to.
   * @param {Function} callback - The listener function to subscribe.
   * @param {Object} [options] - Optional subscription options.
   * @returns - A function that can be used to unsubscribe the listener.
   */
  once(key, callback, options) {
    /** @param {Array<any>} args */
    const onceFn = (...args) => {
      this.removeListener(key, onceFn);
      callback(...args);
    };
    // @ts-ignore
    return this.on(key, onceFn, { ...options, once: false });
  }
}