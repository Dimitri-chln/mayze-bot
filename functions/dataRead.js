module.exports = function dataRead(fileName) {
  const fs = require("fs");
  const fileString = fs.readFileSync("database/" + fileName);
  try {
    const file = JSON.parse(fileString);
    return file;
  } catch (err) {
    console.log("Error while trying to parse database/" + fileName, err);
  };
};