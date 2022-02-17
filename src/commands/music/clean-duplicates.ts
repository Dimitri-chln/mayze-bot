import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "clean-duplicates",
	aliases: ["cleanduplicates", "clean-dupes", "cleandupes"],
	description: {
		fr: "Supprimer les musiques en double dans la queue",
		en: "Delete the songs that are twice or more in the queue",
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
		const songs = Util.musicPlayer.get(interaction.guild.id).cleanDuplicates();

		interaction.followUp(
			translations.strings.removed(songs.length.toString(), songs.length > 1),
		);
	},
};

export default command;
