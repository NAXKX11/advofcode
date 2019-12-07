// Day 7: Amplification Circuit

const { permutations } = require("../utils");

const IntcodeComputer = require("../day-5/intcode-computer");

module.exports = function amplification(program, amplifier_config) {
  const amplifiers = amplifier_config.split(",").map(Number);

  const configs = permutations(amplifiers);

  return configs.reduce((previous_result, amplifiers) => {
    const result = calculateAmplifierOutput(program, amplifiers);
    return result > previous_result ? result : previous_result;
  }, -Infinity);
};

function calculateAmplifierOutput(program, amplifiers) {
  const result = amplifiers.reduce(
    (previous_result, setting) =>
      IntcodeComputer(program, [setting, ...previous_result]),
    [0]
  );

  if (result.length !== 1) {
    throw new Error(`Our output looks incorrect: ${result}`);
  }

  return result[0];
}
