import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import Util from "../../Util";

import { DatabaseUser } from "../../types/Database";

import getLevel from "../../utils/misc/getLevel";
import pagination, { Page } from "../../utils/misc/pagination";

const command: CommandData = {
	name: "top",
	aliases: ["leaderboard", "lb"],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField([PermissionFlagsBits.EmbedLinks]),

	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: "leaderboard",
			description: undefined,
			required: true,
			choices: [
				{
					name: undefined,
					value: "text",
				},
				{
					name: undefined,
					value: "voice",
				},
			],
		},
	],

	async run(input, args, localizations) {
		const leaderboard = args.get("leaderboard") as "text" | "voice";

		const databaseLeaderboardName = leaderboard === "text" ? "level_chat_xp" : "level_voice_xp";

		let { rows: top }: { rows: Pick<DatabaseUser, "id" | "level_chat_xp" | "level_voice_xp">[] } =
			await Util.database.query(
				`SELECT id, level_chat_xp, level_voice_xp FROM "user" ORDER BY ${databaseLeaderboardName} DESC`,
			);

		top = top.filter((user) => input.guild.members.cache.has(user.id));

		// If no member is ranked yet
		if (!top.length)
			input.reply({
				embeds: [
					{
						author: {
							name: localizations.author.format(input.locale, input.guild.name, leaderboard === "text"),
							icon_url: input.guild.iconURL(),
						},
						color: input.guild.members.me.displayColor,
						description: localizations.no_member.format(input.locale),
					},
				],
			});

		// Otherwise (in most cases)
		const pages: Page[] = [];

		for (let i = 0; i < top.length; i += Util.config.ITEMS_PER_PAGE) {
			const page: Page = {
				embeds: [
					{
						author: {
							name: localizations.author.format(input.locale, input.guild.name, leaderboard === "text"),
							icon_url: input.guild.iconURL(),
						},
						color: input.guild.members.me.displayColor,
						description: top
							.slice(i, i + Util.config.ITEMS_PER_PAGE)
							.map((user, j) =>
								localizations.description_line.format(
									input.locale,
									(i + j + 1).toString(),
									input.guild.members.cache.get(user.id).user.tag,
									getLevel(user[databaseLeaderboardName]).level.toString(),
								),
							)
							.join("\n"),
					},
				],
			};

			pages.push(page);
		}

		pagination(input, pages);
	},
};

export default command;
