import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import LanguageStrings from "../../types/structures/LanguageStrings";
import Util from "../../Util";



const command: Command = {
	name: "ping",
	description: {
		fr: "Pong !",
		en: "Pong!"
	},
	userPermissions: [],
	botPermissions: [],

	options: {
		fr: [],
		en: []
	},
	
	run: async (interaction: CommandInteraction, languageStrings: LanguageStrings) => {
		interaction.reply({
			content: `Pong! **${interaction.client.ws.ping}**ms`,
			ephemeral: true
		});
	}
};



export default command;