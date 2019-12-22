const { read } = require("../utils");

const part1 = require("./part-1");
const part2 = require("./part-2");

describe("Part 1", () => {
  it.each([
    [
      [
        "deal with increment 7",
        "deal into new stack",
        "deal into new stack"
      ].join("\n"),
      [0, 3, 6, 9, 2, 5, 8, 1, 4, 7]
    ],
    [
      ["cut 6", "deal with increment 7", "deal into new stack"].join("\n"),
      [3, 0, 7, 4, 1, 8, 5, 2, 9, 6]
    ],
    [
      ["deal with increment 7", "deal with increment 9", "cut -2"].join("\n"),
      [6, 3, 0, 7, 4, 1, 8, 5, 2, 9]
    ],
    [
      [
        "deal into new stack",
        "cut -2",
        "deal with increment 7",
        "cut 8",
        "cut -4",
        "deal with increment 7",
        "cut 3",
        "deal with increment 9",
        "deal with increment 3",
        "cut -1"
      ].join("\n"),
      [9, 2, 5, 8, 1, 4, 7, 0, 3, 6]
    ]
  ])(
    "should produce the correct output for the given input",
    (input, output) => {
      expect(part1(input, 10)).toEqual(output);
    }
  );

  // Actual test, Part 1
  it("should produce the correct value for the input data", async () => {
    const data = await read(__dirname, "./data.txt");

    const shuffled_deck = part1(data, 10007);

    expect(shuffled_deck.indexOf(2019)).toMatchSnapshot();
  });
});

describe.skip("Part 2", () => {
  // Actual test, Part 2
  it("should produce the correct value for the input data", async () => {
    const data = await read(__dirname, "./data.txt");

    const shuffled_deck = part2(
      data,
      Number("119_315_717_514_047".replace(/_/g, "")), // HACK TO HAVE SOME _'S
      Number("101_741_582_076_661".replace(/_/g, "")) // HACK TO HAVE SOME _'S
    );

    expect(shuffled_deck[2020]).toMatchSnapshot();
  });
});
