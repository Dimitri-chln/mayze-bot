import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

import formatTime from "../../utils/misc/formatTime";



const command: Command = {
	name: "lapse-of-time",
	description: {
		fr: "Obtenir le temps entre aujourd'hui et une autre date",
		en: "See how much time there is between now and another date"
	},
	userPermissions: [],
	botPermissions: [],

	options:  {
		fr: [
			{
				name: "date",
				description: "La date",
				type: "STRING",
				required: true
			}
		],
		en: [
			{
				name: "date",
				description: "La date",
				type: "STRING",
				required: true
			}
		]
	},
	
	run: async (interaction: CommandInteraction, translations: Translations) => {
		const NOW = Date.now();
		
		const date = new Date(interaction.options.getString("date"));
		if (!date) return interaction.reply({
			content: translations.data.invalid_date(),
			ephemeral: true
		});

		const lapseOfTime = NOW - date.valueOf();
		const lapseOfTimeString = formatTime(Math.abs(lapseOfTime), translations.language);

		interaction.reply(
			translations.data.response(
				lapseOfTime > 0,
				lapseOfTimeString,
				date.getDate().toString(),
				translations.data.month_list()[date.getMonth() - 1],
				date.getFullYear().toString(),
				date.getHours().toString(),
				date.getMinutes().toString(),
				date.getSeconds().toString()
			)
		);
	}
};



export default command;