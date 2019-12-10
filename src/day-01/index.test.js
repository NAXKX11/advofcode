const { read } = require("../utils");
const part1 = require("./part-1.js");
const part2 = require("./part-2.js");

describe("Part 1", () => {
  // Part 1
  it.each([
    [[12], 2],
    [[14], 2],
    [[1969], 654],
    [[100756], 33583]
  ])('A mass of %s requires a fuel of "%s"', (input, expected) => {
    expect(part1(input)).toBe(expected);
  });

  // Actual test, Part 1
  it("should produce the correct value for the input data", async () => {
    const input = (await read(__dirname, "./data.txt")).split("\n").map(Number);
    expect(part1(input)).toMatchSnapshot();
  });
});

describe("Part 2", () => {
  // Part 2
  it.each([
    [[14], 2],
    [[1969], 966],
    [[100756], 50346]
  ])('A mass of %s requires a fuel of "%s"', (input, expected) => {
    expect(part2(input)).toBe(expected);
  });

  // Actual test, Part 2
  it("should produce the correct value for the input data", async () => {
    const input = (await read(__dirname, "./data.txt")).split("\n").map(Number);

    expect(part2(input)).toMatchSnapshot();
  });
});
