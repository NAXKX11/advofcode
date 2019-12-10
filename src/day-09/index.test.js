const { read } = require("../utils");

const part1 = require("./part-1");

describe("Part 1", () => {
  it.each([
    // Should output a 16-digit number
    ["1102,34915192,34915192,7,4,7,99,0", 1219070632396864],

    // Should output the large number in the middle
    ["104,1125899906842624,99", 1125899906842624]
  ])('An input of %s requires an output of "%s"', async (program, output) => {
    expect(await part1(program)).toEqual(output);
  });

  it("should be the identity function", async () => {
    expect(await part1("109,19,3,-15,204,-34,99", [123])).toEqual(123);
  });

  // Actual test, Part 1
  it("should produce the correct value for the input data", async () => {
    const data = await read(__dirname, "./data.txt");

    expect(await part1(data, [1])).toMatchSnapshot();
  });
});

describe("Part 2", () => {
  // Actual test, Part 1
  it("should produce the correct value for the input data", async () => {
    const data = await read(__dirname, "./data.txt");

    expect(await part1(data, [2])).toMatchSnapshot();
  });
});
