import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "loop",
	aliases: [],
	description: {
		fr: "Activer ou désactiver la répétition de la musique actuelle",
		en: "Toggle the repetition of the current song",
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
		const loop = Util.musicPlayer.get(interaction.guild.id).toggleRepeatSong();

		interaction.followUp(translations.strings.toggled(loop));
	},
};

export default command;
