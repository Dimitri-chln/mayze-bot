import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import Util from "../../Util";

const command: CommandData = {
	name: "8-ball",
	aliases: ["8ball", "ask"],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField(),

	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: "question",
			description: undefined,
			required: true,
		},
	],

	async run(input, args, localizations) {
		const question = args.get("question") as string;

		const answers = localizations.answers.localization.get(input.locale).split(/,\s+/);
		const answer = answers[Math.floor(Math.random() * answers.length)];

		input.reply(localizations.reply.format(input.locale, question, answer));
	},
};

export default command;
