import Vec2 from '../../math/Vec2.js';
import { clamp } from '../../utils.js';
import Camera from './Camera.js';
import Canvas from './Canvas.js';
import RayCaster from './raycaster/Raycaster.js';

/**
 * @module
 *
 * The Renderer class is responsible for holding the state of
 * the Canvas and Camera, which are used to render the Game class.
 */
export default class Renderer {
  static DEFAULT_TILESIZE = 64;

  /**
   * @readonly
   * @type {Camera}
   */
  camera;

  /**
   * @readonly
   * @type {Canvas}
   */
  canvas;

  /**
   * @readonly
   * @type {RayCaster}
   */
  raycaster;

  /**
   * @readonly
   * @type {number}
   */
  tileSize = Renderer.DEFAULT_TILESIZE;

  /**
   * Create a new Renderer.
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.canvas = new Canvas(canvas, Math.round(globalThis.devicePixelRatio ?? 2));
    this.camera = new Camera(this.canvas.width, this.canvas.height);
    this.raycaster = new RayCaster(this.camera.width);
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

    this.camera.centerOn(Math.round(game.player.position.x), Math.round(game.player.position.y));

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

    return this;
  }

  /**
   *
   * @param {import('../game/Game.js').default} game
   * @param {number} alpha
   * @returns
   */
  draw3d(game, alpha) {
    const { currentMap } = game;
    if (!currentMap) return this;

    this.canvas.clear();

    this.camera.reset();

    this.camera.render(this.canvas.buffer, () => {
      // ceiling
      this.canvas.buffer.fillStyle = currentMap.ceiling;
      this.canvas.buffer.fillRect(0, 0, this.canvas.width, this.canvas.height / this.canvas.dpi / 2);

      // floor
      this.canvas.buffer.fillStyle = currentMap.floor;
      this.canvas.buffer.fillRect(0, this.canvas.height / this.canvas.dpi / 2, this.canvas.width, this.canvas.height);

      // walls
      for (let i = 0; i < this.raycaster.rays.length; i++) {
        const ray = this.raycaster.rays[i];
        if (!ray) continue;

        // get the perpendicular distance to the wall to fix fishbowl distortion
        const correctWallDistance = Vec2.project(Vec2.to(game.player.position, ray.wallHit), game.player.orientation);

        // calculate the distance to the projection plane
        const distanceProjectionPlane = ((currentMap.width * this.tileSize) / 2) * (RayCaster.FOCAL_LENGTH / 2);

        // projected wall height
        const wallStripHeight = -(this.tileSize / correctWallDistance) * distanceProjectionPlane;

        this.canvas.buffer.fillStyle = game.tiles[currentMap.getGridAt(ray.wallHit.x, ray.wallHit.y)] ?? 'white';
        this.canvas.buffer.fillRect(
          i * RayCaster.RAY_WIDTH * this.canvas.dpi,
          this.canvas.height / this.canvas.dpi / 2 - wallStripHeight / 2,
          RayCaster.RAY_WIDTH * this.canvas.dpi,
          wallStripHeight
        );
      }
    });

    return this;
  }

  /**
   * @param {number} tileSize
   * @returns {this}
   */
  init(tileSize) {
    this.tileSize = tileSize;
    this.canvas.init();
    return this;
  }

  render() {
    if (this.canvas.isDirty) {
      this.canvas.render();
    }
  }
}
