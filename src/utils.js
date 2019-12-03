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
