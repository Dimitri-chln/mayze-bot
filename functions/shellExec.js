module.exports = function shellExec(command) {
    const { execSync } = require('child_process');
    const output = execSync(command, { encoding: 'utf-8' });
    return output;
};