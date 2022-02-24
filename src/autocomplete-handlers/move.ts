import AutocompleteHandler from "../types/structures/AutocompleteHandler";
import Util from "../Util";

const autocompleteHandler: AutocompleteHandler = {
	name: "move",
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
		{
			subCommandGroup: null,
			subCommand: null,
			name: "after",
			type: "STRING",
			filterType: "CONTAINS",
			run: async (interaction, value) => {
				const songs = Util.musicPlayer.get(interaction.guild.id)?.songs ?? [];

				return songs.map((song, i) => {
					return {
						name: song.name,
						value: i,
					};
				});
			},
		},
	],
};

export default autocompleteHandler;
