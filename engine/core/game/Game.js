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
  /** @type {number} */
  #currentMap = -1;

  /** @type {Array<GameMap>} */
  #maps;

  /** @type {Player} */
  #player;

  /** @type {Readonly<Array<String>>} */
  #tiles;

  /** @type {number} */
  #tileSize;

  /**
   * Create a new Game
   * @param {GameSpec} spec
   */
  constructor(spec) {
    super();
    const { maps, tiles, tileSize } = spec;
    this.#maps = maps.map((map) => new GameMap(map));
    this.#player = new Player();
    this.#tiles = Object.freeze([...tiles]);
    this.#tileSize = tileSize;
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

  /** @returns {Readonly<Array<String>>} */
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

  /** @returns {Promise<any>} */
  async init() {
    // TODO: load assets
    return [];
  }

  /** @param {number} delta */
  update(delta, zoom = 1) {
    if (this.currentMap) {
      this.#player.update(delta, this.currentMap, this.tileSize, zoom);
    }
    return this;
  }
}
