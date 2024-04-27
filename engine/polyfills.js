// @ts-nocheck

// gloablThis polyfill
(function (Object) {
  typeof globalThis !== 'object' &&
    (this
      ? get()
      : (Object.defineProperty(Object.prototype, '_T_', {
          configurable: true,
          get: get,
        }),
        _T_));
  function get() {
    var global = this || self;
    global.globalThis = global;
    delete Object.prototype._T_;
  }
})(Object);

// OffscreenCanvas polyfill
(function () {
  if (!globalThis.OffscreenCanvas) {
    globalThis.OffscreenCanvas = class OffscreenCanvas {
      constructor(width, height) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.convertToBlob = () => {
          return new Promise((resolve) => {
            this.canvas.toBlob(resolve);
          });
        };
        return this.canvas;
      }
    };
  }
})();

// Date.now polyfill
(function () {
  if (!Date.now) {
    Date.now = function () {
      return new Date().getTime();
    };
  }
})();

/**
 * performance.now() polyfill
 * @see {@link https://gist.github.com/jalbam/cc805ac3cfe14004ecdf323159ecf40e}
 * @license MIT
 */
(function () {
  if (globalThis.performance && globalThis.performance.now) {
    return;
  }

  globalThis.performance = globalThis.performance || {};

  if (
    globalThis.performance.timing &&
    globalThis.performance.timing.navigationStart &&
    globalThis.performance.mark &&
    globalThis.performance.clearMarks &&
    globalThis.performance.getEntriesByName
  ) {
    globalThis.performance.now = function () {
      globalThis.performance.clearMarks('__PERFORMANCE_NOW__');
      globalThis.performance.mark('__PERFORMANCE_NOW__');
      return globalThis.performance.getEntriesByName('__PERFORMANCE_NOW__')[0].startTime;
    };
  } else if ('now' in globalThis.performance === false) {
    var nowOffset = Date.now();

    if (globalThis.performance.timing && globalThis.performance.timing.navigationStart) {
      nowOffset = globalThis.performance.timing.navigationStart;
    }

    globalThis.performance.now = function now() {
      return Date.now() - nowOffset;
    };
  }
})();

/**
 * requestAnimationFrame polyfill
 */
(function () {
  globalThis.requestAnimationFrame = (function () {
    return (
      globalThis.requestAnimationFrame ||
      globalThis.webkitRequestAnimationFrame ||
      globalThis.mozRequestAnimationFrame ||
      globalThis.oRequestAnimationFrame ||
      globalThis.msRequestAnimationFrame ||
      function (callback, element) {
        return globalThis.setTimeout(function () {
          callback(Date.now());
        }, 1000 / 60);
      }
    );
  })();

  globalThis.cancelRequestAnimationFrame = (function () {
    return (
      globalThis.cancelRequestAnimationFrame ||
      globalThis.webkitCancelRequestAnimationFrame ||
      globalThis.mozCancelRequestAnimationFrame ||
      globalThis.oCancelRequestAnimationFrame ||
      globalThis.msCancelRequestAnimationFrame ||
      globalThis.clearTimeout
    );
  })();
})();
