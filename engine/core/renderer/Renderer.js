import { clamp } from '../../utils.js';
import Camera from './Camera.js';
import Canvas from './Canvas.js';

/**
 * @module
 *
 * The Renderer class is responsible for holding the state of
 * the Canvas and Camera, which are used to render the Game class.
 */
export default class Renderer {
  /** @readonly */
  camera;

  /** @readonly */
  canvas;

  /** @readonly */
  tileSize;

  /**
   * Create a new Renderer.
   * @param {HTMLCanvasElement} canvas
   * @param {number} tileSize - the size of a tile in pixels
   */
  constructor(canvas, tileSize) {
    this.tileSize = Math.round(tileSize);
    this.canvas = new Canvas(canvas, Math.round(globalThis.devicePixelRatio ?? 2));
    this.camera = new Camera(this.canvas.width, this.canvas.height);
    Object.seal(this);
  }

  /**
   * @param {import('../game/Game.js').default} game
   * @returns {this}
   */
  draw2d(game) {
    const { currentMap } = game;
    if (!currentMap) return this;

    this.canvas.clear();

    this.camera.centerOn(game.player.position.x, game.player.position.y);

    this.camera.render(this.canvas.buffer, () => {
      // draw the map
      const tileStartX = Math.max(0, Math.floor(this.camera.x / this.tileSize) - 1);
      const tileStartY = Math.max(0, Math.floor(this.camera.y / this.tileSize) - 1);
      const tileEndX = Math.min(
        tileStartX + Math.ceil(Math.floor(this.canvas.width / this.camera.zoom) / this.tileSize) + this.canvas.dpi + 1,
        currentMap.width
      );
      const tileEndY = Math.min(
        tileStartY + Math.ceil(Math.floor(this.canvas.height / this.camera.zoom) / this.tileSize) + this.canvas.dpi + 1,
        currentMap.height
      );

      const maxX = currentMap.width * this.tileSize;
      const maxY = currentMap.height * this.tileSize;
      const startX = clamp(tileStartX, 0, maxX);
      const startY = clamp(tileStartY, 0, maxY);
      const endX = clamp(tileEndX, 0, maxX);
      const endY = clamp(tileEndY, 0, maxY);

      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const tile = currentMap.getGridAt(x, y);
          this.canvas.buffer.fillStyle = game.tiles[tile] ?? 'white';
          this.canvas.buffer.fillRect(
            Math.floor(x * this.tileSize),
            Math.floor(y * this.tileSize),
            this.tileSize + this.canvas.dpi,
            this.tileSize + this.canvas.dpi
          );
        }
      }

      // draw the player
      game.player.draw2d(this.canvas.buffer);
    });

    if (this.canvas.isDirty) {
      this.canvas.render();
    }

    return this;
  }

  /**
   * @returns {this}
   */
  init() {
    this.canvas.init();
    return this;
  }
}
