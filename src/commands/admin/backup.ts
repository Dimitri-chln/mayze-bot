import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import { MessageAttachment } from "discord.js";

const command: Command = {
	name: "backup",
	description: {
		fr: "Sauvegarder des données en cas de perte",
		en: "Save data locally in case of a loss",
	},
	userPermissions: [],
	botPermissions: ["ATTACH_FILES"],

	options: {
		fr: [
			{
				name: "table",
				description: "La table de la base de donnée à sauvegarder",
				type: "STRING",
				required: true,
			},
		],
		en: [
			{
				name: "table",
				description: "The database table to save",
				type: "STRING",
				required: true,
			},
		],
	},

	run: async (interaction, translations) => {
		if (interaction.channel.id !== Util.config.SECRET_CHANNEL_ID) return;

		const table = interaction.options.getString("table");

		const { rows } = await Util.database.query(`SELECT * FROM ${table}`);

		const attachment = new MessageAttachment(
			Buffer.from(JSON.stringify(rows, null, 4)),
			`${table}.json`,
		);

		interaction.followUp({
			files: [attachment],
		});
	},
};

export default command;
