import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, Locale, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import Util from "../../Util";

const command: CommandData = {
	name: "config",
	aliases: [],
	userPermissions: new PermissionsBitField([PermissionFlagsBits.ManageGuild]),
	botPermissions: new PermissionsBitField(),

	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: "view",
			description: undefined,
		},
		{
			type: ApplicationCommandOptionType.SubcommandGroup,
			name: "set",
			description: undefined,
			options: [
				{
					type: ApplicationCommandOptionType.Subcommand,
					name: "language",
					description: undefined,
					options: [
						{
							type: ApplicationCommandOptionType.String,
							name: "language",
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
		view: async function (input, args, localizations) {
			const config = Util.guildConfigs.get(input.guild.id);

			input.reply({
				embeds: [
					{
						author: {
							name: localizations.author.format(input.locale),
							icon_url: input.guild.members.me.displayAvatarURL(),
						},
						color: input.guild.members.me.displayColor,
						description: localizations.description.format(
							input.locale,
							config.locale,
							config.jailRoleId ? input.guild.roles.cache.get(config.jailRoleId).toString() : null,
						),
						footer: {
							text: Util.config.DEFAULT_EMBED_FOOTER_TEXT,
						},
					},
				],
			});
		},

		set: {
			language: async function (input, args, localizations) {
				const language = (args.get("language") as string).replace("_", "-") as Locale;

				const availableLocales = Object.values(Locale).sort();
				if (!availableLocales.includes(language)) {
					await input.reply(localizations.invalid_language.format(input.locale, availableLocales.join("`, `")));
					return;
				}

				await Util.database.query(
					`
					INSERT INTO guild_config VALUES ($1, $2)
					ON CONFLICT (guild_id)
					DO UPDATE SET
						language = $2
					WHERE guild_config.guild_id = EXCLUDED.guild_id
					`,
					[input.guild.id, language],
				);

				Util.guildConfigs.get(input.guild.id).locale = language;

				input.reply(localizations.changed.format(language));
			},
		},
	},
};

export default command;
