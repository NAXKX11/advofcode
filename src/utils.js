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
  const [left, right] = [a, b].sort((a, b) => Math.sign(a.length - b.length));

  const can_use_hash_hack = ["string", "number"].includes(typeof right[0]);
  const right_hash = can_use_hash_hack
    ? right.reduce(
        (acc, current) => Object.assign(acc, { [current]: true }),
        {}
      )
    : right;

  return left.filter(
    can_use_hash_hack
      ? element => right_hash[element] !== undefined
      : element => right.includes(element)
  );
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

module.exports.permutations = function permutations(input) {
  if (input.length === 0) {
    return [[]];
  }

  return input.reduce(
    (rows, value, i) => [
      ...rows,
      ...module.exports
        .permutations([...input.slice(0, i), ...input.slice(i + 1)])
        .map(x => [value, ...x])
    ],
    []
  );
};

module.exports.chunk = function chunk(array, n) {
  return module.exports.range(Math.ceil(array.length / n)).map((x, i) => {
    return array.slice(i * n, i * n + n);
  });
};

module.exports.perfLogs = function withPerfLogs(cb, message) {
  const start = Date.now();
  console.log({}, `[PERF]: [ START]: ${message}`);

  try {
    const result = cb();

    const end = Date.now();
    console.log(
      { duration: `${end - start}ms` },
      `[PERF]: [FINISH]: ${message}`
    );
    return result;
  } catch (err) {
    const end = Date.now();
    console.log(
      { duration: `${end - start}ms` },
      `[PERF]: [FINISH]: ${message} (with error)`
    );

    throw err;
  }
};
