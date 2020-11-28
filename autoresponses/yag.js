const command = {
    async execute(message) {
        if (message.author.id !== "204255221017214977") return;
        if (message.content.startsWith("Gave up trying to execute custom command")) {
            message.delete().catch(console.error);
        }
    }
};

module.exports = command;