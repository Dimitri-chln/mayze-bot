"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Execute a command in the console
 * @param {string} command The command to execute
 */
function shellExec(command) {
    var execSync = require("child_process").execSync;
    var output = execSync(command, { encoding: "utf-8" });
    return output;
}
exports.default = shellExec;
;
