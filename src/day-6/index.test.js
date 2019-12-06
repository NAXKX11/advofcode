const { read } = require("../utils");
const part1 = require("./part-1");
const part2 = require("./part-2");

describe("Part 1", () => {
  it("should calculate the direct and indirect orbits", () => {
    expect(
      part1(
        [
          "COM)B",
          "B)C",
          "C)D",
          "D)E",
          "E)F",
          "B)G",
          "G)H",
          "D)I",
          "E)J",
          "J)K",
          "K)L"
        ].join("\n")
      )
    ).toEqual(42);
  });

  // Actual test, Part 2
  it("should produce the correct value for the input data", async () => {
    const data = await read(__dirname, "./data.txt");

    expect(part1(data)).toMatchSnapshot();
  });
});

describe("Part 2", () => {
  it("should calculate amount of orbital transfers", () => {
    expect(
      part2(
        [
          "COM)B",
          "B)C",
          "C)D",
          "D)E",
          "E)F",
          "B)G",
          "G)H",
          "D)I",
          "E)J",
          "J)K",
          "K)L",
          "K)YOU",
          "I)SAN"
        ].join("\n"),
        "YOU",
        "SAN"
      )
    ).toEqual(4);
  });

  // Actual test, Part 2
  it("should produce the correct value for the input data", async () => {
    const data = await read(__dirname, "./data.txt");

    expect(part2(data, "YOU", "SAN")).toMatchSnapshot();
  });
});
