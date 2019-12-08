// Day 8: Space Image Format

const { chunk } = require("../utils");

const BLACK = "0";
const WHITE = "1";
const TRANSPARENT = "2";

module.exports.decode = function(data, width, height) {
  const layers = chunk(data, width * height);

  return layers.reduce((final_layer, layer) => {
    if (!final_layer.includes(TRANSPARENT)) {
      return final_layer;
    }

    return final_layer
      .split("")
      .map((value, index) => (value === TRANSPARENT ? layer[index] : value))
      .join("");
  }, TRANSPARENT.repeat(width * height));
};

const PIXELS = {
  [BLACK]: "▒",
  [WHITE]: "█",
  [TRANSPARENT]: "░"
};

module.exports.render = function(data, width, height) {
  const decoded_image = module.exports.decode(data, width, height);
  const image_with_pixels = decoded_image.split("").map(value => PIXELS[value]);
  const image = chunk(image_with_pixels.join(""), width).join("\n");
  return `\n${image}\n`;
};
