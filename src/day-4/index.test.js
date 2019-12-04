const part1 = require("./part-1.js");
const part2 = require("./part-2.js");

describe("Part 1", () => {
  // Part 1
  it.each([
    ["111111", true],
    ["223450", false],
    ["123789", false]
  ])('An input of %s requires an output of "%s"', (input, expected) => {
    expect(part1.isValidPassword(input)).toBe(expected);
  });

  // Actual test, Part 1
  it("should produce the correct value for the input data", async () => {
    expect(
      part1.countValidPasswordsBetween("234208", "765869")
    ).toMatchSnapshot();
  });
});

describe("Part 2", () => {
  // Part 2
  it.each([
    ["112233", true],
    ["123444", false],
    ["111122", true]
  ])('An input of %s requires an output of "%s"', (input, expected) => {
    expect(part2.isValidPassword(input)).toBe(expected);
  });

  // Actual test, Part 2
  it("should produce the correct value for the input data", async () => {
    expect(
      part2.countValidPasswordsBetween("234208", "765869")
    ).toMatchSnapshot();
  });
});
