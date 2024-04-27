/**
 * @typedef {Object} MapSpec
 * @property {number} width - the width of the map in tiles
 * @property {number} height - the height of the map in tiles
 * @property {Array<number>} grid - the grid layer of the map (walls)
 * @property {Array<number>} things - the things layer of the map (enemies, items, etc)
 * @property {string} floor - floor color
 * @property {string} ceiling - ceiling color
 */

import Vec2 from '../../math/Vec2.js';

export default class GameMap {
  static TILES = [
    // brick
    '#FF0000',
    // grass
    '#00FF00',
    // water
    '#0000FF',
    // wood
    '#8B4513',
    // stone
    '#A9A9A9',
    // sand
    '#FFD700',
  ];

  /**
   * @readonly
   * @type {string}
   */
  ceiling;

  /**
   * @readonly
   * @type {string}
   */
  floor;

  /**
   * @readonly
   * @type {number}
   */
  height;

  /**
   * @readonly
   * @type {number}
   */
  width;

  /**
   * @type {Uint8ClampedArray}
   * 0 = passable
   * >=1 = wall
   */
  #grid;

  /**
   * @type {Uint8ClampedArray}
   * 0 = empty
   * 1 = player start
   */
  #things;

  /**
   * Create a new GameMap
   * @param {MapSpec} spec
   */
  constructor(spec) {
    const { grid, height, width, things, ceiling, floor } = spec;
    this.width = width;
    this.height = height;
    this.ceiling = ceiling;
    this.floor = floor;
    this.#grid = new Uint8ClampedArray(grid);
    this.#things = new Uint8ClampedArray(things);
    if (this.#grid.length !== width * height || this.#things.length !== width * height) {
      throw new Error('Invalid map data');
    }
    Object.seal(this);
  }

  get grid() {
    return this.#grid;
  }

  get things() {
    return this.#things;
  }

  /**
   * Get the grid (walls) value at the given coordinates
   * @param {number} x - the map column
   * @param {number} y - the map row
   * @returns {number} - the map value at the given coordinates
   * @note returns 0 if the coordinates are out of bounds
   */
  getGridAt(x, y) {
    return this.#grid[this.toIndex(x, y)] || 0;
  }

  /**
   * Return the index of the given coordinates
   * @param {number} x
   * @param {number} y
   * @returns
   */
  toIndex(x, y) {
    return Math.floor(x + y * this.width);
  }

  /**
   * Return the coordinates of the given index
   * @param {number} idx
   * @returns {Vec2}
   */
  toTile(idx) {
    return new Vec2(idx % this.width, Math.floor(idx / this.width));
  }

  /**
   * Find the player start coordinates in the map
   * @returns {Vec2} - the player start coordinates or -1, -1 if not found
   */
  getPlayerGridTile() {
    const idx = this.#things.indexOf(1);
    if (idx === -1) return new Vec2(-1, -1);
    return this.toTile(idx);
  }

  /**
   * Get the thing (enemy/items/etc) value at the given coordinates
   * @param {number} x - the map column
   * @param {number} y - the map row
   * @returns {number} - the map value at the given coordinates
   * @note returns 0 if the coordinates are out of bounds
   */
  getThingAt(x, y) {
    return this.#things[this.toIndex(x, y)] || 0;
  }

  /**
   * Check if there is a wall at the given map coordinates
   * @param {number} x - the map column
   * @param {number} y - the map row
   * @returns {boolean} - true if the given grid coordinates !== 0
   */
  isWallAt(x, y) {
    return this.getGridAt(x, y) !== 0;
  }

  /**
   * Check if there is a thing at the given map coordinates
   * @param {number} x - the map column
   * @param {number} y - the map row
   * @returns {boolean} - true if the given thing at coordinates !== 0
   */
  isThingAt(x, y) {
    return this.getThingAt(x, y) !== 0;
  }
}
