module.exports = function dataRead(fileName) {
  const fs = require("fs");
  const file = JSON.parse(fs.readFileSync("database/" + fileName));
  return file;
};