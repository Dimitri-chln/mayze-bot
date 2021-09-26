const { Message } = require("discord.js");

const command = {
	name: "balance",
	description: {
		fr: "Vérifier l'argent que tu possèdes",
		en: "Check how much money you have"
	},
	aliases: ["bal", "money", "cash"],
	args: 0,
	usage: "[<user>]",
	category: "currency",
	slashOptions: [
		{
			name: "user",
			description: "The user whose balance you want to check",
			type: 6,
			required: false
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const DAY_IN_MS = 1000 * 60 * 60 * 24, NOW = Date.now();

		const user = args
			? message.mentions.users.first() ?? message.client.findMember(message.guild, args.join(" "))?.user ?? message.author
			: options ? message.guild.members.cache.get(options[0].value).user : message.author
		
		const { rows } = (await message.client.pg.query(
			"SELECT * FROM currency WHERE user_id = $1",
			[ user.id ]
		).catch(console.error)) || {};
		if (!rows) return message.channel.send(language.errors.database).catch(console.error);

		const { money, "last_daily": lastDaily } = rows.length
			? rows[0]
			: { money: 0, lastDaily: null };
		
		const nextDaily = lastDaily ? Date.parse(lastDaily) + DAY_IN_MS : NOW;

		message.channel.send({
			embed: {
				author: {
					name: language.get(language.title, user.tag),
					icon_url: user.avatarURL({ dynamic: true })
				},
				color: message.guild.me.displayColor,
				description: language.get(
					language.description,
					money,
					nextDaily === NOW || nextDaily < NOW ? null : Math.round(nextDaily / 1000)
				),
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;