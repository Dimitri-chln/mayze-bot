import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "resume",
	aliases: [],
	description: {
		fr: "Reprendre la musique actuelle",
		en: "Resume the current song",
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
		Util.musicPlayer.get(interaction.guild.id).resume();

		interaction.followUp(translations.strings.resumed());
	},
};

export default command;
