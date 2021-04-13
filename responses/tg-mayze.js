const { Message } = require("discord.js");

const command = {
    /**
     * @param {Message} message 
     */
    execute: async (message) => {
        if (message.channel.type === "dm") return;
        if (message.guild.id !== "689164798264606784") return;
        
        if (message.mentions.users.has("703161067982946334") && message.content.toLowerCase().startsWith("tg"))
            message.channel.stopTyping(true);
    }
};

module.exports = command;