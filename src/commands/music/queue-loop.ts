import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "queue-loop",
	aliases: [],
	description: {
		fr: "Activer ou désactiver la répétition de la queue",
		en: "Toggle the repetition of the queue",
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
		const loop = Util.musicPlayer.get(interaction.guild.id).toggleRepeatQueue();

		interaction.followUp(translations.strings.toggled(loop));
	},
};

export default command;
