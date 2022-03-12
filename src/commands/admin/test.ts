import { GuildMember, Message } from "discord.js";
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
		fr: [
			{
				name: "field",
				description: "Un champ",
				type: "STRING",
				required: true,
				autocomplete: true,
			},
		],
		en: [
			{
				name: "field",
				description: "A field",
				type: "STRING",
				required: true,
				autocomplete: true,
			},
		],
	},

	runInteraction: async (interaction, translations) => {},
};

export default command;
