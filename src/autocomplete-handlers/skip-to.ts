import AutocompleteHandler from "../types/structures/AutocompleteHandler";
import Util from "../Util";

const autocompleteHandler: AutocompleteHandler = {
	name: "skip-to",
	options: [
		{
			subCommandGroup: null,
			subCommand: null,
			name: "song",
			type: "STRING",
			filterType: "CONTAINS",
			run: async (interaction, value) => {
				const songs =
					Util.musicPlayer.get(interaction.guild.id)?.songs?.slice(1) ?? [];

				return songs.map((song, i) => {
					return {
						name: song.name,
						value: i + 1,
					};
				});
			},
		},
	],
};

export default autocompleteHandler;
