import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "skip",
	aliases: ["s"],
	description: {
		fr: "Passer la musique actuelle",
		en: "Skip the current song",
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
		const song = Util.musicPlayer.get(interaction.guild.id).skip();

		interaction.followUp(translations.strings.skipped(song.name));
	},
};

export default command;
