import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import { DatabaseUpgrades } from "../../types/structures/Database";

const command: Command = {
	name: "shop",
	aliases: [],
	description: {
		fr: "Acheter des améliorations pour Mayze",
		en: "Buy upgrades for Mayze",
	},
	usage: "",
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],

	options: {
		fr: [
			{
				name: "list",
				description: "Voir la liste des objets et améliorations disponibles",
				type: "SUB_COMMAND",
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
						required: true,
						choices: [
							{
								name: "Réduction du temps d'attente pour attraper un pokémon",
								value: "catch_cooldown_reduction",
							},
							{
								name: "Probabilité des nouveaux pokémons",
								value: "new_pokemon_probability",
							},
							{
								name: "Probabilité des pokémons légendaires et chimères",
								value: "legendary_ub_probability",
							},
							{
								name: "Probabilités des méga gemmes",
								value: "mega_gem_probability",
							},
							{
								name: "Probabilité des pokémons shiny",
								value: "shiny_probability",
							},
						],
					},
					{
						name: "number",
						description: "Le nombre d'objets ou d'améliorations à acheter",
						type: "INTEGER",
						required: false,
						minValue: 1,
					},
				],
			},
		],
		en: [
			{
				name: "list",
				description: "See the list of available items and upgrades",
				type: "SUB_COMMAND",
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
						required: true,
						choices: [
							{
								name: "Catch cooldown reduction",
								value: "catch_cooldown_reduction",
							},
							{
								name: "New pokémon probability",
								value: "new_pokemon_probability",
							},
							{
								name: "Legendary pokémon and ultra beast probability",
								value: "legendary_ub_probability",
							},
							{
								name: "Mega gem probability",
								value: "mega_gem_probability",
							},
							{
								name: "Shiny pokémon probability",
								value: "shiny_probability",
							},
						],
					},
					{
						name: "number",
						description: "The number of items or tiers to buy",
						type: "INTEGER",
						required: false,
						minValue: 1,
					},
				],
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const UPGRADES_PRICES: UpgradeInfo<(tier: number) => number> = {
			catch_cooldown_reduction: (tier) => 5000 + 2000 * tier,
			new_pokemon_probability: (tier) => 250 + 50 * tier,
			legendary_ub_probability: (tier) => 250 + 50 * tier,
			mega_gem_probability: (tier) => 250 + 50 * tier,
			shiny_probability: (tier) => 250 + 50 * tier,
		};

		const UPGRADES_BENEFITS: UpgradeInfo<(tier: number) => number> = {
			catch_cooldown_reduction: (tier) => 0.5 * tier,
			new_pokemon_probability: (tier) => 2 * tier,
			legendary_ub_probability: (tier) => 2 * tier,
			mega_gem_probability: (tier) => 2 * tier,
			shiny_probability: (tier) => 2 * tier,
		};

		const UPGRADES_MAX_TIER: UpgradeInfo<number> = {
			catch_cooldown_reduction: 20,
			new_pokemon_probability: 100,
			legendary_ub_probability: 100,
			mega_gem_probability: 100,
			shiny_probability: 100,
		};

		const { rows: upgradesData }: { rows: DatabaseUpgrades[] } =
			await Util.database.query("SELECT * FROM upgrades WHERE user_id = $1", [
				interaction.user.id,
			]);

		const {
			rows: [money],
		} = await Util.database.query("SELECT * FROM currency WHERE user_id = $1", [
			interaction.user.id,
		]);

		const upgrades = upgradesData[0] ?? {
			user_id: interaction.user.id,
			catch_cooldown_reduction: 0,
			new_pokemon_probability: 0,
			legendary_ub_probability: 0,
			mega_gem_probability: 0,
			shiny_probability: 0,
		};

		const subCommand = interaction.options.getSubcommand();

		switch (subCommand) {
			case "list": {
				interaction.followUp({
					embeds: [
						{
							author: {
								name: translations.strings.title(),
								iconURL: interaction.client.user.displayAvatarURL(),
							},
							color: interaction.guild.me.displayColor,
							title: translations.strings.balance(money.money),
							fields: [
								{
									name: translations.strings.catch_cooldown_reduction(),
									value: translations.strings.field_cooldown(
										upgrades.catch_cooldown_reduction.toString(),
										UPGRADES_BENEFITS.catch_cooldown_reduction(
											upgrades.catch_cooldown_reduction,
										).toString(),
										(Util.commands.get("catch").cooldown / 60).toString(),
										(
											Util.commands.get("catch").cooldown / 60 -
											UPGRADES_BENEFITS.catch_cooldown_reduction(
												upgrades.catch_cooldown_reduction,
											)
										).toString(),
										UPGRADES_PRICES.catch_cooldown_reduction(
											upgrades.catch_cooldown_reduction,
										).toString(),
										upgrades.catch_cooldown_reduction >=
											UPGRADES_MAX_TIER.catch_cooldown_reduction,
									),
								},
								{
									name: translations.strings.new_pokemon_probability(),
									value: translations.strings.field(
										upgrades.new_pokemon_probability.toString(),
										UPGRADES_BENEFITS.new_pokemon_probability(
											upgrades.new_pokemon_probability,
										).toString(),
										UPGRADES_PRICES.new_pokemon_probability(
											upgrades.new_pokemon_probability,
										).toString(),
										upgrades.new_pokemon_probability >=
											UPGRADES_MAX_TIER.new_pokemon_probability,
									),
								},
								{
									name: translations.strings.legendary_ub_probability(),
									value: translations.strings.field(
										upgrades.legendary_ub_probability.toString(),
										UPGRADES_BENEFITS.legendary_ub_probability(
											upgrades.legendary_ub_probability,
										).toString(),
										UPGRADES_PRICES.legendary_ub_probability(
											upgrades.legendary_ub_probability,
										).toString(),
										upgrades.legendary_ub_probability >=
											UPGRADES_MAX_TIER.legendary_ub_probability,
									),
								},
								{
									name: translations.strings.mega_gem_probability(),
									value: translations.strings.field(
										upgrades.mega_gem_probability.toString(),
										UPGRADES_BENEFITS.mega_gem_probability(
											upgrades.mega_gem_probability,
										).toString(),
										UPGRADES_PRICES.mega_gem_probability(
											upgrades.mega_gem_probability,
										).toString(),
										upgrades.mega_gem_probability >=
											UPGRADES_MAX_TIER.mega_gem_probability,
									),
								},
								{
									name: translations.strings.shiny_probability(),
									value: translations.strings.field(
										upgrades.shiny_probability.toString(),
										UPGRADES_BENEFITS.shiny_probability(
											upgrades.shiny_probability,
										).toString(),
										UPGRADES_PRICES.shiny_probability(
											upgrades.shiny_probability,
										).toString(),
										upgrades.shiny_probability >=
											UPGRADES_MAX_TIER.shiny_probability,
									),
								},
							],
							footer: {
								text: "✨ Mayze ✨",
							},
						},
					],
				});
				break;
			}

			case "buy": {
				const upgrade = interaction.options.getString("item");
				const number = interaction.options.getInteger("number") ?? 1;

				const upgradeCost = Math.round(
					(number *
						(UPGRADES_PRICES[upgrade](upgrades[upgrade]) +
							UPGRADES_PRICES[upgrade](upgrades[upgrade] + number - 1))) /
						2,
				);

				if (upgrades[upgrade] + number > UPGRADES_MAX_TIER[upgrade])
					return interaction.followUp(translations.strings.max_tier_reached());

				if (money.money < upgradeCost)
					return interaction.followUp(translations.strings.not_enough_money());

				upgrades[upgrade] += number;

				Util.database.query(
					"UPDATE currency SET money = money - $2 WHERE user_id = $1",
					[interaction.user.id, upgradeCost],
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
					Object.values(upgrades),
				);

				interaction.followUp(
					translations.strings.new_tier(
						upgrades[upgrade],
						upgradeCost.toString(),
					),
				);
				break;
			}
		}
	},
};

export default command;

type UpgradeInfo<T> = {
	[K in keyof Omit<DatabaseUpgrades, "user_id">]: T;
};
