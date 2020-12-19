const { Message } = require("discord.js");

const command = {
	/**
	 * @param {Message} message 
	 */
	async execute(message) {
		if (message.author.id !== "432610292342587392") return;
		if (message.guild.id !== "672516066756395031") return;
		const pinChannel = message.guild.channels.cache.get("788428208298000435");
		const legRegex = /Félicitations, vous venez de gagner un\.\.\. Un\.\.\. <:.+:(\d{18})> \*\*(\w+)\*\*\?!/;
		const shinyRegex = /<:.+:(\d{18})> \*\*(\w+)\*\* <:shinySparkles:653808283244560402>/;

		const [ , legEmoji, legPokemon ] = message.content.match(legRegex) || [];
		const [ , shinyEmoji, shinyPokemon ] = message.content.match(shinyRegex) || [];
		if (!legPokemon && !shinyPokemon) return;
		
		let user = message.mentions.users.first();
		if (!user) {
			const [ , username ] = message.content.match(/^(.+): /m) || [];
			user = message.client.users.cache.find(u => u.username === username);
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
					url: `https://cdn.discordapp.com/emojis/${legEmoji || shinyEmoji}.png?v=1`
				},
				description: `a attrapé un ${shiny}**[${legPokemon || shinyPokemon}](${message.url})** dans ${message.channel} !`,
				footer: {
					text: "✨ Mayze ✨"
				},
				timestamp: Date.now()
			}
		}).catch(console.error);
	}
};

module.exports = command;