module.exports = function shellExec(command) {
    const { execSync } = require('child_process');
    try {
        const output = execSync(command, { encoding: 'utf-8' });
        return output;
    } catch (err) {
        console.log(err);
    };
};