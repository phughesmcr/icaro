import type Engine from './core/Engine.js';

declare global {
  var Engine: typeof Engine;
  interface Engine extends Engine {}
}

// @see {@link https://stackoverflow.com/a/53603401}
// @licence {CC BY-SA 4.0}

type Transferable = ArrayBuffer | MessagePort | ImageBitmap | OffscreenCanvas;

interface OffscreenCanvasRenderingContext2D
  extends CanvasState,
    CanvasTransform,
    CanvasCompositing,
    CanvasImageSmoothing,
    CanvasFillStrokeStyles,
    CanvasShadowStyles,
    CanvasFilters,
    CanvasRect,
    CanvasDrawPath,
    CanvasUserInterface,
    CanvasText,
    CanvasDrawImage,
    CanvasImageData,
    CanvasPathDrawingStyles,
    CanvasTextDrawingStyles,
    CanvasPath {
  readonly canvas: OffscreenCanvas;
}

declare var OffscreenCanvasRenderingContext2D: {
  prototype: OffscreenCanvasRenderingContext2D;
  new (): OffscreenCanvasRenderingContext2D;
};

interface OffscreenCanvas extends EventTarget {
  width: number;
  height: number;
  getContext(
    contextId: '2d',
    contextAttributes?: CanvasRenderingContext2DSettings
  ): OffscreenCanvasRenderingContext2D | null;
}

declare var OffscreenCanvas: {
  prototype: OffscreenCanvas;
  new (width: number, height: number): OffscreenCanvas;
};
