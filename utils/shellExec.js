/**
 * Execute a command in the console
 * @param {string} command The command to execute
 */
function shellExec(command) {
	const { execSync } = require("child_process");
	const output = execSync(command, { encoding: "utf-8" });
	return output;
};

module.exports = shellExec;