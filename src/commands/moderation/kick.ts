import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField, User } from "discord.js";
import Util from "../../Util";

const command: CommandData = {
	name: "kick",
	aliases: [],
	userPermissions: new PermissionsBitField([PermissionFlagsBits.KickMembers]),
	botPermissions: new PermissionsBitField([PermissionFlagsBits.KickMembers]),

	options: [
		{
			type: ApplicationCommandOptionType.User,
			name: "user",
			description: undefined,
			required: true,
		},
		{
			type: ApplicationCommandOptionType.String,
			name: "reason",
			description: undefined,
			required: false,
		},
		{
			type: ApplicationCommandOptionType.Boolean,
			name: "force",
			description: undefined,
			required: false,
		},
	],

	async run(input, args, localizations) {
		const user = args.get("user") as User;
		const reason = args.get("reason") as string;
		const force = args.get("force") as boolean;

		const member = input.guild.members.cache.get(user.id);

		if (member.roles.highest.position >= input.member.roles.highest.position || input.guild.ownerId === member.id) {
			await input.reply(localizations.not_allowed.format(input.locale));
			return;
		}

		// Server booster
		if (member.premiumSinceTimestamp && !force) {
			await input.reply(localizations.boost.format(input.locale));
			return;
		}

		if (member.roles.highest.position >= input.guild.members.me.roles.highest.position) {
			await input.reply(localizations.too_high.format(input.locale, user.tag));
			return;
		}

		member.kick(localizations.reason.format(input.locale, input.user.tag, reason)).then(() => {
			input.reply(localizations.kicked.format(input.locale, user.tag));
		});
	},
};

export default command;
