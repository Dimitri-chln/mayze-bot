const { Message } = require("discord.js");

const command = {
	/**
	 * @param {Message} message 
	 */
	async execute(message) {
		if (message.channel.type === "dm") return;
		if (message.guild.id !== "689164798264606784") return;
		if (message.author.id !== "432610292342587392") return;
		if (!message.embeds.length) return;
		const mudaeEmbed = message.embeds[0];
		if (mudaeEmbed.color !== 16751916) return;
		const claimedRegex = /(Animanga|Game)/;
		if (claimedRegex.test(mudaeEmbed.description)) return;
		const characterName = mudaeEmbed.author.name;
		const characterSeries = mudaeEmbed.description.split("\nClaims:")[0].replace(/\n/g, " ");
		const [ , kakeraValue ] = mudaeEmbed.description.match(/\*\*(\d+)\*\*<:kakera:469835869059153940>/m);
		const { "rows": wishes }  = await message.client.pg.query(`SELECT * FROM wishes`).catch(console.error);
		if (!wishes) return;
		wishes.forEach(async wish => {
			const regex = wish.regex ?
				new RegExp(wish.regex.replace(/^|(\|)|$/g, a => { if (a) return `\\b${ a }\\b`; return "\\b";}), "i") :
				new RegExp(`\\b${ wish.series }\\b`, "i");
			if (regex.test(characterSeries)) {
				var user;
				try { user = message.client.users.cache.get(wish.user_id) || await message.client.users.fetch(wish.user_id); }
				catch (err) { console.log(err); }
				try {
					user.send({
						embed: {
							author: {
								name: "Personnage souhaité",
								icon_url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
							},
							color: "#010101",
							description: `**[${characterName}](${message.url})** a été roll dans <#${message.channel.id}> !\n→ ${characterSeries}\n**${kakeraValue}**<:kakeraMudae:796822222110720106>`,
							footer: {
								text: "✨ Mayze ✨"
							}
						}
					});
				} catch (err) { console.log(err); }
			}
		});
	}
};

module.exports = command;