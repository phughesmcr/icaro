/**
 * @module       GamePad
 * @description  A GamePad class for handling Gamepad input.
 * @author       P. Hughes <code@phugh.es>
 * @copyright    2024. All rights reserved.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

export default class GamePad {
  /** @type {Set<Gamepad>} */
  #pads = new Set();

  /** @type {Gamepad | null} */
  #activePad = null;

  get activePad() {
    return this.#activePad;
  }

  init() {
    if (typeof navigator.getGamepads !== 'function') return;

    const pads = navigator.getGamepads();
    if (pads.length > 0) {
      // @ts-ignore
      this.#activePad = pads[pads.findIndex((pad) => pad !== null)];
    }

    globalThis.addEventListener('gamepadconnected', (e) => {
      if (e.gamepad) {
        this.#pads.add(e.gamepad);
        if (!this.#activePad) this.#activePad = e.gamepad;
      }
    });

    globalThis.addEventListener('gamepaddisconnected', (e) => {
      this.#pads.delete(e.gamepad);
      if (this.#activePad && this.#activePad === e.gamepad) {
        this.#activePad = null;
      }
    });
  }
}
