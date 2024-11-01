import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import Util from "../../Util";

const command: CommandData = {
	name: "afk",
	aliases: [],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField(),

	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: "message",
			description: undefined,
			required: false,
		},
	],

	async run(input, args, localizations) {
		const message = args.get("message") as string;

		Util.database.query(
			`
			INSERT INTO "user" (id, afk_since, afk_message) VALUES ($1, $2, $3)
			ON CONFLICT (id)
			DO UPDATE SET
				afk_since = $2, afk_message = $3
			WHERE "user".id = EXCLUDED.id
		`,
			[input.user.id, new Date().toISOString(), message],
		);

		input.reply(localizations.reply.format(input.locale, input.user.tag, message));
	},
};

export default command;
