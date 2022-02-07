import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

import { DatabaseWish } from "../../types/structures/Database";



const command: Command = {
	name: "mudae",
	description: {
		fr: "Utiliser une liste de commandes utilitaires pour Mudae",
		en: "Use a list of utility commands for Mudae"
	},
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
								required: false
							}
						]
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
								required: true
							},
							{
								name: "regex",
								description: "Un regex pour faire aussi correspondre les noms alternatifs",
								type: "STRING",
								required: false
							}
						]
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
								required: true
							}
						]
					}
				]
			}
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
								required: false
							}
						]
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
								required: true
							},
							{
								name: "regex",
								description: "A regex to match alternative names as well",
								type: "STRING",
								required: false
							}
						]
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
								required: true
							}
						]
					}
				]
			}
		]
	},
	
	run: async (interaction, translations) => {
		if (!interaction.guild.members.cache.has("432610292342587392"))
			return interaction.reply({
				content: translations.data.mudae_missing(),
				ephemeral: true
			});
		
		const subCommandGroup = interaction.options.getSubcommandGroup();

		switch (subCommandGroup) {
			case "wish": {
				const subCommand = interaction.options.getSubcommand();

				switch (subCommand) {
					case "list": {
						const user = interaction.options.getUser("user") ?? interaction.user;

						const { rows: wishlist }: { rows: DatabaseWish[] } = await Util.database.query(
							"SELECT * FROM wishes WHERE user_id = $1 ORDER BY id",
							[ interaction.user.id ]
						);
						
						interaction.reply({
							embeds: [
								{
									author: {
										name: translations.data.title(user.tag),
										iconURL: user.displayAvatarURL({ dynamic: true })
									},
									color: interaction.guild.me.displayColor,
									description: wishlist.map((w, i) => `\`${i + 1}.\` ${w.series} - *${w.regex ? w.regex : w.series.toLowerCase()}*`).join("\n") ?? translations.data.no_wish(),
									footer: {
										text: "✨ Mayze ✨"
									}
								}
							]
						});
						break;
					}

					case "add": {
						const series = interaction.options.getString("series");
						const regex = interaction.options.getString("regex");

						await Util.database.query(
							"INSERT INTO wishes (user_id, series, regex) VALUES ($1, $2, $3)",
							[ interaction.user.id, series, regex ]
						);
						
						interaction.reply({
							content: translations.data.added(),
							ephemeral: true
						});
						break;
					}

					case "remove": {
						const series = interaction.options.getInteger("series");
						
						const { rows: wishlist }: { rows: DatabaseWish[] } = await Util.database.query(
							"SELECT * FROM wishes WHERE user_id = $1 ORDER BY id",
							[ interaction.user.id ]
						);

						await Util.database.query(
							"DELETE FROM wishes WHERE id = $1",
							[ wishlist[series - 1].id ]
						);
						
						interaction.reply({
							content: translations.data.removed(),
							ephemeral: true
						});
						break;
					}
				}
				break;
			}
		}
	}
};



export default command;