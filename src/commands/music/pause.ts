import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "pause",
	aliases: [],
	description: {
		fr: "Mettre en pause la musique actuelle",
		en: "Pause the current song",
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
		Util.musicPlayer.get(interaction.guild.id).pause();

		interaction.followUp(translations.strings.paused());
	},
};

export default command;
