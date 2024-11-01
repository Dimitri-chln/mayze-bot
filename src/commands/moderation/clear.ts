import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField, User } from "discord.js";
import Util from "../../Util";
import { CommandInputType } from "../../structures/commands/CommandInput";

const command: CommandData = {
	name: "clear",
	aliases: [],
	userPermissions: new PermissionsBitField([PermissionFlagsBits.ManageMessages]),
	botPermissions: new PermissionsBitField([PermissionFlagsBits.ManageMessages]),

	options: [
		{
			type: ApplicationCommandOptionType.Integer,
			name: "number",
			description: undefined,
			required: true,
			min_value: 1,
			max_value: 99,
		},
		{
			type: ApplicationCommandOptionType.User,
			name: "user",
			description: undefined,
			required: false,
		},
		{
			type: ApplicationCommandOptionType.String,
			name: "pattern",
			description: undefined,
			required: false,
		},
		{
			type: ApplicationCommandOptionType.Boolean,
			name: "bot",
			description: undefined,
			required: false,
		},
	],

	async run(input, args, localizations) {
		const number = args.get("number") as number;
		const user = args.get("user") as User;
		const bot = args.get("bot") as boolean;
		const regex = args.get("pattern") as string;

		if (number < 1 || number > 99) {
			await input.reply(localizations.invalid_number.format(input.locale));
			return;
		}

		let messages = await input.channel.messages.fetch({
			limit: number + (input.type === CommandInputType.Message ? 1 : 0),
		});

		if (user) messages = messages.filter((msg) => msg.author.id === user.id);
		if (bot) messages = messages.filter((msg) => msg.author.bot);
		if (regex) messages = messages.filter((msg) => new RegExp(regex, "i").test(msg.content));

		await input.channel.bulkDelete(messages, true);

		const reply = await input.channel.send(localizations.cleared.format(input.locale, number.toString(), number > 1));
		setTimeout(() => reply.delete().catch(console.error), 4_000);
	},
};

export default command;
