import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";



const command: Command = {
	name: "shop",
	description: {
		fr: "Acheter des améliorations pour Mayze",
		en: "Buy upgrades for Mayze"
	},
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],

	options: {
		fr: [
			{
				name: "list",
				description: "Voir la liste des objets et améliorations disponibles",
				type: "SUB_COMMAND"
			},
			{
				name: "buy",
				description: "Acheter un objet ou une amélioration dans le magasin",
				type: "SUB_COMMAND",
				options: [
					{
						name: "item",
						description: "L'objet ou amélioration à acheter",
						type: "STRING",
						required: false,
						choices: [
							{
								name: "Réduction du temps d'attente pour attraper un pokémon",
								value: "catch_cooldown_reduction"
							},
							{
								name: "Probabilité des nouveaux pokémons",
								value: "new_pokemon_probability"
							},
							{
								name: "Probabilité des pokémons légendaires et chimères",
								value: "legendary_ub_probability"
							},
							{
								name: "Probabilités des méga gemmes",
								value: "mega_gem_probability"
							},
							{
								name: "Probabilité des pokémons shiny",
								value: "shiny_probability"
							}
						]
					},
					{
						name: "number",
						description: "Le nombre d'objets ou d'améliorations à acheter",
						type: "INTEGER",
						required: false,
						minValue: 1
					}
				]
			}
		],
		en: [
			{
				name: "list",
				description: "See the list of available items and upgrades",
				type: "SUB_COMMAND"
			},
			{
				name: "buy",
				description: "Buy an item or upgrade from the shop",
				type: "SUB_COMMAND",
				options: [
					{
						name: "item",
						description: "The item or upgrade to buy",
						type: "STRING",
						required: false,
						choices: [
							{
								name: "Catch cooldown reduction",
								value: "catch_cooldown_reduction"
							},
							{
								name: "New pokémon probability",
								value: "new_pokemon_probability"
							},
							{
								name: "Legendary pokémon and ultra beast probability",
								value: "legendary_ub_probability"
							},
							{
								name: "Mega gem probability",
								value: "mega_gem_probability"
							},
							{
								name: "Shiny pokémon probability",
								value: "shiny_probability"
							}
						]
					},
					{
						name: "number",
						description: "The number of items or tiers to buy",
						type: "INTEGER",
						required: false,
						minValue: 1
					}
				]
			}
		]
	},
	
	run: async (interaction, translations) => {
		const UPGRADES_PRICES = {
			catch_cooldown_reduction: (tier: number) => 5000 + 2000 * tier,
			new_pokemon_probability: (tier: number) => 250 + 50 * tier,
			legendary_ub_probability: (tier: number) => 250 + 50 * tier,
			mega_gem_probability: (tier: number) => 250 + 50 * tier,
			shiny_probability: (tier: number) => 250 + 50 * tier
		};

		const UPGRADES_BENEFITS = {
			catch_cooldown_reduction: (tier: number) => 0.5 * tier,
			new_pokemon_probability: (tier: number) => 2 * tier,
			legendary_ub_probability: (tier: number) => 2 * tier,
			mega_gem_probability: (tier: number) => 2 * tier,
			shiny_probability: (tier: number) => 2 * tier
		};

		const UPGRADES_MAX_TIER = {
			catch_cooldown_reduction: 20,
			new_pokemon_probability: 100,
			legendary_ub_probability: 100,
			mega_gem_probability: 100,
			shiny_probability: 100
		};

		const { rows: upgradesData } = await Util.database.query(
			"SELECT * FROM upgrades WHERE user_id = $1",
			[ interaction.user.id ]
		);
		
		const { rows: [ money ] } = await Util.database.query(
			"SELECT * FROM currency WHERE user_id = $1",
			[ interaction.user.id ]
		);
		
		const upgrades: {
			user_id: string;
			catch_cooldown_reduction: number;
			new_pokemon_probability: number;
			legendary_ub_probability: number;
			mega_gem_probability: number;
			shiny_probability: number;
		} = upgradesData[0]
			?? {
				user_id: interaction.user.id,
				catch_cooldown_reduction: 0,
				new_pokemon_probability: 0,
				legendary_ub_probability: 0,
				mega_gem_probability: 0,
				shiny_probability: 0
			};
		
		const subCommand = interaction.options.getSubcommand();

		switch (subCommand) {
			case "list": {
				interaction.reply({
					embeds: [
						{
							author: {
								name: translations.data.title(),
								iconURL: interaction.client.user.displayAvatarURL()
							},
							color: interaction.guild.me.displayColor,
							title: translations.data.balance(money.money),
							fields: [
								{
									name: translations.data.catch_cooldown_reduction(),
									value: translations.data.field_cooldown(
										upgrades.catch_cooldown_reduction.toString(),
										UPGRADES_BENEFITS.catch_cooldown_reduction(upgrades.catch_cooldown_reduction).toString(),
										(Util.commands.get("catch").cooldown / 60).toString(),
										((Util.commands.get("catch").cooldown / 60) - UPGRADES_BENEFITS.catch_cooldown_reduction(upgrades.catch_cooldown_reduction)).toString(),
										UPGRADES_PRICES.catch_cooldown_reduction(upgrades.catch_cooldown_reduction).toString(),
										upgrades.catch_cooldown_reduction === UPGRADES_MAX_TIER[upgrades.catch_cooldown_reduction]
									),
								},
								{
									name: translations.data.new_pokemon_probability(),
									value: translations.data.field(
										upgrades.new_pokemon_probability.toString(),
										UPGRADES_BENEFITS.new_pokemon_probability(upgrades.new_pokemon_probability).toString(),
										UPGRADES_PRICES.new_pokemon_probability(upgrades.new_pokemon_probability).toString(),
										upgrades.new_pokemon_probability === UPGRADES_MAX_TIER[upgrades.new_pokemon_probability]
									)
								},
								{
									name: translations.data.legendary_ub_probability(),
									value: translations.data.field(
										upgrades.legendary_ub_probability.toString(),
										UPGRADES_BENEFITS.legendary_ub_probability(upgrades.legendary_ub_probability).toString(),
										UPGRADES_PRICES.legendary_ub_probability(upgrades.legendary_ub_probability).toString(),
										upgrades.legendary_ub_probability === UPGRADES_MAX_TIER[upgrades.legendary_ub_probability]
									)
								},
								{
									name: translations.data.mega_gem_probability(),
									value: translations.data.field(
										upgrades.mega_gem_probability.toString(),
										UPGRADES_BENEFITS.mega_gem_probability(upgrades.mega_gem_probability).toString(),
										UPGRADES_PRICES.mega_gem_probability(upgrades.mega_gem_probability).toString(),
										upgrades.mega_gem_probability === UPGRADES_MAX_TIER[upgrades.mega_gem_probability]
									)
								},
								{
									name: translations.data.shiny_probability(),
									value: translations.data.field(
										upgrades.shiny_probability.toString(),
										UPGRADES_BENEFITS.shiny_probability(upgrades.shiny_probability).toString(),
										UPGRADES_PRICES.shiny_probability(upgrades.shiny_probability).toString(),
										upgrades.shiny_probability === UPGRADES_MAX_TIER[upgrades.shiny_probability]
									)
								}
							],
							footer: {
								text: "✨ Mayze ✨"
							}
						}
					]
				});
				break;
			}

			case "buy": {
				const upgrade = interaction.options.getString("upgrade");
				const number = interaction.options.getInteger("number") ?? 1;

				const upgradeCost = Math.round(
					number * (
						UPGRADES_PRICES[upgrade](upgrades[upgrade]) +
						UPGRADES_PRICES[upgrade](upgrades[upgrade] + number - 1)
					) / 2
				);

				if (money.money < upgradeCost) return interaction.reply({
					content: translations.data.not_enough_money(),
					ephemeral: true
				});
			
				if (upgrades[upgrade] + number > UPGRADES_MAX_TIER[upgrade]) return interaction.reply({
					content: translations.data.max_tier_reached(),
					ephemeral: true
				});
				
				upgrades[upgrade] += number;

				Util.database.query(
					"UPDATE currency SET money = money - $2 WHERE user_id = $1",
					[ interaction.user.id, upgradeCost ]
				);

				Util.database.query(
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

				interaction.reply(
					translations.data.new_tier(upgrades[upgrade], upgradeCost.toString())
				);
				break;
			}
		}
	}
};



export default command;