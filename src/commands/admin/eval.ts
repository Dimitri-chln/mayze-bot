import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import Util from "../../Util";

const command: CommandData = {
	name: "eval",
	aliases: [],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField(),

	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: "expression",
			description: undefined,
			required: true,
		},
	],

	async run(input, args, localizations) {
		const expression = args.get("expression") as string;

		await input.reply(localizations.evaluating.format(input.locale));

		try {
			eval(expression);
		} catch (err) {
			console.error(err);
			await input.reply(localizations.error.format(input.locale));
		}
	},
};

export default command;
