import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

const command: Command = {
	name: "ping",
	description: {
		fr: "Pong !",
		en: "Pong!",
	},
	userPermissions: [],
	botPermissions: [],

	options: {
		fr: [],
		en: [],
	},

	run: async (interaction, translations) => {
		interaction.followUp(`Pong! **${interaction.client.ws.ping}**ms`);
	},
};

export default command;
