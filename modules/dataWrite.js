/**
 * @param {string} fileName The file to write into
 * @param {*} jsonData The data to write into the file
 */
function dataWrite(fileName, jsonData) {
	const fs = require("fs");
	const fileString = JSON.stringify(jsonData, null, 2);
	try { fs.writeFileSync("assets/" + fileName, fileString); }
	catch (err) { console.log(err); }
};

module.exports = dataWrite;