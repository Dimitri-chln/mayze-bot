import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField, User } from "discord.js";
import Util from "../../Util";
import { DatabaseMudaeWish } from "../../types/Database";

const command: CommandData = {
	name: "mudae",
	aliases: [],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField([PermissionFlagsBits.EmbedLinks]),

	options: [
		{
			type: ApplicationCommandOptionType.SubcommandGroup,
			name: "wish",
			description: undefined,
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "list",
					description: undefined,
					options: [
						{
							type: ApplicationCommandOptionType.User,
							name: "user",
							description: undefined,
							required: false,
						},
						{
							type: ApplicationCommandOptionType.Boolean,
							name: "pattern",
							description: undefined,
							required: false,
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "add",
					description: undefined,
					options: [
						{
							type: ApplicationCommandOptionType.String,
							name: "series",
							description: undefined,
							required: true,
						},
						{
							type: ApplicationCommandOptionType.String,
							name: "pattern",
							description: undefined,
							required: false,
						},
					],
				},
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "remove",
					description: undefined,
					options: [
						{
							type: ApplicationCommandOptionType.Integer,
							name: "series",
							description: undefined,
							required: true,
							autocomplete: true,
						},
					],
				},
			],
		},
	],

	run: {
		wish: {
			list: async function (input, args, localizations) {
				const user = (args.get("user") as User) ?? input.user;
				const displayRegex = args.get("pattern") as boolean;

				// Check if the server has Mudae
				if (!input.guild.members.cache.has("432610292342587392")) {
					await input.reply(localizations.mudae_missing.format(input.locale));
					return;
				}

				const { rows: wishlist }: { rows: DatabaseMudaeWish[] } = await Util.database.query(
					"SELECT * FROM mudae_wish WHERE user_id = $1 ORDER BY series ASC",
					[user.id],
				);

				input.reply({
					embeds: [
						{
							author: {
								name: localizations.author.format(input.locale, user.tag),
								icon_url: user.displayAvatarURL(),
							},
							color: input.guild.members.me.displayColor,
							description:
								wishlist
									.map(
										(wish, i) =>
											`\`${i + 1}.\` ${wish.series}${
												displayRegex ? ` - *${wish.regex ?? wish.series.toLowerCase()}*` : ""
											}`,
									)
									.join("\n") ?? `*${localizations.no_wish.format(input.locale)}*`,
							footer: {
								text: Util.config.DEFAULT_EMBED_FOOTER_TEXT,
							},
						},
					],
				});
			},

			add: async function (input, args, localizations) {
				const series = args.get("series") as string;
				const regex = args.get("pattern") as string;

				// Check if the server has Mudae
				if (!input.guild.members.cache.has("432610292342587392")) {
					await input.reply(localizations.mudae_missing.format(input.locale));
					return;
				}

				await Util.database.query("INSERT INTO mudae_wish (user_id, series, regex) VALUES ($1, $2, $3)", [
					input.user.id,
					series,
					regex,
				]);

				input.reply(localizations.added.format(input.locale));
			},

			remove: async function (input, args, localizations) {
				const series = args.get("series") as number;

				// Check if the server has Mudae
				if (!input.guild.members.cache.has("432610292342587392")) {
					await input.reply(localizations.mudae_missing.format(input.locale));
					return;
				}

				const { rows: wishlist }: { rows: DatabaseMudaeWish[] } = await Util.database.query(
					"SELECT * FROM mudae_wish WHERE user_id = $1 ORDER BY series ASC",
					[input.user.id],
				);

				await Util.database.query("DELETE FROM mudae_wish WHERE id = $1", [wishlist[series - 1].id]);

				input.reply(localizations.removed.format(input.locale));
			},
		},
	},
};

export default command;
