import AutocompleteHandler from "../types/structures/AutocompleteHandler";
import Util from "../Util";

import { DatabaseMudaeWish } from "../types/structures/Database";

const autocompleteHandler: AutocompleteHandler = {
	name: "mudae",
	options: [
		{
			subCommandGroup: "wish",
			subCommand: "remove",
			name: "series",
			type: "STRING",
			filterType: "CONTAINS",
			run: async (interaction, value) => {
				const { rows: wishlist }: { rows: DatabaseMudaeWish[] } = await Util.database.query(
					"SELECT * FROM mudae_wish WHERE user_id = $1 ORDER BY series ASC",
					[interaction.user.id],
				);

				return wishlist.map((wish) => {
					return {
						name: wish.series,
						value: wish.id,
					};
				});
			},
		},
	],
};

export default autocompleteHandler;
