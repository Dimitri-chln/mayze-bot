import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "stop",
	aliases: ["leave"],
	description: {
		fr: "Arrêter complètement la musique",
		en: "Stop the music completely",
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
		Util.musicPlayer
			.get(interaction.guild.id)
			.stop();

		interaction.followUp(translations.strings.stopped());
	},
};

export default command;
