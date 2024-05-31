import { Engine } from '../../engine/engine.js';

async function main() {
  // Engine works like the browser Image api
  const engine = new Engine();

  const canvasElement = document.querySelector('canvas#engine');

  engine.game.onload = () => {
    engine.init(canvasElement);
    engine.ticker.start();
    engine.game.changeMap(0);

    console.log(game);
    console.log(engine);
  };

  // handle game errors. Engine errors will simply throw.
  engine.game.onerror = (err) => {
    console.error(err);
  };

  // the game data is a json file
  const game = await fetch('./js/game.json').then((response) => response.json());

  // like the Image api, you set the src to start the loading process
  engine.game.src = game;

  // for debugging purposes only, don't expose these in production
  globalThis.engine = engine;
  globalThis.game = game;
}

window.onload = main;
