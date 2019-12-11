// Day 11: Space Police

const { createIntcodeComputer } = require("../day-09/intcode-computer");
const { match, range, table } = require("../utils");

const COLORS = {
  BLACK: 0,
  WHITE: 1
};

const TURN = {
  LEFT_90_DEGREES: 0,
  RIGHT_90_DEGREES: 1
};

const DIRECTION = {
  UP: "^",
  LEFT: "<",
  RIGHT: ">",
  DOWN: "v"
};

const ACTION = {
  COLOR: 0,
  TURN: 1
};

module.exports = async function spacePolice(program) {
  const painted_panels_map = new Map();
  const computer = createIntcodeComputer(program);
  const position = { x: 0, y: 0 };
  const state = {
    color: COLORS.WHITE,
    direction: DIRECTION.UP
  };

  // Let's see what we get
  computer.output((value, index) => {
    match(index % 2, {
      [ACTION.COLOR]() {
        painted_panels_map.set(point(position.x, position.y), value);
        state.color = value;
      },
      [ACTION.TURN]() {
        match(state.direction, {
          [DIRECTION.UP]() {
            match(value, {
              [TURN.LEFT_90_DEGREES]() {
                state.direction = DIRECTION.LEFT;
                position.x -= 1;
              },
              [TURN.RIGHT_90_DEGREES]() {
                state.direction = DIRECTION.RIGHT;
                position.x += 1;
              }
            });
          },
          [DIRECTION.DOWN]() {
            match(value, {
              [TURN.LEFT_90_DEGREES]() {
                state.direction = DIRECTION.RIGHT;
                position.x += 1;
              },
              [TURN.RIGHT_90_DEGREES]() {
                state.direction = DIRECTION.LEFT;
                position.x -= 1;
              }
            });
          },
          [DIRECTION.LEFT]() {
            match(value, {
              [TURN.LEFT_90_DEGREES]() {
                state.direction = DIRECTION.DOWN;
                position.y += 1;
              },
              [TURN.RIGHT_90_DEGREES]() {
                state.direction = DIRECTION.UP;
                position.y -= 1;
              }
            });
          },
          [DIRECTION.RIGHT]() {
            match(value, {
              [TURN.LEFT_90_DEGREES]() {
                state.direction = DIRECTION.UP;
                position.y -= 1;
              },
              [TURN.RIGHT_90_DEGREES]() {
                state.direction = DIRECTION.DOWN;
                position.y += 1;
              }
            });
          }
        });

        // Give the computer the color input again
        computer.input(
          painted_panels_map.get(point(position.x, position.y)) || COLORS.BLACK
        );
      }
    });
  });

  // Start with giving the computer the current color
  computer.input(state.color);

  // Run the computer
  await computer.run();

  // What did we draw?
  return visualize(painted_panels_map);
};

function visualize(map) {
  return range(5 + 1)
    .map(columnIdx => {
      return range(40 + 1)
        .map(rowIdx => {
          const position = point(rowIdx, columnIdx);
          return match(map.has(position) ? map.get(position) : COLORS.BLACK, {
            [COLORS.BLACK]: () => " ",
            [COLORS.WHITE]: () => "#"
          });
        })
        .join("");
    })
    .join("\n");
}

function point(x, y) {
  return `(${x}, ${y})`;
}
