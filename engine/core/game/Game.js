/**
 * @module       Ray
 * @description  A Game is the top-level container for a game world.
 * @author       P. Hughes <code@phugh.es>
 * @copyright    2024. All rights reserved.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { NOOP } from '../../utils.js';
import GameMap from './GameMap.js';
import Player from './Player.js';

/**
 * @typedef {Object} GameSpec
 * @property {import('./GameMap.js').MapSpec[]} maps - an array of maps
 * @property {Array<String>} tiles - an array of tile hex colors
 * @property {number} tileSize - the size of a tile in pixels
 */

export default class Game {
  static DEFAULT_TILESIZE = 64;

  /** @type {number} */
  #currentMap = -1;

  /** @type {Array<GameMap>} */
  #maps = [];

  /** @type {(err: Error) => void} */
  onerror = NOOP;

  /** @type {() => void} */
  onload = NOOP;

  /** @type {(map: GameMap | undefined) => void} */
  onmapchange = NOOP;

  /** @type {Player} */
  #player = new Player();

  /** @type {Array<String>} an array of hex colour strings */
  #tiles = [];

  /** @type {number} */
  #tileSize = Game.DEFAULT_TILESIZE;

  /**
   * @type {GameSpec | undefined}
   */
  #src;

  /** @type {GameMap | undefined} */
  get currentMap() {
    return this.#maps[this.#currentMap];
  }

  /** @returns {boolean} */
  get hasCurrentMap() {
    return this.#currentMap > -1 && this.#currentMap < this.#maps.length;
  }

  /** @returns {Array<GameMap>} A copy of the GameMap array */
  get maps() {
    return [...this.#maps];
  }

  /** @returns {Player} */
  get player() {
    return this.#player;
  }

  /** @returns {GameSpec | undefined} */
  get src() {
    return this.#src;
  }

  /**
   * Load the game data and initialize the engine.
   * @param {GameSpec | undefined} gameData
   */
  set src(gameData) {
    this.reset();
    if (gameData == undefined) return;
    this.init(gameData)
      .then(() => {
        this.onload();
        this.#src = gameData;
      })
      .catch((err) => this.onerror(err));
  }

  /** @returns {Array<String>} */
  get tiles() {
    return this.#tiles;
  }

  /** @returns {number} */
  get tileSize() {
    return this.#tileSize;
  }

  /**
   * Change the current map. Index is 0-based (e.g., the first map is index 0)
   * @param {number} index
   */
  changeMap(index) {
    if (index < 0 || index >= this.#maps.length) return;
    const map = this.#maps[index];
    if (!map) return;

    this.#currentMap = index;

    // setup player entity
    this.#player.reset();
    const playerStart = map.getPlayerGridTile();
    this.#player.placeAt(playerStart.x, playerStart.y, this.tileSize);

    this.onmapchange(this.#maps[index]);
  }

  /**
   * @param {GameSpec} spec
   * @returns {Promise<Game>}
   */
  async init(spec) {
    const { maps, tiles, tileSize } = spec;
    this.#tileSize = tileSize;
    tiles.forEach((tile) => this.#tiles.push(tile));
    maps.forEach((map) => this.#maps.push(new GameMap(map)));
    // TODO: load assets
    return this;
  }

  /** @returns {this} */
  reset() {
    this.#currentMap = -1;
    this.#maps.length = 0;
    this.#player.reset();
    this.#tiles.length = 0;
    this.#tileSize = Game.DEFAULT_TILESIZE;
    this.#src = undefined;
    return this;
  }

  /** @param {number} delta */
  update(delta, zoom = 1) {
    if (this.currentMap) {
      this.#player.update(delta, this.currentMap, this.tileSize, zoom);
    }
    return this;
  }
}
