// Day 7: Amplification Circuit

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

class Halt extends Error {}

function createIntcodeComputer(program = "", debug_options = {}) {
  const { mode = PROGRAM_MODES.OUTPUT } = debug_options;
  const memory = program.split(",").map(Number);

  const input = [];
  const output = [];

  const output_channels = [];
  let pending_input = { resolve: () => {} };

  function readInput() {
    if (input.length > 0) {
      return input.shift();
    }

    return new Promise(resolve => {
      pending_input.resolve = resolve;
    }).then(readInput);
  }

  let instruction_pointer = 0;
  async function IntcodeComputer() {
    try {
      while (instruction_pointer < memory.length) {
        const { operation, readParam, write, advance } = parseOperator(
          memory,
          instruction_pointer
        );

        const next_position = await match(operation, {
          [CODES.HALT]() {
            abort();
          },
          [CODES.ADDITION]() {
            write(readParam() + readParam());
          },
          [CODES.MULTIPLICATION]() {
            write(readParam() * readParam());
          },
          async [CODES.READ]() {
            write(await readInput());
          },
          [CODES.WRITE]() {
            const value = readParam();
            output.push(value);
            output_channels.forEach(channel => channel(value));
          },
          [CODES.JUMP_IF_TRUE]() {
            const param1 = readParam();
            const param2 = readParam();

            if (param1 !== 0) {
              return param2; // Returning the new position
            }
          },
          [CODES.JUMP_IF_FALSE]() {
            const param1 = readParam();
            const param2 = readParam();

            if (param1 === 0) {
              return param2; // Returning the new position
            }
          },
          [CODES.LESS_THAN]() {
            write(readParam() < readParam() ? 1 : 0);
          },
          [CODES.EQUALS]() {
            write(readParam() === readParam() ? 1 : 0);
          }
        });

        if (next_position) {
          instruction_pointer = next_position;
        } else {
          instruction_pointer += advance();
        }
      }
    } catch (err) {
      if (aborted(err)) {
        throw Object.assign(new Halt("Halted."), { output, memory });
      }

      throw err;
    }

    return match(mode, {
      [PROGRAM_MODES.OUTPUT]: () => output,
      [PROGRAM_MODES.MEMORY]: () => memory,
      [PROGRAM_MODES.BOTH]: () => ({ memory, output })
    });
  }

  return {
    run() {
      return IntcodeComputer();
    },
    input(...values) {
      input.push(...values);
      pending_input.resolve();
    },
    output(cb) {
      output_channels.push(cb);
    }
  };
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

function halted(err) {
  return err instanceof Halt;
}

module.exports = { halted, PROGRAM_MODES, createIntcodeComputer };
