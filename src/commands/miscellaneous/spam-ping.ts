import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, Message, PermissionFlagsBits, PermissionsBitField, User } from "discord.js";
import Util from "../../Util";

const command: CommandData = {
	name: "spam-ping",
	aliases: [],
	userPermissions: new PermissionsBitField([PermissionFlagsBits.ManageMessages]),
	botPermissions: new PermissionsBitField(),
	cooldown: 60,
	allowedGuildIds: [Util.config.MAIN_GUILD_ID, "724530039781326869"],

	options: [
		{
			type: ApplicationCommandOptionType.User,
			name: "user",
			description: undefined,
			required: true,
		},
		{
			type: ApplicationCommandOptionType.Integer,
			name: "number",
			description: undefined,
			required: true,
			min_value: 1,
			max_value: 100,
		},
		{
			type: ApplicationCommandOptionType.String,
			name: "message",
			description: undefined,
			required: false,
		},
	],

	async run(input, args, localizations) {
		const user = args.get("user") as User;
		const number = args.get("number") as number;
		const message = args.get("message") as string;

		if (number < 1 || number > 100) {
			await input.reply(localizations.invalid_number.format(input.locale));
			return;
		}

		input.reply(localizations.sending.format(input.locale));

		const content = `${user.toString()} ${message ?? ""}`;
		const messages: Promise<Message>[] = [];

		for (let i = 0; i < number; i++)
			messages.push(
				new Promise((resolve, reject) =>
					input.channel
						.send(content)
						.then((msg) => resolve(msg))
						.catch(() => resolve(null)),
				),
			);

		if (message) messages.shift();

		input.channel.bulkDelete(
			(await Promise.all(messages)).filter((msg) => msg),
			true,
		);

		input.editReply(localizations.sent.format(input.locale));
	},
};

export default command;
