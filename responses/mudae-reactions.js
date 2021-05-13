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
		const imRegex = /\d+ \/ \d+/;
		if (mudaeEmbed.footer.text && imRegex.test(mudaeEmbed.footer.text)) return;

        message.react("❤️").catch(console.error);
    }
};

module.exports = command;