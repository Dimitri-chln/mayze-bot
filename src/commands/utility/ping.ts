import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "ping",
	aliases: [],
	description: {
		fr: "Pong !",
		en: "Pong!",
	},
	usage: "",
	userPermissions: [],
	botPermissions: [],

	options: {
		fr: [],
		en: [],
	},

	runInteraction: async (interaction, translations) => {
		interaction.followUp(`Pong! **${interaction.client.ws.ping}**ms`);
	},
};

export default command;
