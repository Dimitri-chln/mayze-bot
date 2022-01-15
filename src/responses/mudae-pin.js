const { Message } = require("discord.js");

const command = {
	/**
	 * @param {Message} message 
	 */
	async run(message) {
		if (message.author.id !== "432610292342587392") return;
		if (message.channel.type === "dm") return;
		if (message.guild.id !== "689164798264606784") return;

		const pinChannel = message.client.channels.cache.get("788428208298000435");
		const legRegex = /Félicitations, vous venez de gagner un\.\.\. Un\.\.\. <:.+?:(\d{18})> \*\*(\w+?)\*\*\?!/m;
		const ubRegex =/un <:.+?:(\d{18})> \*\*(\w+?)\*\*\. Euh, QUOI \?/m;
		const shinyRegex = /<:.+?:(\d{18})> \*\*(\w+?) <:shinySparkles:653808283244560402>\*\*/m;
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
		
		pinChannel.send({
			embed: {
				author: {
					name: user.tag,
					iconURL: user.displayAvatarURL({ dynamic: true })
				},
				color: 65793,
				thumbnail: {
					url: `https://cdn.discordapp.com/emojis/${legEmoji || ubEmoji || shinyEmoji}.png?v=1`
				},
				description: `a attrapé un ${shinyPokemon ? "⭐ " : ""}**[${legPokemon || ubPokemon || shinyPokemon}](${message.url})** dans ${message.channel} !`,
				footer: {
					text: "✨ Mayze ✨"
				},
				timestamp: Date.now()
			}
		}).catch(console.error);
	}
};

module.exports = command;