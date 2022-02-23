import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import formatTime from "../../utils/misc/formatTime";

const command: Command = {
	name: "lapse-of-time",
	aliases: [],
	description: {
		fr: "Obtenir le temps entre aujourd'hui et une autre date",
		en: "See how much time there is between now and another date",
	},
	usage: "",
	userPermissions: [],
	botPermissions: [],

	options: {
		fr: [
			{
				name: "date",
				description: "La date",
				type: "STRING",
				required: true,
			},
		],
		en: [
			{
				name: "date",
				description: "The date",
				type: "STRING",
				required: true,
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const NOW = Date.now();

		const input = interaction.options.getString("date", true).trim();
		const match =
			input.match(
				/^(\d{1,2})-(\d{1,2})-(\d+)(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/,
			) ??
			input.match(
				/^(\d{1,2})\/(\d{1,2})\/(\d+)(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/,
			);

		const date = match
			? new Date(
					`${match[2]}-${match[1]}-${match[3]}${
						match[4] && match[5]
							? ` ${match[4]}:${match[5]}${match[6] ? `:${match[6]}` : ""}`
							: ""
					}`,
			  )
			: new Date(input);
		if (!date.valueOf())
			return interaction.followUp(translations.strings.invalid_date());

		const lapseOfTime = NOW - date.valueOf();
		const lapseOfTimeString = formatTime(
			Math.abs(lapseOfTime),
			translations.language,
		);

		interaction.followUp(
			translations.strings.response(
				lapseOfTime > 0,
				lapseOfTimeString,
				date.getDate().toString(),
				translations.strings.month_list()[date.getMonth()],
				date.getFullYear().toString(),
				date.getHours().toString().padStart(2, "0"),
				date.getMinutes().toString().padStart(2, "0"),
				date.getSeconds().toString().padStart(2, "0"),
				date.getDate().toString().endsWith("1"),
				date.getDate().toString().endsWith("2"),
				date.getDate().toString().endsWith("3"),
			),
		);
	},
};

export default command;
