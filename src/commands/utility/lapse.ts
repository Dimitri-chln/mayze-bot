import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import Util from "../../Util";

import parseDate from "../../utils/misc/parseDate";
import formatTime from "../../utils/misc/formatTime";

const command: CommandData = {
	name: "lapse",
	aliases: [],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField(),

	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: "date",
			description: undefined,
			required: true,
		},
		{
			type: ApplicationCommandOptionType.String,
			name: "time",
			description: undefined,
			required: false,
		},
	],

	async run(input, args, localizations) {
		const date = args.get("date") as string;
		const time = args.get("time") as string;

		const dateString = `${date} ${time ? time : ""}`.trim();
		const parsedDate = parseDate(dateString);
		if (!parsedDate.valueOf()) {
			await input.reply(localizations.invalid_date.format(input.locale));
			return;
		}

		const lapse = Date.now() - parsedDate.valueOf();
		const lapseString = await formatTime(Math.abs(lapse), input.locale);

		input.reply(
			localizations.response.format(
				input.locale,
				lapse > 0,
				lapseString,
				parsedDate.getDate().toString(),
				localizations.months.localization.get(input.locale).split(/,\s+/)[parsedDate.getMonth()],
				parsedDate.getFullYear().toString(),
				parsedDate.getHours().toString().padStart(2, "0"),
				parsedDate.getMinutes().toString().padStart(2, "0"),
				parsedDate.getSeconds().toString().padStart(2, "0"),
				parsedDate.getDate().toString().endsWith("1"),
				parsedDate.getDate().toString().endsWith("2"),
				parsedDate.getDate().toString().endsWith("3"),
			),
		);
	},
};

export default command;
