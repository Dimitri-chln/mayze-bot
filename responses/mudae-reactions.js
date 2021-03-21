const { Message } = require("discord.js");

const command = {
    /**
     * @param {Message} message 
     */
    execute: async (message) => {
        if (message.author.id !== "432610292342587392") return;
        if (!message.embeds.length) return;
		const mudaeEmbed = message.embeds[0];
		if (mudaeEmbed.color !== 16751916) return;
		const claimedRegex = /(Animanga|Game)/;
		if (claimedRegex.test(mudaeEmbed.description)) return;

        message.react("❤️").catch(console.error);
    }
};

module.exports = command;