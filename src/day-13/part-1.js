// Day 13: Care Package

const { createIntcodeComputer } = require("../day-09/intcode-computer");
const { match } = require("../utils");

const TILES = {
  EMPTY: 0,
  WALL: 1,
  BLOCK: 2,
  PADDLE: 3,
  BALL: 4
};

const ACTION = {
  SET_X: 0,
  SET_Y: 1,
  SET_TILE: 2
};

module.exports = async function arcadeCabinet(program) {
  const painted_tiles = new Map();
  const computer = createIntcodeComputer(program);
  const position = { x: 0, y: 0 };

  // Let's see what we get
  computer.output((value, index) => {
    match(index % 3, {
      [ACTION.SET_X]() {
        position.x = value;
      },
      [ACTION.SET_Y]() {
        position.y = value;
      },
      [ACTION.SET_TILE]() {
        painted_tiles.set(point(position.x, position.y), value);
      }
    });
  });

  // Run the computer
  await computer.run();

  // How many blocks tiles are on the screen?
  return [...painted_tiles.values()].filter(tile => tile === TILES.BLOCK)
    .length;
};

function point(x, y) {
  return `(${x}, ${y})`;
}
