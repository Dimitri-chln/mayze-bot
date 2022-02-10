import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import pagination, { Page } from "../../utils/misc/pagination";

const command: Command = {
	name: "sql",
	description: {
		fr: "Effectuer une requête SQL sur la base de données",
		en: "Run a SQL query on the database",
	},
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],

	options: {
		fr: [
			{
				name: "query",
				description: "La requête à effectuer",
				type: "STRING",
				required: true,
			},
		],
		en: [
			{
				name: "query",
				description: "The query to run",
				type: "STRING",
				required: true,
			},
		],
	},

	run: async (interaction, translations) => {
		const query = interaction.options.getString("query");
		const res = await Util.database.query(query);

		switch (res.command) {
			case "SELECT": {
				const resString = JSON.stringify(res.rows, null, 2);

				const regex = /\[?\s*\{\n.{0,2000}\},?\n\]?/gsy;
				const fallbackRegex = /.{0,2000}/gsy;
				const matches =
					resString.match(regex) ?? resString.match(fallbackRegex);

				const pages: Page[] = [];
				const page: (desc: string) => Page = (desc) => {
					return {
						embeds: [
							{
								author: {
									name: query,
									iconURL: interaction.user.displayAvatarURL({
										dynamic: true,
									}),
								},
								title: translations.strings.title(
									res.rowCount.toString(),
									res.rowCount > 1,
								),
								color: interaction.guild.me.displayColor,
								description: desc,
							},
						],
					};
				};

				for (const match of matches) {
					const page: Page = {
						embeds: [
							{
								author: {
									name: query,
									iconURL: interaction.user.displayAvatarURL({
										dynamic: true,
									}),
								},
								title: translations.strings.title(
									res.rowCount.toString(),
									res.rowCount > 1,
								),
								color: interaction.guild.me.displayColor,
								description: `\`\`\`json\n${match}\n\`\`\``,
							},
						],
					};

					pages.push(page);
				}

				pagination(interaction, pages);
				break;
			}

			default:
				interaction.followUp(translations.strings.completed());
		}
	},
};

export default command;
