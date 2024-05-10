/**
 * @param {URL | string} url
 * @returns {Promise<HTMLImageElement>}
 */
export const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.style.imageRendering = '-moz-crisp-edges';
    img.style.imageRendering = '-webkit-crisp-edges';
    img.style.imageRendering = 'pixelated';
    img.style.imageRendering = 'crisp-edges';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url.toString();
  });
};

/**
 *
 * @param {(...args: Array<any>) => void} callback
 * @param {number} time
 * @param {any} [thisArg]
 * @returns
 */
export const debounce = (callback, time, thisArg) => {
  /** @type {number} */
  let debounceTimer;
  const boundCallback = thisArg ? callback.bind(thisArg) : callback;
  /** @param {Array<any>} args */
  return (...args) => {
    globalThis.clearTimeout(debounceTimer);
    debounceTimer = globalThis.setTimeout(boundCallback, time, args);
  };
};

/**
 *
 * @param {(...args: Array<any>) => void} callback
 * @param {number} time
 * @param {any} [thisArg]
 * @returns
 */
export const throttle = (callback, time, thisArg) => {
  /** @type {boolean} */
  let throttlePause;
  /** @param {Array<any>} args */
  return (...args) => {
    if (throttlePause) return;
    throttlePause = true;
    globalThis.setTimeout(() => {
      callback.apply(thisArg ? thisArg : this, args);
      throttlePause = false;
    }, time);
  };
};

/**
 *
 * @param {number} n
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

/**
 * Try to request pointer lock on an element without throwing an error.
 * @param {Element} element
 * @returns {Promise<Element>}
 */
export const requestPointerLockSafely = async (element) => {
  if (!globalThis.document?.pointerLockElement && element.requestPointerLock) {
    try {
      // @ts-ignore
      await element.requestPointerLock({
        unadjustedMovement: true,
      });
    } catch (_) {
      try {
        element.requestPointerLock();
      } catch (_) {}
    }
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
    if (!globalThis.document?.fullscreenElement && element.requestFullscreen) {
      await element.requestFullscreen({ navigationUI: 'hide' });
    }
  } catch (_) {}
  return element;
};
