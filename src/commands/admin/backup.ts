import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

import { MessageAttachment } from "discord.js";
import { SECRET_CHANNEL_ID } from "../../config.json";



const command: Command = {
	name: "backup",
	description: {
		fr: "Sauvegarder des données en cas de perte",
		en: "Save data locally in case of a loss"
	},
	userPermissions: [],
	botPermissions: ["ATTACH_FILES"],
	
	options: {
		fr: [
			{
				name: "table",
				description: "La table de la base de donnée à sauvegarder",
				type: "STRING",
				required: true
			}
		],
		en: [
			{
				name: "table",
				description: "The database table to save",
				type: "STRING",
				required: true
			}
		]
	},
	
	run: async (interaction: CommandInteraction, translations: Translations) => {
		if (interaction.channel.id !== SECRET_CHANNEL_ID) return;
		
		const table = interaction.options.getString("table");
		
		const { rows } = await Util.database.query(
			"SELECT * FROM $1",
			[ table ]
		);
		
		const attachment = new MessageAttachment(Buffer.from(JSON.stringify(rows, null, 4)), `${table}.json`);
		
		interaction.reply({ files: [ attachment ] });
	}
};



export default command;