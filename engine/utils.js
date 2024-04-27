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
