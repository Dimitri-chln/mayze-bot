const { Message } = require("discord.js");

const command = {
	/**
	 * @param {Message} message 
	 */
	execute: async (message) => {
        const noURegex = /^no (?:you|u)/i;
		if (!noURegex.test(message.content)) return;

        message.channel.messages.fetch({ limit: 2, before: message.id }).then(([ [ , banMsg ], [ , botMsg ] ]) => {
            if (botMsg.author.id !== message.client.user.id) return;
            if (botMsg.content !== `${message.author} has been banned!`) return;
            if (banMsg.content !== `*ban ${message.author}`) return;
            
            message.channel.send(`${banMsg.author} has been banned too!`).catch(console.error);
        }).catch(console.error);
	}
};

module.exports = command;