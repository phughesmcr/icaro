/**
 * @module       Renderer
 * @description  The Renderer class various components required to render the Game object.
 * @author       P. Hughes <code@phugh.es>
 * @copyright    2024. All rights reserved.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { clamp, max, min, ceil, floor } from '../../math/utils.js';
import Vec2 from '../../math/Vec2.js';
import Camera from './Camera.js';
import Canvas from './Canvas.js';
import RayCaster from './raycaster/Raycaster.js';

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
   */
  constructor() {
    this.canvas = new Canvas();
    this.camera = new Camera(this.canvas.width, this.canvas.height);
    this.raycaster = new RayCaster(this.camera.width);
  }

  /**
   *
   * @param {import('../game/Game.js').default} game
   */
  #drawTopDownTileMap(game) {
    const { currentMap, tiles } = game;
    if (!currentMap) return;

    // draw the map
    const tileStartX = max(0, floor(this.camera.x / this.tileSize) - 1);
    const tileStartY = max(0, floor(this.camera.y / this.tileSize) - 1);
    const tileEndX = min(
      tileStartX + ceil(floor(this.canvas.width / this.camera.zoom) / this.tileSize) + this.canvas.dpi + 1,
      currentMap.width
    );
    const tileEndY = min(
      tileStartY + ceil(floor(this.canvas.height / this.camera.zoom) / this.tileSize) + this.canvas.dpi + 1,
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
        this.canvas.ctx.fillStyle = tiles[tile] ?? 'white';
        this.canvas.ctx.fillRect(
          floor(x * this.tileSize),
          floor(y * this.tileSize),
          this.tileSize + this.canvas.dpi,
          this.tileSize + this.canvas.dpi
        );
      }
    }
  }

  /**
   * @param {import('../game/Game.js').default} game
   * @returns {this}
   */
  draw2d(game) {
    this.canvas.clear();
    this.canvas.ctx.save();
    this.canvas.ctx.scale(this.camera.zoom, this.camera.zoom);
    this.canvas.ctx.translate(-this.camera.x, -this.camera.y);

    this.camera.centerOn(game.player.position.x, game.player.position.y);

    this.#drawTopDownTileMap(game);

    game.player.draw2d(this.canvas.ctx);

    this.canvas.ctx.restore();
    return this;
  }

  /**
   *
   * @param {import('../game/Game.js').default} game
   */
  #drawFirstPerson(game) {
    const { currentMap, player, tiles } = game;
    if (!currentMap) return;

    // ceiling
    this.canvas.ctx.fillStyle = currentMap.ceiling;
    this.canvas.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height / this.canvas.dpi / 2);

    // floor
    this.canvas.ctx.fillStyle = currentMap.floor;
    this.canvas.ctx.fillRect(0, this.canvas.height / this.canvas.dpi / 2, this.canvas.width, this.canvas.height);

    // walls
    for (let i = 0; i < this.raycaster.rays.length; i++) {
      const ray = this.raycaster.rays[i];
      if (!ray) continue;

      // get the perpendicular distance to the wall to fix fishbowl distortion
      const correctWallDistance = Vec2.project(Vec2.to(player.position, ray.wallHit), player.orientation);

      // calculate the distance to the projection plane
      const distanceProjectionPlane = ((currentMap.width * this.tileSize) / 2) * (RayCaster.FOCAL_LENGTH / 2);

      // projected wall height
      const wallStripHeight = -(this.tileSize / correctWallDistance) * distanceProjectionPlane;

      this.canvas.ctx.fillStyle = tiles[currentMap.getGridAt(ray.wallHit.x, ray.wallHit.y)] ?? 'white';
      this.canvas.ctx.fillRect(
        i * RayCaster.RAY_WIDTH * this.canvas.dpi,
        this.canvas.height / this.canvas.dpi / 2 - wallStripHeight / 2,
        RayCaster.RAY_WIDTH * this.canvas.dpi,
        wallStripHeight
      );
    }
  }

  /**
   *
   * @param {import('../game/Game.js').default} game
   * @param {number} alpha
   * @returns
   */
  draw3d(game, alpha) {
    this.canvas.clear();
    this.camera.reset();
    this.canvas.ctx.save();
    this.canvas.ctx.scale(this.camera.zoom, this.camera.zoom);
    this.canvas.ctx.translate(-this.camera.x, -this.camera.y);
    this.#drawFirstPerson(game);
    this.canvas.ctx.restore();
    return this;
  }

  /**
   * @param {number} tileSize
   * @returns {this}
   */
  init(tileSize) {
    // @ts-ignore
    this.tileSize = tileSize;
    return this;
  }

  /**
   * Draws the current frame to the canvas.
   * @param {CanvasRenderingContext2D} ctx
   * @returns {this}
   */
  render(ctx) {
    if (this.canvas.isDirty) {
      this.canvas.render(ctx, this.camera);
    }
    return this;
  }
}
