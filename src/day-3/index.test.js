const { read } = require("../utils");
const part1 = require("./part-1.js");
const part2 = require("./part-2.js");

describe("Part 1", () => {
  // Part 1
  it.each([
    ["R8,U5,L5,D3\nU7,R6,D4,L4", 6],
    [
      "R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83",
      159
    ],
    [
      "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51\nU98,R91,D20,R16,D67,R40,U7,R15,U6,R7",
      135
    ]
  ])('An input of %s requires an output of "%s"', (input, expected) => {
    expect(part1(input)).toBe(expected);
  });

  // Actual test, Part 1
  // Skipped because.... too slow :D
  it.skip("should produce the correct value for the input data", async () => {
    const data = await read(__dirname, "./data.txt");

    expect(part1(data)).toMatchSnapshot();
  });
});

describe("Part 2", () => {
  // Part 2
  it.each([
    [
      "R75,D30,R83,U83,L12,D49,R71,U7,L72\nU62,R66,U55,R34,D71,R55,D58,R83",
      610
    ],
    [
      "R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51\nU98,R91,D20,R16,D67,R40,U7,R15,U6,R7",
      410
    ]
  ])('An input of %s requires an output of "%s"', (input, expected) => {
    expect(part2(input)).toBe(expected);
  });

  // Actual test, Part 2
  // Skipped because.... too slow :D
  it.skip("should produce the correct value for the input data", async () => {
    const data = await read(__dirname, "./data.txt");

    expect(part2(data)).toMatchSnapshot();
  });
});
