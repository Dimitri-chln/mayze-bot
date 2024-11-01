import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField, User } from "discord.js";
import Util from "../../Util";

const command: CommandData = {
	name: "banner",
	aliases: [],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField([PermissionFlagsBits.EmbedLinks]),

	options: [
		{
			type: ApplicationCommandOptionType.User,
			name: "user",
			description: undefined,
			required: false,
		},
	],

	async run(input, args, localizations) {
		const user = (args.get("user") as User) ?? input.user;

		// Force fetch the user for the hexAccentColor property to be set
		await user.fetch(true);

		input.reply({
			embeds: [
				{
					author: {
						name: localizations.author.format(input.locale, user.tag),
						icon_url: user.displayAvatarURL(),
					},
					color: input.guild.members.me.displayColor,
					image: {
						url:
							user.bannerURL({
								size: 4096,
							}) ?? `https://dummyimage.com/640x16:9/${user.hexAccentColor?.replace("#", "") ?? "00"}/00.png?text=%20`,
					},
					footer: {
						text: Util.config.DEFAULT_EMBED_FOOTER_TEXT,
					},
				},
			],
		});
	},
};

export default command;
