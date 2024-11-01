import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import Util from "../../Util";

import pagination, { Page } from "../../utils/misc/pagination";

const command: CommandData = {
	name: "sql",
	aliases: [],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField([PermissionFlagsBits.EmbedLinks]),

	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: "query",
			description: undefined,
			required: true,
		},
	],

	async run(input, args, localizations) {
		const query = args.get("query") as string;

		const res = await Util.database.query(query);

		switch (res.command) {
			case "SELECT": {
				const rowsString = JSON.stringify(res.rows, null, 2);

				const regex = /\[?\s*\{\n.{0,2000}\},?\n\]?/gsy;
				const fallbackRegex = /.{0,2000}/gsy;
				const matches = rowsString.match(regex) ?? rowsString.match(fallbackRegex);

				const pages: Page[] = [];

				for (const match of matches) {
					const page: Page = {
						embeds: [
							{
								author: {
									name: query,
									icon_url: input.user.displayAvatarURL(),
								},
								title: localizations.title.format(input.locale, res.rowCount.toString(), res.rowCount > 1),
								color: input.guild.members.me.displayColor,
								description: `\`\`\`json\n${match}\n\`\`\``,
							},
						],
					};

					pages.push(page);
				}

				await pagination(input, pages);
				break;
			}

			default:
				await input.reply(localizations.completed.format(input.locale));
		}
	},
};

export default command;
