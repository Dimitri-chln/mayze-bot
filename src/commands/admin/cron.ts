import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import { CronJob } from "cron";

const command: Command = {
	name: "cron",
	description: {
		fr: "Planifier une tâche cron",
		en: "Start a cron task",
	},
	userPermissions: [],
	botPermissions: ["ADMINISTRATOR"],

	options: {
		fr: [
			{
				name: "date",
				description: "La paramètre cronTime de la tâche",
				type: "STRING",
				required: true,
			},
			{
				name: "task",
				description: "La tâche à exécuter",
				type: "STRING",
				required: true,
			},
		],
		en: [
			{
				name: "date",
				description: "The task's cronTime parameter",
				type: "STRING",
				required: true,
			},
			{
				name: "task",
				description: "The task to execute",
				type: "STRING",
				required: true,
			},
		],
	},

	run: async (interaction, translations) => {
		const date = new Date(interaction.options.getString("date"));

		if (!date) return interaction.followUp(translations.strings.invalid_date());

		if (date.valueOf() < Date.now())
			return interaction.followUp(translations.strings.date_passed());

		const taskString = interaction.options.getString("task");
		const task = eval(`async () => { ${taskString} }`);
		const job = new CronJob(date, task);

		job.start();

		interaction.followUp(translations.strings.saved());
	},
};

export default command;
