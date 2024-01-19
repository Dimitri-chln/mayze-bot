import { Message } from "discord.js";
import Command from "../types/structures/Command";
import Util from "../Util";

const command: Command = {
	name: "",
	aliases: [],
	description: {
		fr: "",
		en: "",
	},
	usage: "",
	userPermissions: [],
	botPermissions: [],

	options: {
		fr: [],
		en: [],
	},

	runInteraction: async (interaction, translations) => {},

	runMessage: async (message, args, translations) => {},
};

export default command;
