module.exports = function dataWrite(fileName, jsonData) {
  const fs = require("fs");
  const fileString = JSON.stringify(jsonData, null, 2);
  fs.writeFileSync("database/" + fileName, fileString);
};