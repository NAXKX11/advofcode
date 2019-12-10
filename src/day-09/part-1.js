// Day 9: Sensor Boost

const { createIntcodeComputer, halted } = require("./intcode-computer");

module.exports = async function sensorBoost(program, input = []) {
  const computer = createIntcodeComputer(program);

  computer.input(...input);

  return (await computer.run()).slice().pop();
};
