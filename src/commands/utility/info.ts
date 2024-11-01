import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import Util from "../../Util";

const command: CommandData = {
	name: "info",
	aliases: [],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField(PermissionFlagsBits.EmbedLinks),

	options: [],

	async run(input, args, localizations) {
		input.reply({
			embeds: [
				{
					author: {
						name: input.client.user.username,
						icon_url: input.client.user.displayAvatarURL(),
					},
					title: localizations.title.format(input.locale),
					color: input.guild.members.me.displayColor,
					description: localizations.description.format(
						input.locale,
						Util.owner.tag,
						Math.round((Date.now() - input.client.uptime) / 1000).toString(),
					),
					footer: {
						text: Util.config.DEFAULT_EMBED_FOOTER_TEXT,
					},
				},
			],
		});
	},
};

export default command;
