import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "now-playing",
	aliases: ["nowplaying", "np"],
	description: {
		fr: "Voir la musique actuelle",
		en: "See the current song",
	},
	usage: "",
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],
	voicePlaying: true,

	options: {
		fr: [],
		en: [],
	},

	runInteraction: async (interaction, translations) => {
		const queue = Util.musicPlayer.get(interaction.guild.id);

		const reply = (await interaction.followUp({
			content: translations.strings.loading(),
			fetchReply: true,
		})) as Message;

		queue.createSongDisplay(reply);
	},
};

export default command;
