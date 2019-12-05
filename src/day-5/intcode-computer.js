// Day 5: Sunny with a Chance of Asteroids

const { match, abort, aborted } = require("../utils");

const PARAMETER_MODES = {
  POSITION_MODE: 0,
  IMMEDIATE_MODE: 1
};

const PROGRAM_MODES = {
  OUTPUT: 0,
  MEMORY: 1,
  BOTH: 2
};

const CODES = {
  HALT: 99,
  ADDITION: 1,
  MULTIPLICATION: 2,
  READ: 3,
  WRITE: 4,
  JUMP_IF_TRUE: 5,
  JUMP_IF_FALSE: 6,
  LESS_THAN: 7,
  EQUALS: 8
};

function IntcodeComputer(program = "", input = [], debug_options = {}) {
  const { mode = PROGRAM_MODES.OUTPUT } = debug_options;
  const memory = program.split(",").map(Number);
  const output = [];

  try {
    let instruction_pointer = 0;
    while (instruction_pointer < memory.length) {
      const { operation, readParam, write, advance } = parseOperator(
        memory,
        instruction_pointer
      );

      const next_position = match(operation, {
        [CODES.HALT]: () => void abort(),
        [CODES.ADDITION]: () => void write(readParam() + readParam()),
        [CODES.MULTIPLICATION]: () => void write(readParam() * readParam()),
        [CODES.READ]: () => {
          console.assert(input.length > 0, "Not enough input arguments");
          write(input.shift());
        },
        [CODES.WRITE]: () => void output.push(readParam()),
        [CODES.JUMP_IF_TRUE]: () => {
          const param1 = readParam();
          const param2 = readParam();

          if (param1 !== 0) {
            return param2; // Returning the new position
          }
        },
        [CODES.JUMP_IF_FALSE]: () => {
          const param1 = readParam();
          const param2 = readParam();

          if (param1 === 0) {
            return param2; // Returning the new position
          }
        },
        [CODES.LESS_THAN]: () => void write(readParam() < readParam() ? 1 : 0),
        [CODES.EQUALS]: () => void write(readParam() === readParam() ? 1 : 0)
      });

      if (next_position) {
        instruction_pointer = next_position;
      } else {
        instruction_pointer += advance();
      }
    }
  } catch (err) {
    if (!aborted(err)) {
      throw err;
    }
  }

  return match(mode, {
    [PROGRAM_MODES.OUTPUT]: () => output,
    [PROGRAM_MODES.MEMORY]: () => memory,
    [PROGRAM_MODES.BOTH]: () => ({ memory, output })
  });
}

function parseOperator(memory, instruction_pointer = 0) {
  const input = `${memory[instruction_pointer] || ""}`;
  // A single instruction set should consist of 5 digits:
  // - param1_mode: 0 | 1
  // - param2_mode: 0 | 1
  // - paramn_mode: 0 | 1
  // - opcode: 01 - 99
  const modes = input.slice(0, input.length - 2);
  const operator = input.slice(input.length - 2);

  const param_modes = modes.split("").reverse();
  const operation = `${Number(operator)}`;

  // Keep track of a local instruction pointer so that we can increase this for
  // our parameters
  let local_instruction_pointer = instruction_pointer;

  return {
    // Expose the operation
    operation,

    // Expose a set of utils
    readParam() {
      const position = ++local_instruction_pointer;

      // Get the param value from memory based on the PARAMETER_MODE
      return match(param_modes.length > 0 ? param_modes.shift() : 0, {
        [PARAMETER_MODES.POSITION_MODE]: () => memory[memory[position]],
        [PARAMETER_MODES.IMMEDIATE_MODE]: () => memory[position]
      });
    },
    write(value) {
      const position = ++local_instruction_pointer;

      // Set the value in memory based on the PARAMETER_MODE
      match(param_modes.length > 0 ? param_modes.shift() : 0, {
        [PARAMETER_MODES.POSITION_MODE]() {
          memory[memory[position]] = value;
        },
        [PARAMETER_MODES.IMMEDIATE_MODE]() {
          memory[position] = value;
        }
      });
    },
    advance: () => local_instruction_pointer - instruction_pointer + 1
  };
}

IntcodeComputer.PROGRAM_MODES = PROGRAM_MODES;

module.exports = IntcodeComputer;
