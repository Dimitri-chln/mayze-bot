import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import pagination, { Page } from "../../utils/misc/pagination";

const command: Command = {
	name: "queue",
	aliases: ["q"],
	description: {
		fr: "Voir la queue de chansons du serveur",
		en: "See the server music queue",
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

		const pages: Page[] = [];

		for (let i = 0; i < queue.songs.length; i += Util.config.ITEMS_PER_PAGE) {
			const page: Page = {
				embeds: [
					{
						author: {
							name: translations.strings.author(interaction.guild.name),
							iconURL: interaction.guild.iconURL({ dynamic: true }),
						},
						title: translations.strings.title(Util.music.millisecondsToTime(queue.duration)),
						color: interaction.guild.me.displayColor,
						description: queue.songs
							.slice(i, i + Util.config.ITEMS_PER_PAGE)
							.map((song, j) => translations.strings.description(i + j === 0, (i + j).toString(), song.name, song.url))
							.join("\n"),
					},
				],
			};

			pages.push(page);
		}

		pagination(interaction, pages);
	},
};

export default command;
