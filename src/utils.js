const fs = require("fs");
const { resolve } = require("path");

module.exports.read = async function read(base, path) {
  return fs.promises.readFile(resolve(base, path), "utf8");
};

module.exports.match = function match(value, patterns) {
  const availableKeys = Object.keys(patterns);
  if (!availableKeys.includes(value.toString())) {
    throw new Error(
      `Tried to handle "${value}" but there is no handler defined. Only defined handlers are: ${availableKeys
        .map(key => `"${key}"`)
        .join(", ")}.`
    );
  }

  return patterns[value]();
};

class AbortError extends Error {}

module.exports.abort = function abort() {
  throw new AbortError();
};

module.exports.aborted = function aborted(err) {
  return err instanceof AbortError;
};

module.exports.range = function range(n, offset = 0) {
  return Array.from({ length: n }, (v, k) => k + offset);
};

function intersectBetween(a, b) {
  const [left, right] = [a, b].sort((a, b) => a.length - b.length);

  return left.filter(element => right.includes(element));
}

module.exports.intersect = function intersect(...args) {
  if (args.length <= 0) {
    return [];
  }

  if (args.length === 1) {
    return args[0];
  }

  if (args.length === 2) {
    return intersectBetween(args[0], args[1]);
  }

  return args.reduce((a, b) => intersectBetween(a, b));
};

module.exports.manhatten = function manhatten([x0, y0], [x1, y1]) {
  return Math.abs(x1 - x0) + Math.abs(y1 - y0);
};
