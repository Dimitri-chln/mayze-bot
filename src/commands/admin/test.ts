import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "test",
	aliases: [],
	description: {
		fr: "Une commande de test",
		en: "A test command",
	},
	usage: "",
	userPermissions: [],
	botPermissions: [],

	options: {
		fr: [],
		en: [],
	},

	runInteraction: async (interaction, translations) => {},
};

export default command;
