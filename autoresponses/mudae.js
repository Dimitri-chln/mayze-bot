const { Message } = require("discord.js");

const command = {
	/**
	 * @param {Message} message 
	 */
	async execute(message) {
		// if (message.guild.id !== "689164798264606784") return;
		if (message.author.id !== "432610292342587392") return;
		if (!message.embeds.length) return;
		const mudaeEmbed = message.embeds[0];
		if (mudaeEmbed.color !== 16751916) return;
		const claimedRegex = new RegExp("(Animanga|Game) roulette");
		if (claimedRegex.test(mudaeEmbed.description)) return;
		const characterName = mudaeEmbed.author.name;
		const characterSeries = mudaeEmbed.description.split("\nClaims:")[0].replace(/\n/g, " ");
		var wishes;
		try {
			const { rows }  = await message.client.pg.query(`SELECT * FROM wishes`);
			wishes = rows;
		} catch (err) { console.log(err);	}
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
							description: `**[${characterName}](${message.url})** a été roll dans <#${message.channel.id}> !\n(${characterSeries})`,
							footer: {
								text: "✨Mayze✨"
							}
						}
					});
				} catch (err) { console.log(err); }
			}
		});
	}
};

module.exports = command;