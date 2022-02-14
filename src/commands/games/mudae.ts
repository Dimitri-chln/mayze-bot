import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import { DatabaseMudaeWish } from "../../types/structures/Database";

const command: Command = {
	name: "mudae",
	aliases: [],
	description: {
		fr: "Utiliser une liste de commandes utilitaires pour Mudae",
		en: "Use a list of utility commands for Mudae",
	},
	usage: "",
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],

	options: {
		fr: [
			{
				name: "wish",
				description: "Gérer tes wish Mudae",
				type: "SUB_COMMAND_GROUP",
				options: [
					{
						name: "list",
						description: "Voir la liste de tes wish Mudae",
						type: "SUB_COMMAND",
						options: [
							{
								name: "user",
								description: "L'utilisateur dont tu veux voir la liste de wish",
								type: "USER",
								required: false,
							},
							{
								name: "regex",
								description:
									"Une option pour afficher le regex à côté du nom des séries",
								type: "BOOLEAN",
								required: false,
							},
						],
					},
					{
						name: "add",
						description: "Ajouter un wish à ta liste de wish Mudae",
						type: "SUB_COMMAND",
						options: [
							{
								name: "series",
								description: "Le nom de la série",
								type: "STRING",
								required: true,
							},
							{
								name: "regex",
								description:
									"Un regex pour faire aussi correspondre les noms alternatifs",
								type: "STRING",
								required: false,
							},
						],
					},
					{
						name: "remove",
						description: "Retirer un wish de ta liste de wish Mudae",
						type: "SUB_COMMAND",
						options: [
							{
								name: "series",
								description: "Le numéro de la série à retirer",
								type: "INTEGER",
								required: true,
							},
						],
					},
				],
			},
		],
		en: [
			{
				name: "wish",
				description: "Manage your Mudae wishes",
				type: "SUB_COMMAND_GROUP",
				options: [
					{
						name: "list",
						description: "See the list of your Mudae wishes",
						type: "SUB_COMMAND",
						options: [
							{
								name: "user",
								description: "The user whose wishlist you want to see",
								type: "USER",
								required: false,
							},
							{
								name: "regex",
								description:
									"An option to display the regex next to the series' name",
								type: "BOOLEAN",
								required: false,
							},
						],
					},
					{
						name: "add",
						description: "Add a wish to your Mudae wishlist",
						type: "SUB_COMMAND",
						options: [
							{
								name: "series",
								description: "The name of the series",
								type: "STRING",
								required: true,
							},
							{
								name: "regex",
								description: "A regex to match alternative names as well",
								type: "STRING",
								required: false,
							},
						],
					},
					{
						name: "remove",
						description: "Remove a wish from your Mudae wishlist",
						type: "SUB_COMMAND",
						options: [
							{
								name: "series",
								description: "The number of the series to remove",
								type: "INTEGER",
								required: true,
							},
						],
					},
				],
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		if (!interaction.guild.members.cache.has("432610292342587392"))
			return interaction.followUp(translations.strings.mudae_missing());

		const subCommandGroup = interaction.options.getSubcommandGroup();

		switch (subCommandGroup) {
			case "wish": {
				const subCommand = interaction.options.getSubcommand();

				switch (subCommand) {
					case "list": {
						const user =
							interaction.options.getUser("user") ?? interaction.user;
						const displayRegex = Boolean(
							interaction.options.getBoolean("regex"),
						);

						const { rows: wishlist }: { rows: DatabaseMudaeWish[] } =
							await Util.database.query(
								"SELECT * FROM mudae_wish WHERE user_id = $1 ORDER BY id",
								[interaction.user.id],
							);

						interaction.followUp({
							embeds: [
								{
									author: {
										name: translations.strings.title(user.tag),
										iconURL: user.displayAvatarURL({
											dynamic: true,
										}),
									},
									color: interaction.guild.me.displayColor,
									description:
										wishlist
											.map(
												(w, i) =>
													`\`${i + 1}.\` ${w.series}${
														displayRegex
															? ` - *${
																	w.regex ? w.regex : w.series.toLowerCase()
															  }*`
															: ""
													}`,
											)
											.join("\n") ?? translations.strings.no_wish(),
									footer: {
										text: "✨ Mayze ✨",
									},
								},
							],
						});
						break;
					}

					case "add": {
						const series = interaction.options.getString("series");
						const regex = interaction.options.getString("regex");

						await Util.database.query(
							"INSERT INTO mudae_wish (user_id, series, regex) VALUES ($1, $2, $3)",
							[interaction.user.id, series, regex],
						);

						interaction.followUp(translations.strings.added());
						break;
					}

					case "remove": {
						const series = interaction.options.getInteger("series");

						const { rows: wishlist }: { rows: DatabaseMudaeWish[] } =
							await Util.database.query(
								"SELECT * FROM mudae_wish WHERE user_id = $1 ORDER BY id",
								[interaction.user.id],
							);

						await Util.database.query("DELETE FROM mudae_wish WHERE id = $1", [
							wishlist[series - 1].id,
						]);

						interaction.followUp(translations.strings.removed());
						break;
					}
				}
				break;
			}
		}
	},
};

export default command;
