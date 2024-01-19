import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "clear-queue",
	aliases: ["cq"],
	description: {
		fr: "Supprimer la queue",
		en: "Clear the queue",
	},
	usage: "",
	userPermissions: [],
	botPermissions: ["USE_EXTERNAL_EMOJIS"],
	voice: true,
	voicePlaying: true,

	options: {
		fr: [],
		en: [],
	},

	runInteraction: async (interaction, translations) => {
		Util.musicPlayer.get(interaction.guild.id).clear();

		interaction.followUp(translations.strings.cleared());
	},
};

export default command;
