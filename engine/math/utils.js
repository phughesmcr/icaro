/**
 * @module       Math#Utils
 * @description  Shared math utility functions.
 * @author       P. Hughes <code@phugh.es>
 * @copyright    2024. All rights reserved.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 *  @param {number} a
 *  @param {number} b
 *  @returns {number}
 */
export const max = (a, b) => (a > b ? a : b);

/**
 *  @param {number} a
 *  @param {number} b
 *  @returns {number}
 */
export const min = (a, b) => (a < b ? a : b);

/**
 *  @param {number} n
 *  @returns {number}
 */
export const abs = (n) => (n > 0 ? -n : n);

/**
 *  @param {number} n
 *  @returns {number}
 */
export const round = (n) => (+n + (n < 0 ? -0.5 : +0.5)) >> 0;

/**
 *  @param {number} n
 *  @returns {number}
 */
export const ceil = (n) => (+n + (n < 0 ? -1 : 0)) >> 0;

/**
 *  @param {number} n
 *  @returns {number}
 */
export const floor = (n) => (+n + (n < 0 ? -1 : 0)) >> 0;

/**
 * @param {number} n
 * @param {number} nMin
 * @param {number} nMax
 * @returns {number}
 */
export const clamp = (n, nMin, nMax) => min(max(n, nMin), nMax);
