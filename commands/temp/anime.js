const command = {
	name: "anime",
	description: {
		fr: "Voir et modifier ta liste d'épisodes d'animés",
		en: "See and manage your animes list"
	},
	aliases: ["a"],
	args: 0,
	usage: "add <name> <",
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		var animes;
		try {
			const { rows } = (await message.client.pg.query(`SELECT * FROM animes WHERE user_id='${message.author.id}'`)) || {};
			animes = rows;
		} catch (err) {
			console.log(err);
			return message.channel.send("Quelque chose s'est mal passé en joignant la base de données :/").catch(console.error);
		}
		
		switch ((args[0] || "").toLowerCase()) {
			case "info":
				const input = args.slice(1).join(" ");
				const anime = animes.find(a => a.name.toLowerCase() === input.toLowerCase() || new RegExp(a.alt_names, "i").test(input));
				if (!anime) return message.reply("je n'ai pas trouvé cet animé dans ta liste");
				var nextEpisode = "∅";
				if (anime.next_episode) nextEpisode = `\`Saison ${anime.next_episode[0]} - Épisode ${anime.next_episode[1]}\``;
				try {
					message.channel.send({
						embed: {
							author: {
								name: anime.name,
								icon_url: message.author.avatarURL({ dynamic: true })
							},
							color: message.guild.me.displayColor,
							description: `${anime.seasons.map((s, i) => `• **Saison ${i+1}**: ${s} épisodes`).join("\n")}\n\n__**Prochain épisode:**__ **${nextEpisode}**`,
							footer: {
								text: "✨ Mayze ✨"
							}
						}
					});
				} catch (err) { console.log(err); }
				break;
			default:
				if (!animes) return message.reply("tu n'as aucun animé dans ta liste");
				try {
					message.channel.send({
						embed: {
							author: {
								name: `Animés de ${message.author.tag}`,
								icon_url: message.author.avatarURL({ dynamic: true })
							},
							color: message.guild.me.displayColor,
							description: animes.map(a => {
								var string = `• **${a.name}** → `;
								if (a.next_episode) {
									string += `\`Saison ${a.next_episode[0]} - Épisode ${a.next_episode[1]}\``;
								} else {
									string += "✅";
								};
								return string;
							}).join("\n"),
							footer: {
								text: "✨ Mayze ✨"
							}
						}
					});
				} catch (err) { console.log(err); }
		};
	}
};

module.exports = command;