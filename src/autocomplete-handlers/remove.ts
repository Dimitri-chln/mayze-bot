import AutocompleteHandler from "../types/structures/AutocompleteHandler";
import Util from "../Util";

const autocompleteHandler: AutocompleteHandler = {
	name: "remove",
	options: [
		{
			subCommandGroup: null,
			subCommand: null,
			name: "songs",
			type: "STRING",
			filterType: "CONTAINS",
			run: async (interaction, value) => {
				const songs =
					Util.musicPlayer.get(interaction.guild.id)?.songs?.slice(1) ?? [];

				return songs.map((song, i) => {
					return {
						name: song.name,
						value: (i + 1).toString(),
					};
				});
			},
		},
	],
};

export default autocompleteHandler;
