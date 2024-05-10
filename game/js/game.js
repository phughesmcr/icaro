import { Engine } from '../../engine/engine.js';

async function main() {
  const game = await fetch('./js/game.json')
    .then((response) => response.json())
    .catch((err) => {
      console.error('Failed to load game data');
      throw err;
    });

  // @ts-ignore
  globalThis.game = game;

  const engine = new Engine({
    canvas: document.querySelector('canvas#engine'),
    game,
  });

  await engine.init();
  engine.start();
  engine.changeMap(0);

  // @ts-ignore
  globalThis.engine = engine;
}

window.onload = main;