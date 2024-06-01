/**
 * @module       Utils
 * @description  Shared utility functions.
 * @author       P. Hughes <code@phugh.es>
 * @copyright    2024. All rights reserved.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/** @returns {void} */
export function NOOP() {}

/**
 * @param {URL | string} url
 * @returns {Promise<HTMLImageElement>}
 */
export const loadImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.style.imageRendering = '-moz-crisp-edges';
    img.style.imageRendering = '-webkit-crisp-edges';
    img.style.imageRendering = 'crisp-edges';
    img.style.imageRendering = 'pixelated';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url.toString();
  });

/**
 * @param {(...args: Array<any>) => void} callback
 * @param {number} time
 * @param {any} [thisArg]
 * @returns {(...args: Array<any>) => void}
 */
export const debounce = (callback, time, thisArg) => {
  /** @type {number} */
  let debounceTimer;
  const boundCallback = thisArg ? callback.bind(thisArg) : callback;
  /** @param {Array<any>} args */
  return (...args) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(boundCallback, time, args);
  };
};

/**
 * @param {(...args: Array<any>) => void} callback
 * @param {number} time
 * @param {any} [thisArg]
 * @returns {(...args: Array<any>) => void}
 */
export const throttle = (callback, time, thisArg) => {
  /** @type {boolean} */
  let throttlePause;
  /** @param {Array<any>} args */
  return (...args) => {
    if (throttlePause) return;
    throttlePause = true;
    setTimeout(() => {
      callback.apply(thisArg ? thisArg : this, args);
      throttlePause = false;
    }, time);
  };
};

/**
 * Try to request pointer lock on an element without throwing an error.
 * @param {Element} element
 * @returns {Promise<Element>}
 */
export const requestPointerLockSafely = async (element) => {
  if (!document?.pointerLockElement && element.requestPointerLock) {
    try {
      // @ts-ignore
      await element.requestPointerLock({
        unadjustedMovement: true,
      });
    } catch (_) {}
  }
  return element;
};

/**
 * Try to request fullscreen on an element without throwing an error.
 * @param {Element} element
 * @returns {Promise<Element>}
 */
export const requestFullscreenSafely = async (element) => {
  try {
    if (!document?.fullscreenElement && element.requestFullscreen) {
      await element.requestFullscreen({ navigationUI: 'hide' });
    }
  } catch (_) {}
  return element;
};
