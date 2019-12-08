const { read } = require("../utils");

const part1 = require("./part-1");
const { process, flatten, render, scale, border, raw } = require("./part-2");

describe("Part 1", () => {
  it.each([["123456789012", 3, 2, 1]])(
    'An input of %s with width=%s and height=%s results in a value of "%s"',
    (image, width, height, output) => {
      expect(part1(image, width, height)).toEqual(output);
    }
  );

  // Actual test, Part 1
  it("should produce the correct value for the input data", async () => {
    const data = await read(__dirname, "./data.txt");

    expect(part1(data, 25, 6)).toMatchSnapshot();
  });
});

describe("Part 2", () => {
  it.each([["0222112222120000", 2, 2, "0110"]])(
    'An input of %s with width=%s and height=%s results in a value of "%s"',
    async (image, width, height, output) => {
      expect(
        await process(image, width, height)
          .then(flatten())
          .then(raw())
      ).toEqual(output);
    }
  );

  // Actual test, Part 2
  it("should produce the correct value for the input data", async () => {
    const data = await read(__dirname, "./data.txt");

    expect(
      await process(data, 25, 6)
        .then(flatten())
        .then(border(2))
        .then(scale(2, 1))
        .then(render())
    ).toMatchSnapshot();
  });
});
