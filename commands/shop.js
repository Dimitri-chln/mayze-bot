const { Message } = require("discord.js");

const command = {
	name: "shop",
	description: {
		fr: "Acheter des améliorations pour Mayze",
		en: "Buy upgrades for mayze"
	},
	aliases: [],
	args: 0,
	usage: "[<upgrade>]",
	category: "pokémon",
	slashOptions: [
		{
			name: "upgrade",
			description: "The upgrade to buy",
			type: 3,
			required: false
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const upgradeToBuy = args
			? args.join(" ")
			: options[0].value;
		
		if (upgradeToBuy) {


		} else {
			const { rows } = (await message.client.pg.query(
				"SELECT * FROM upgrades WHERE user_id = $1",
				[ message.author.id ]
			).catch(console.error) || {});
			if (!rows) return message.channel.send(language.errors.database).catch(console.error);
			
			const upgrades = rows.length
				? rows[0]
				: {
					user_id: message.author.id,
					catch_cooldown_reduction: 0,
					new_pokemon_probability: 0,
					legendary_ub_probability: 0,
					mega_gem_probability: 0,
					shiny_probability: 0
				};

			message.channel.send({
				embed: {
					author: {
						name: language.title,
						icon_url: message.client.user.avatarURL()
					},
					color: message.guild.me.displayColor,
					fields: [
						{
							name: language.catch_cooldown_reduction,
							value: `${upgrades.catch_cooldown_reduction}min (${message.client.commands.get("catch").cooldown / 60}m → ${(message.client.commands.get("catch").cooldown / 60) - upgrades.catch_cooldown_reduction}min)`,
						},
						{
							name: language.new_pokemon_probability,
							value: `+${upgrades.new_pokemon_probability}% ${language.probability}`,
						},
						{
							name: language.legendary_ub_probability,
							value: `+${upgrades.legendary_ub_probability}%`,
						},
						{
							name: language.mega_gem_probability,
							value: `+${upgrades.mega_gem_probability}%`,
						},
						{
							name: language.shiny_probability,
							value: `+${upgrades.shiny_probability}%`,
						}
					],
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			}).catch(console.error);
		}
	}
};

module.exports = command;