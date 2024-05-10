import Emitter from '../../abstract/Emitter.js';
import GameMap from './GameMap.js';
import Player from './Player.js';

/**
 * @typedef {Object} GameSpec
 * @property {import('./GameMap.js').MapSpec[]} maps - an array of maps
 * @property {Array<String>} tiles - an array of tile hex colors
 * @property {number} tileSize - the size of a tile in pixels
 */

/**
 * @module
 *
 * A Game is the top-level container for a game world.
 */
export default class Game extends Emitter {
  static DEFAULT_TILESIZE = 64;

  /** @type {number} */
  #currentMap = -1;

  /** @type {Array<GameMap>} */
  #maps = [];

  /** @type {Player} */
  #player = new Player();

  /** @type {Array<String>} */
  #tiles = [];

  /** @type {number} */
  #tileSize = Game.DEFAULT_TILESIZE;

  /**
   * Create a new Game
   */
  constructor() {
    super();
    Object.seal(this);
  }

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
    this.emit('mapChange', this.#maps[index]);
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

  /** @param {number} delta */
  update(delta, zoom = 1) {
    if (this.currentMap) {
      this.#player.update(delta, this.currentMap, this.tileSize, zoom);
    }
    return this;
  }
}
