import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import pagination, { Page } from "../../utils/misc/pagination";
import getLevel from "../../utils/misc/getLevel";
import { DatabaseLevel } from "../../types/structures/Database";

const command: Command = {
	name: "top",
	aliases: [],
	description: {
		fr: "Obtenir le classement d'xp des membres",
		en: "Get the xp leaderboard of the members ",
	},
	usage: "",
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],

	options: {
		fr: [
			{
				name: "leaderboard",
				description: "Le classement à afficher",
				type: "STRING",
				required: true,
				choices: [
					{
						name: "Textuel",
						value: "chat_xp",
					},
					{
						name: "Vocal",
						value: "voice_xp",
					},
				],
			},
		],
		en: [
			{
				name: "leaderboard",
				description: "The leaderboard to show",
				type: "STRING",
				required: true,
				choices: [
					{
						name: "Text",
						value: "chat_xp",
					},
					{
						name: "Voice",
						value: "voice_xp",
					},
				],
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const leaderboard = interaction.options.getString("leaderboard", true) as
			| "chat_xp"
			| "voice_xp";

		let { rows: top }: { rows: DatabaseLevel[] } = await Util.database.query(
			`SELECT * FROM level ORDER BY ${leaderboard} DESC`,
		);

		top = top.filter((user) =>
			interaction.guild.members.cache.has(user.user_id),
		);

		const pages: Page[] = [];

		if (!top.length)
			pages.push({
				embeds: [
					{
						author: {
							name: translations.strings.author(
								interaction.guild.name,
								leaderboard === "chat_xp",
							),
							iconURL: interaction.guild.iconURL({
								dynamic: true,
							}),
						},
						color: interaction.guild.me.displayColor,
						description: translations.strings.no_member(),
					},
				],
			});

		for (let i = 0; i < top.length; i += Util.config.ITEMS_PER_PAGE) {
			const page: Page = {
				embeds: [
					{
						author: {
							name: translations.strings.author(
								interaction.guild.name,
								leaderboard === "chat_xp",
							),
							iconURL: interaction.guild.iconURL({
								dynamic: true,
							}),
						},
						color: interaction.guild.me.displayColor,
						description: top
							.slice(i, i + Util.config.ITEMS_PER_PAGE)
							.map((user, j) =>
								translations.strings.description(
									(i + j + 1).toString(),
									interaction.guild.members.cache.get(user.user_id).user
										.username,
									getLevel(user[leaderboard]).level.toString(),
								),
							)
							.join("\n"),
					},
				],
			};

			pages.push(page);
		}

		pagination(interaction, pages);
	},
};

export default command;
