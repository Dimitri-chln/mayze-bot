import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import Util from "../../Util";

const command: CommandData = {
	name: "kick-myself",
	aliases: ["kickmyself", "kms", "4-4-2", "442"],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField([PermissionFlagsBits.KickMembers]),
	allowedGuildIds: [Util.config.MAIN_GUILD_ID, "724530039781326869"],

	options: [],

	async run(input, args, localizations) {
		// Server booster
		if (input.member.premiumSinceTimestamp) {
			await input.reply(localizations.boost.format(input.locale));
			return;
		}

		if (input.member.roles.highest.position >= input.guild.members.me.roles.highest.position) {
			await input.reply(localizations.too_high.format(input.locale));
			return;
		}

		input.member.kick(localizations.reason.format(input.locale)).then(() => {
			input.reply(localizations.kicked.format(input.locale, input.user.tag));
		});
	},
};

export default command;
