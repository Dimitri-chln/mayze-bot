const { Message } = require("discord.js");

const command = {
    /**
     * @param {Message} message 
     */
    async run(message) {
        if (message.author.id !== "204255221017214977") return;
        if (message.content.startsWith("Gave up trying to execute custom command") || message.content.startsWith("An error caused the execution of the custom command template to stop")) {
            message.delete().catch(console.error);
        }
    }
};

module.exports = command;