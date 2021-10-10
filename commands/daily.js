const { Message } = require("discord.js");

const command = {
	name: "daily",
	description: {
		fr: "Récupérer tes récompenses quotidiennes",
		en: "Claim your daily rewards"
	},
	aliases: [],
	args: 0,
	usage: "",
	category: "currency",
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const { DAILY_REWARD }= require("../config.json");
		const DAY_IN_MS = 1000 * 60 * 60 * 24;
		const NOW = new Date();
		const MIDNIGHT = new Date();
			MIDNIGHT.setHours(0, 0, 0, 0);

		const { rows } = (await message.client.pg.query(
			"SELECT * FROM currency WHERE user_id = $1",
			[ message.author.id ]
		).catch(console.error)) || {};
		if (!rows) return message.channel.send(language.errors.database).catch(console.error);

		const lastDaily = rows.length
			? new Date(rows[0].last_daily)
			: new Date(0);
		
		if (lastDaily.valueOf() > MIDNIGHT.valueOf()) {
			const timeLeft = Math.ceil((MIDNIGHT.valueOf() + DAY_IN_MS.valueOf() - NOW.valueOf()) / 1000);
			const timeLeftHumanized = new Date((timeLeft % 86400) * 1000)
				.toUTCString()
				.replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, "$1h $2m $3s")
				.replace(/00h |00m /g, "");
			return message.reply(language.get(language.cooldown, timeLeftHumanized)).catch(console.error);
		}

		const res = await message.client.pg.query(
			`
			INSERT INTO currency VALUES ($1, $2, $3)
			ON CONFLICT (user_id)
			DO UPDATE SET
				money = currency.money + $2,
				last_daily = $3
			WHERE currency.user_id = EXCLUDED.user_id
			RETURNING money
			`,
			[ message.author.id, DAILY_REWARD, new Date(NOW).toISOString() ]
		).catch(console.error);

		if (!res) return message.channel.send(language.errors.database).catch(console.error);

		message.channel.send({
			embed: {
				author: {
					name: language.title,
					icon_url: message.author.avatarURL({ dynamic: true })
				},
				color: message.guild.me.displayColor,
				description: language.get(language.description, DAILY_REWARD, res.rows[0].money),
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;