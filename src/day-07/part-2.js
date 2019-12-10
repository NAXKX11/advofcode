// Day 7: Amplification Circuit

const { permutations } = require("../utils");

const { createIntcodeComputer, halted } = require("./intcode-computer");

module.exports = function amplification(program, amplifier_config) {
  const amplifiers = amplifier_config.split(",").map(Number);

  const configs = permutations(amplifiers);

  return configs.reduce(async (previous_result, amplifiers) => {
    const prev = await previous_result;
    const result = await calculateAmplifierOutput(program, amplifiers);
    return result > prev ? result : prev;
  }, -Infinity);
};

async function calculateAmplifierOutput(program, amplifiers) {
  try {
    const [a, b, c, d, e] = amplifiers;

    const [
      amplifierA,
      amplifierB,
      amplifierC,
      amplifierD,
      amplifierE
    ] = amplifiers.map(() => createIntcodeComputer(program));

    // Do the wiring
    amplifierA.output(amplifierB.input);
    amplifierB.output(amplifierC.input);
    amplifierC.output(amplifierD.input);
    amplifierD.output(amplifierE.input);
    amplifierE.output(amplifierA.input);

    // Feed some input
    amplifierA.input(a, 0);
    amplifierB.input(b);
    amplifierC.input(c);
    amplifierD.input(d);
    amplifierE.input(e);

    function ignoreHalt(err) {
      if (halted(err)) {
        return Promise.resolve();
      }

      throw err;
    }

    // Let's run!
    await Promise.all([
      amplifierA.run().catch(ignoreHalt),
      amplifierB.run().catch(ignoreHalt),
      amplifierC.run().catch(ignoreHalt),
      amplifierD.run().catch(ignoreHalt),
      amplifierE.run()
    ]);
  } catch (err) {
    if (halted(err)) {
      return err.output.slice().pop();
    }

    // Uh..., error
    throw err;
  }
}
