import AutocompleteHandler from "../types/structures/AutocompleteHandler";
import Util from "../Util";

import { DatabasePlaylist } from "../types/structures/Database";

const autocompleteHandler: AutocompleteHandler = {
	name: "playlist",
	options: [
		{
			subCommandGroup: null,
			subCommand: "play",
			name: "name",
			type: "STRING",
			filterType: "CONTAINS",
			run: async (interaction, value) => {
				const { rows: playlists }: { rows: DatabasePlaylist[] } =
					await Util.database.query(
						"SELECT * FROM playlist WHERE NOT PRIVATE OR user_id = $1 ORDER BY name ASC",
						[interaction.user.id],
					);

				return playlists.map((playlist) => {
					return {
						name: playlist.name,
						value: playlist.name,
					};
				});
			},
		},
		{
			subCommandGroup: null,
			subCommand: "remove",
			name: "name",
			type: "STRING",
			filterType: "CONTAINS",
			run: async (interaction, value) => {
				const { rows: playlists }: { rows: DatabasePlaylist[] } =
					await Util.database.query(
						"SELECT * FROM playlist WHERE user_id = $1 ORDER BY name ASC",
						[interaction.user.id],
					);

				return playlists.map((playlist) => {
					return {
						name: playlist.name,
						value: playlist.name,
					};
				});
			},
		},
	],
};

export default autocompleteHandler;
