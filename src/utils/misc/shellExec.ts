/**
 * Execute a command in the console
 * @param {string} command The command to execute
 */
export default function shellExec(command: string) {
	const { execSync } = require("child_process");
	const output = execSync(command, { encoding: "utf-8" });
	return output;
}
