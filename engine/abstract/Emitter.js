/**
 * @module       Emitter
 * @description  A simple event emitter class
 * @author       P. Hughes <code@phugh.es>
 * @copyright    2024. All rights reserved.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

export default class Emitter {
  /**
   * The event subscription map
   * @type {Map<string, Function[]>}
   */
  #listeners = new Map();

  /** @returns {Record<string, Function[]>} a copy of the event subscription map. */
  get observers() {
    return Object.fromEntries(this.#listeners.entries());
  }

  /**
   * Subscribes a listener to an event.
   *
   * @param {string} key - The key of the event to subscribe to.
   * @param {Function} observer - The listener/callback function to subscribe.
d   * @returns {Function} A function that can be used to unsubscribe the listener.
   */
  on(key, observer) {
    if (!this.#listeners.has(key)) {
      this.#listeners.set(key, [observer]);
    } else {
      this.#listeners.get(key)?.push(observer);
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
   * @param {any} [payload] - Optional argArray to send to `subscriber.fn.call(thisArg, payload)`.
   * @returns {this} - the event emitter.
   */
  emit(key, payload) {
    const subscribers = this.#listeners.get(key);
    if (!subscribers || !subscribers.length) return this;
    for (const subscriber of subscribers) {
      subscriber(payload);
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
    if (subscribers && subscribers.length) {
      const idx = subscribers.findIndex((subscriber) => subscriber === callback);
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
   * @returns - A function that can be used to unsubscribe the listener.
   */
  once(key, callback) {
    /** @param {Array<any>} args */
    const onceFn = (...args) => {
      this.removeListener(key, onceFn);
      callback(...args);
    };
    // @ts-ignore
    return this.on(key, onceFn);
  }
}
