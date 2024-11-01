import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import Util from "../../Util";
import { CommandInputType } from "../../structures/commands/CommandInput";

const command: CommandData = {
	name: "say",
	aliases: [],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField([PermissionFlagsBits.ManageMessages]),
	ephemeralReply: true,

	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: "message",
			description: undefined,
			required: true,
		},
	],

	async run(input, args, localizations) {
		const message = args.get("message") as string;

		if (input.type === CommandInputType.Interaction) {
			await input.reply("\u3164").then(() => input.deleteReply().catch(console.error));
		} else {
			input.message.delete().catch(console.error);
		}

		input.channel.send(message);
	},
};

export default command;
