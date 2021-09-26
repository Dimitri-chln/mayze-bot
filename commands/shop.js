const { Message } = require("discord.js");

const command = {
	name: "shop",
	description: {
		fr: "Acheter des améliorations pour Mayze",
		en: "Buy upgrades for mayze"
	},
	aliases: ["upgrades"],
	args: 0,
	usage: "[<upgrade>]",
	category: "currency",
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
		const UPGRADES_REGEX = {
			catch_cooldown_reduction: /(catch )?cooldown/i,
			new_pokemon_probability: /new( pokemon)?/i,
			legendary_ub_probability: /leg(endary)?|ub/i,
			mega_gem_probability: /(mega( gem)?|gem)/i,
			shiny_probability: /shiny/i
		};

		// 0 based tiers
		const UPGRADES_PRICES = {
			catch_cooldown_reduction: tier => 5000 + 2000 * tier,
			new_pokemon_probability: tier => 250 + 50 * tier,
			legendary_ub_probability: tier => 250 + 50 * tier,
			mega_gem_probability: tier => 250 + 50 * tier,
			shiny_probability: tier => 250 + 50 * tier
		};

		// 0 base tiers
		const UPGRADES_BENEFITS = {
			catch_cooldown_reduction: tier => 0.5 * tier,
			new_pokemon_probability: tier => 2 * tier,
			legendary_ub_probability: tier => 2 * tier,
			mega_gem_probability: tier => 2 * tier,
			shiny_probability: tier => 2 * tier
		};

		// 0 based tiers
		const UPGRADES_MAX_TIER = {
			catch_cooldown_reduction: 19,
			new_pokemon_probability: 99,
			legendary_ub_probability: 99,
			mega_gem_probability: 99,
			shiny_probability: 99
		};

		const { rows } = (await message.client.pg.query(
			"SELECT * FROM upgrades WHERE user_id = $1",
			[ message.author.id ]
		).catch(console.error)) || {};
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

		const upgradeInput = args
			? args.join(" ")
			: options[0].value;
		
		if (upgradeInput) {
			const upgrade = Object.keys(UPGRADES_REGEX).find(key => UPGRADES_REGEX[key].test(upgradeInput));
			if (!upgrade) return message.reply(language.invalid_upgrade).catch(console.error);

			const upgradeCost = UPGRADES_PRICES[upgrade](upgrades[upgrade]);

			const { "rows": moneyData } = (await message.client.pg.query(
				"SELECT * FROM currency WHERE user_id = $1",
				[ message.author.id ]
			).catch(console.error)) || {};
			if (!moneyData) return message.channel.send(language.errors.database).catch(console.error);

			const userData = moneyData[0];

			if (userData.money < upgradeCost)
				return message.reply(language.not_enough_money).catch(console.error);
			if (upgrades[upgrade] >= UPGRADES_MAX_TIER[upgrade])
				return message.channel.send(language.max_tier_reached).catch(console.error);
			
			upgrades[upgrade]++;
			
			try {
				await message.client.pg.query(
					"UPDATE currency SET money = money - $2 WHERE user_id = $1",
					[ message.author.id, upgradeCost ]
				);

				await message.client.pg.query(
					`
					INSERT INTO upgrades VALUES ($1, $2, $3, $4, $5, $6)
					ON CONFLICT (user_id)
					DO UPDATE SET
						catch_cooldown_reduction = $2,
						new_pokemon_probability = $3,
						legendary_ub_probability = $4,
						mega_gem_probability = $5,
						shiny_probability = $6
					WHERE upgrades.user_id = EXCLUDED.user_id
					`,
					Object.values(upgrades)
				);
			} catch (err) {
				console.error(err);
				return message.channel.send(language.errors.database).catch(console.error);
			}

			message.reply(language.get(language.new_tier, upgrades[upgrade], upgradeCost)).catch(console.error);

		} else {
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
							value: `>>> ${language.get(language.tier, upgrades.catch_cooldown_reduction)} ${UPGRADES_BENEFITS.catch_cooldown_reduction(upgrades.catch_cooldown_reduction)}min (${message.client.commands.get("catch").cooldown / 60}min → ${(message.client.commands.get("catch").cooldown / 60) - UPGRADES_BENEFITS.catch_cooldown_reduction(upgrades.catch_cooldown_reduction)}min)\n__${language.next_tier}__ ✨${UPGRADES_PRICES.catch_cooldown_reduction(upgrades.catch_cooldown_reduction)}`,
						},
						{
							name: language.new_pokemon_probability,
							value: `>>> ${language.get(language.tier, upgrades.new_pokemon_probability)} +${UPGRADES_BENEFITS.new_pokemon_probability(upgrades.new_pokemon_probability)}% ${language.probability}\n__${language.next_tier}__ ✨${UPGRADES_PRICES.new_pokemon_probability(upgrades.new_pokemon_probability)}`,
						},
						{
							name: language.legendary_ub_probability,
							value: `>>> ${language.get(language.tier, upgrades.legendary_ub_probability)} +${UPGRADES_BENEFITS.legendary_ub_probability(upgrades.legendary_ub_probability)}% ${language.probability}\n__${language.next_tier}__ ✨${UPGRADES_PRICES.legendary_ub_probability(upgrades.legendary_ub_probability)}`,
						},
						{
							name: language.mega_gem_probability,
							value: `>>> ${language.get(language.tier, upgrades.mega_gem_probability)} +${UPGRADES_BENEFITS.mega_gem_probability(upgrades.mega_gem_probability)}% ${language.probability}\n__${language.next_tier}__ ✨${UPGRADES_PRICES.mega_gem_probability(upgrades.mega_gem_probability)}`,
						},
						{
							name: language.shiny_probability,
							value: `>>> ${language.get(language.tier, upgrades.shiny_probability)} +${UPGRADES_BENEFITS.shiny_probability(upgrades.shiny_probability)}% ${language.probability}\n__${language.next_tier}__ ✨${UPGRADES_PRICES.shiny_probability(upgrades.shiny_probability)}`,
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