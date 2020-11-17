function dataRead(fileName) {
	const fs = require("fs");
	try {
		const fileString = fs.readFileSync("assets/" + fileName);
		try {
			const file = JSON.parse(fileString);
			return file;
		} catch (err) { console.log("Error while trying to parse database/" + fileName, err); };
	} catch (err) { console.log(err); }
};

module.exports = dataRead;