const { Message } = require("discord.js");

const command = {
	/**
	 * @param {Message} message 
	 */
	async execute(message) {
		if (message.author.id !== "432610292342587392") return;
		if (message.guild.id !== "689164798264606784") return;
		const pinChannel = message.client.channels.cache.get("788428208298000435");
		const legRegex = /Félicitations, vous venez de gagner un\.\.\. Un\.\.\. <:.+:(\d{18})> \*\*(\w+)\*\*\?!/;
		const ubRegex =/un <:.+:(\d{18})> \*\*(\w+)\*\*\. Euh, QUOI \?/;
		const shinyRegex = /<:.+:(\d{18})> \*\*(\w+) <:shinySparkles:653808283244560402>\*\*/;
		// https://cdn.discordapp.com/emojis/653808283244560402.png?v=1

		const [ , legEmoji, legPokemon ] = message.content.match(legRegex) || [];
		const [ , ubEmoji, ubPokemon ] = message.content.match(ubRegex) || [];
		const [ , shinyEmoji, shinyPokemon ] = message.content.match(shinyRegex) || [];

		if (!legPokemon && !shinyPokemon && !ubPokemon) return;
		
		let user = message.mentions.users.first();
		if (!user) {
			const [ , username ] = message.content.match(/^(.+): /m) || [];
			user = message.client.users.cache.find(u => u.username === username);
			if (!user) return;
		}
		
		const shiny = shinyPokemon ? "⭐ " : "";
		pinChannel.send({
			embed: {
				author: {
					name: user.tag,
					icon_url: user.avatarURL({ dynamic: true })
				},
				color: "#010101",
				thumbnail: {
					url: `https://cdn.discordapp.com/emojis/${legEmoji || ubEmoji || shinyEmoji}.png?v=1`
				},
				description: `a attrapé un ${shiny}**[${legPokemon || ubPokemon || shinyPokemon}](${message.url})** dans ${message.channel} !`,
				footer: {
					text: "✨ Mayze ✨"
				},
				timestamp: Date.now()
			}
		}).catch(console.error);
	}
};

module.exports = command;