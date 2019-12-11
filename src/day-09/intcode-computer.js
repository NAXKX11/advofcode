// Day 9: Sensor Boost
const EventEmitter = require("events");
const { match, abort, aborted } = require("../utils");

const PARAMETER_MODES = {
  POSITION: 0,
  IMMEDIATE: 1,
  RELATIVE: 2
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
  EQUALS: 8,
  ADJUST_RELATIVE_BASE: 9
};

const IO = {
  IN: "input",
  OUT: "output"
};

class Halt extends Error {}

function createIntcodeComputer(program = "", debug_options = {}) {
  const { mode = PROGRAM_MODES.OUTPUT } = debug_options;
  const memory = program.split(",").map(Number);

  const emitter = new EventEmitter();

  const input = [];
  emitter.on(IO.IN, values => input.push(...values));

  const output = [];
  emitter.on(IO.OUT, value => output.push(value));

  async function readInput() {
    return input.length > 0
      ? input.shift()
      : new Promise(emitter.once.bind(emitter, IO.IN)).then(readInput);
  }

  let instruction_pointer = 0;
  let relative_base_pointer = 0;
  async function IntcodeComputer() {
    try {
      while (instruction_pointer < memory.length) {
        const { operation, readParam, write, advance } = parseOperator(
          memory,
          instruction_pointer,
          relative_base_pointer
        );

        const next_position = await match(operation, {
          [CODES.HALT]: () => abort(),
          [CODES.ADDITION]: () => write(readParam() + readParam()),
          [CODES.MULTIPLICATION]: () => write(readParam() * readParam()),
          [CODES.READ]: () => readInput().then(write),
          [CODES.WRITE]: () => {
            emitter.emit(IO.OUT, readParam(), output.length);
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
          [CODES.LESS_THAN]: () => write(readParam() < readParam() ? 1 : 0),
          [CODES.EQUALS]: () => write(readParam() === readParam() ? 1 : 0),
          [CODES.ADJUST_RELATIVE_BASE]() {
            relative_base_pointer += readParam();
          }
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

  return {
    run() {
      return IntcodeComputer();
    },
    input(...values) {
      emitter.emit(
        IO.IN,
        [].concat(values).filter(x => x !== undefined)
      );
    },
    output(cb) {
      emitter.on(IO.OUT, cb);
      return () => emitter.off(IO.OUT);
    }
  };
}

function parseOperator(memory, instruction_pointer = 0, relative_pointer = 0) {
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

  function resolvePosition() {
    const position = ++local_instruction_pointer;

    // Get the position from memory based on the PARAMETER_MODE
    return match(
      param_modes.length > 0 ? param_modes.shift() : PARAMETER_MODES.POSITION,
      {
        [PARAMETER_MODES.POSITION]: () => memory[position],
        [PARAMETER_MODES.IMMEDIATE]: () => position,
        [PARAMETER_MODES.RELATIVE]: () => memory[position] + relative_pointer
      }
    );
  }

  return {
    // Expose the operation
    operation,

    // Expose a set of utils
    readParam() {
      return memory[resolvePosition()];
    },
    write(value) {
      memory[resolvePosition()] = value;
    },
    advance: () => local_instruction_pointer - instruction_pointer + 1
  };
}

function halted(err) {
  return err instanceof Halt;
}

module.exports = { halted, PROGRAM_MODES, createIntcodeComputer };
