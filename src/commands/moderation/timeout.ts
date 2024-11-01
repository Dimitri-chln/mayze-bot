import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField, User } from "discord.js";
import Util from "../../Util";

import dhms from "dhms";
import formatTime from "../../utils/misc/formatTime";

const command: CommandData = {
	name: "timeout",
	aliases: ["mute"],
	userPermissions: new PermissionsBitField([PermissionFlagsBits.ModerateMembers]),
	botPermissions: new PermissionsBitField([PermissionFlagsBits.ModerateMembers]),

	options: [
		{
			type: ApplicationCommandOptionType.User,
			name: "user",
			description: undefined,
			required: true,
		},
		{
			type: ApplicationCommandOptionType.String,
			name: "duration",
			description: undefined,
			required: true,
		},
		{
			type: ApplicationCommandOptionType.String,
			name: "reason",
			description: undefined,
			required: false,
		},
	],

	async run(input, args, localizations) {
		const user = args.get("user") as User;
		const duration = Math.min(
			Math.max(
				dhms(args.get("duration") as string),
				10 * 1000, // Min 10 seconds
			),
			28 * 24 * 60 * 60 * 1000, // Max 28 days
		);
		const reason = args.get("reason") as string;

		const member = input.guild.members.cache.get(user.id);

		if (
			member.roles.highest.position >= input.member.roles.highest.position ||
			member.permissions.has(PermissionFlagsBits.Administrator) ||
			input.guild.ownerId === member.id
		) {
			await input.reply(localizations.not_allowed.format(input.locale));
			return;
		}

		if (member.roles.highest.position > input.guild.members.me.roles.highest.position) {
			await input.reply(localizations.too_high.format(input.locale, user.tag));
			return;
		}

		await member.timeout(duration, localizations.reason.format(input.locale, input.user.tag, reason));

		input.reply(localizations.timed_out.format(input.locale, user.tag, await formatTime(duration, input.locale)));
	},
};

export default command;
