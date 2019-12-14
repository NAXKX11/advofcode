// Day 9: Sensor Boost
const EventEmitter = require("events");
const { match, abort, aborted } = require("../utils");

const PARAMETER_MODES = { POSITION: 0, IMMEDIATE: 1, RELATIVE: 2 };
const PROGRAM_MODES = { OUTPUT: 0, MEMORY: 1, BOTH: 2 };
const IO = { IN: "input", OUT: "output" };

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

class Halt extends Error {}

const PROGRAM_OUTPUT_HANDLERS = {
  [PROGRAM_MODES.OUTPUT](state) {
    return state.output;
  },
  [PROGRAM_MODES.MEMORY](state) {
    return state.memory;
  },
  [PROGRAM_MODES.BOTH](state) {
    return {
      memory: state.memory,
      output: state.output
    };
  }
};

const PROGRAM_OPCDOE_HANDLERS = {
  [CODES.HALT]() {
    abort();
  },
  [CODES.ADDITION](op) {
    return op.write(op.readParam() + op.readParam());
  },
  [CODES.MULTIPLICATION](op) {
    return op.write(op.readParam() * op.readParam());
  },
  [CODES.READ](op, state) {
    return readInput(state).then(op.write);
  },
  [CODES.WRITE](op, state) {
    state.brain.emit(IO.OUT, op.readParam(), state.output.length);
  },
  [CODES.JUMP_IF_TRUE](op) {
    const param1 = op.readParam();
    const param2 = op.readParam();

    if (param1 !== 0) {
      return param2; // Returning the new position
    }
  },
  [CODES.JUMP_IF_FALSE](op) {
    const param1 = op.readParam();
    const param2 = op.readParam();

    if (param1 === 0) {
      return param2; // Returning the new position
    }
  },
  [CODES.LESS_THAN](op) {
    return op.write(op.readParam() < op.readParam() ? 1 : 0);
  },
  [CODES.EQUALS](op) {
    return op.write(op.readParam() === op.readParam() ? 1 : 0);
  },
  [CODES.ADJUST_RELATIVE_BASE](op, state) {
    state.relative_base_pointer += op.readParam();
  }
};

async function readInput({ input, brain }) {
  return input.length > 0
    ? input.shift()
    : new Promise(brain.once.bind(brain, IO.IN)).then(() =>
        readInput({ input, brain })
      );
}

function createIntcodeComputer(program = "", debug_options = {}) {
  const { mode = PROGRAM_MODES.OUTPUT } = debug_options;

  // Let's create a state bucket where we can store stuff, and make it easy to
  // pass around.
  const state = {
    // Keep track of the memory
    memory: program.split(",").map(Number),

    // Keep track of IO
    input: [],
    output: [],

    // Keep track of some pointers
    instruction_pointer: 0,
    relative_base_pointer: 0,

    // Add an event emitter so that we can do some message passing
    brain: new EventEmitter()
  };

  // Handle I/O
  state.brain.on(IO.IN, values => state.input.push(...values));
  state.brain.on(IO.OUT, value => state.output.push(value));

  // The computah
  async function IntcodeComputer() {
    try {
      while (state.instruction_pointer < state.memory.length) {
        const operator = parseOperator(state);

        const next_position = await match(
          operator.operation,
          PROGRAM_OPCDOE_HANDLERS,
          operator,
          state
        );

        if (next_position) {
          state.instruction_pointer = next_position;
        } else {
          state.instruction_pointer += operator.advance();
        }
      }
    } catch (err) {
      if (!aborted(err)) {
        throw err;
      }
    }

    return match(mode, PROGRAM_OUTPUT_HANDLERS, state);
  }

  return {
    run() {
      return IntcodeComputer();
    },
    input(...values) {
      state.brain.emit(
        IO.IN,
        [].concat(values).filter(x => x !== undefined)
      );
    },
    output(cb) {
      state.brain.on(IO.OUT, cb);
      return () => state.brain.off(IO.OUT);
    }
  };
}

const OPERATOR_MODE_HANDLERS = {
  [PARAMETER_MODES.POSITION](position, { memory }) {
    return memory[position];
  },
  [PARAMETER_MODES.IMMEDIATE](position) {
    return position;
  },
  [PARAMETER_MODES.RELATIVE](position, { memory, relative_base_pointer }) {
    return memory[position] + relative_base_pointer;
  }
};

function resolvePosition(operator_state, computer_state) {
  const position = ++operator_state.local_instruction_pointer;

  // Find the actual mode
  const mode = operator_state.next_mode % 10 | 0;

  // Prep the next_mode
  operator_state.next_mode /= 10;

  // Get the position from memory based on the PARAMETER_MODE
  return match(mode, OPERATOR_MODE_HANDLERS, position, computer_state);
}

function parseOperator(state) {
  const input = state.memory[state.instruction_pointer];

  const operator_state = {
    operation: input % 100, // Last 3 digits
    next_mode: (input / 100) | 0,

    // Keep track of a local instruction pointer so that we can increase this
    // for our parameters
    local_instruction_pointer: state.instruction_pointer
  };

  return {
    // Expose the operation
    operation: operator_state.operation,

    // Expose a set of utils
    readParam() {
      return state.memory[resolvePosition(operator_state, state)];
    },
    write(value) {
      state.memory[resolvePosition(operator_state, state)] = value;
    },
    advance: () =>
      operator_state.local_instruction_pointer - state.instruction_pointer + 1
  };
}

function halted(err) {
  return err instanceof Halt;
}

module.exports = { halted, PROGRAM_MODES, createIntcodeComputer };
