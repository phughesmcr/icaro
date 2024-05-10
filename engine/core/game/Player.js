import Mat2 from '../../math/Mat2.js';
import RotVec2 from '../../math/RotVec2.js';
import Vec2 from '../../math/Vec2.js';

export default class Player {
  /** @type {RotVec2} */
  orientation = new RotVec2(0, 1);

  /** @type {Vec2} */
  position = new Vec2(0, 0);

  /** @type {Mat2} */
  rotationMatrix = new Mat2();

  /** @type {number} */
  rotationSpeed = 0.003;

  /** @type {number} */
  movementSpeed = 0.5;

  /** @type {number} */
  turnDirection = 0;

  /** @type {number} */
  walkDirection = 0;

  /** @type {number} */
  radius = 4;

  size = 32;

  constructor() {
    Object.seal(this);
  }

  /**
   * Set the player position
   * @param {number} xTile
   * @param {number} yTile
   * @param {number} tileSize
   */
  placeAt(xTile, yTile, tileSize) {
    const x = tileSize * xTile + (tileSize - this.size) / 2;
    const y = tileSize * yTile + (tileSize - this.size) / 2;
    this.position.set(x, y);
  }

  reset() {
    this.position.set(0, 0);
    this.orientation.set(0, 1);
    this.rotationMatrix.setRotation(this.orientation.x, this.orientation.y);
  }

  /**
   *
   * @param {number} delta
   * @param {import('./GameMap.js').default} map
   * @param {number} tileSize
   * @param {number} [zoom=1]
   */
  update(delta, map, tileSize, zoom = 1) {
    this.orientation.rotateBy(this.turnDirection * this.rotationSpeed * delta);
    this.rotationMatrix.setRotation(this.orientation.x, this.orientation.y);
    const moveStep = this.walkDirection * this.movementSpeed * delta * zoom;
    if (moveStep === 0) return;
    const newPlayerX = this.position.x + this.orientation.x * moveStep;
    const newPlayerY = this.position.y + this.orientation.y * moveStep;
    if (
      !map.isWallAt(
        // tile x
        Math.floor(newPlayerX / (tileSize * zoom)),
        // tile y
        Math.floor(newPlayerY / (tileSize * zoom))
      )
    ) {
      this.position.x = newPlayerX;
      this.position.y = newPlayerY;
    }
  }

  /**
   *
   * @param {CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D} ctx
   * @returns {void}
   */
  draw2d(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.rotationMatrix.rotation);
    ctx.fillStyle = 'red';
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.size, 0);
    ctx.stroke();
    ctx.restore();
  }
}
