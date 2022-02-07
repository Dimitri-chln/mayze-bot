import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";



const command: Command = {
	name: "test",
	description: {
		fr: "Une commande de test",
		en: "A test command"
	},
	userPermissions: [],
	botPermissions: [],

	options: {
		fr: [],
		en: []
	},
	
	run: async (interaction, translations) => {
		
	}
};



export default command;