import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "shuffle",
	aliases: [],
	description: {
		fr: "Mélanger la queue",
		en: "Shuffle the queue",
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
		const songs = Util.musicPlayer.get(interaction.guild.id).shuffle();

		interaction.followUp(
			translations.strings.shuffled(
				(songs.length - 1).toString(),
				songs.length > 2,
			),
		);
	},
};

export default command;
