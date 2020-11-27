const command = {
	async execute(message) {
		// if (message.channel.id !== "672516067440197693") return;
		if (message.author.id !== "432610292342587392") return;
		if (!message.embeds.length) return;
		const mudaeEmbed = message.embeds[0];
		if (mudaeEmbed.color !== 16751916) return;
		const claimedRegex = new RegExp("(Animanga|Game) roulette");
		if (claimedRegex.test(mudaeEmbed.description)) return;
		const characterName = mudaeEmbed.author.name;
		const characterSeries = mudaeEmbed.description.split("\nClaims:")[0].replace(/\n/g, " ");
		
		const databaseSQL = require("../modules/databaseSQL.js");
		var wishes;
		try {
			const { rows }  = await databaseSQL(`SELECT * FROM wishes`);
			wishes = rows;
		} catch (err) { console.log(err);	}
		if (!wishes) return;
		wishes.forEach(async wish => {
			const regex = new RegExp(wish.series, "i");
			if (regex.test(characterSeries)) {
				var user;
				try { user = message.client.users.cache.get(wish.user) || await message.client.users.fetch(wish.user); }
				catch (err) { console.log(err); }
				try {
					user.send({
						embed: {
							author: {
								name: "Personnage souhaité",
								icon_url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
							},
							color: "#010101",
							description: `**[${characterName}](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id})** a été roll dans <#${message.channel.id}> !\n(${characterSeries})`,
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