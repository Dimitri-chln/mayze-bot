const { Message } = require("discord.js");

const language = {
	get: require("../utils/parseLanguageText"),
	title: {
		fr: "Personnage souhaité",
		en: "Wished character"
	},
	desc: {
		fr: "**~s{1}~t({2})** a été roll dans {3} !\n→ {4}\n**{5}**<:kakeraMudae:796822222110720106>",
		en: "**~s{1}~t({2})** has been rolled in {3} !\n→ {4}\n**{5}**<:kakeraMudae:796822222110720106>"
	}
};

const command = {
	/**
	 * @param {Message} message 
	 */
	async run(message) {
		if (message.channel.type === "dm") return;
		if (message.author.id !== "432610292342587392") return;
		if (!message.embeds.length) return;
		const mudaeEmbed = message.embeds[0];
		if (mudaeEmbed.color !== 16751916) return;
		const imRegex = /\d+ \/ \d+/;
		if (mudaeEmbed.footer && imRegex.test(mudaeEmbed.footer.text)) return;

		const characterName = mudaeEmbed.author.name;
		const characterSeries = mudaeEmbed.description.includes("Claims:")
			? mudaeEmbed.description.split("\nClaims:")[0].replace(/\n/g, " ")
			: mudaeEmbed.description.split("\n**")[0].replace(/\n/g, " ");
		const [ , kakeraValue ] = mudaeEmbed.description.match(/\*\*(\d+)\*\*<:kakera:469835869059153940>/m);
		
		const { "rows": wishes }  = await message.client.database.query(`SELECT * FROM wishes`).catch(console.error);
		if (!wishes) return;

		let lang = "en";
	    const res = await message.client.database.query(`SELECT * FROM languages WHERE guild_id = '${message.guild.id}'`).catch(console.error);
	    if (res && res.rows.length) lang = res.rows[0].language_code;
		
		wishes.forEach(async wish => {
			const regex = wish.regex ?
				new RegExp(wish.regex.replace(/^|(\|)|$/g, a => { if (a) return `\\b${ a }\\b`; return "\\b";}), "i") :
				new RegExp(`\\b${ wish.series }\\b`, "i");
			if (regex.test(characterSeries)) {
				let user;
				try {
					user = message.client.users.cache.get(wish.user_id) || await message.client.users.fetch(wish.user_id);
					if (!message.guild.members.cache.has(user.id)) return;
					user.send({
						embed: {
							author: {
								name: language.title[lang],
								iconURL: user.displayAvatarURL()
							},
							color: message.guild.me.displayColor,
							description: language.get(language.desc[lang], characterName, message.url, message.channel, characterSeries, kakeraValue),
							footer: {
								text: "✨ Mayze ✨"
							}
						}
					});
				} catch (err) {
					console.error(err);
				}
			}
		});
	}
};

module.exports = command;