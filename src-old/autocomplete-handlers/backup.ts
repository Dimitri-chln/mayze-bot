import AutocompleteHandler from "../types/structures/AutocompleteHandler";
import Util from "../Util";

const autocompleteHandler: AutocompleteHandler = {
	name: "backup",
	options: [
		{
			subCommandGroup: null,
			subCommand: null,
			name: "table",
			type: "STRING",
			filterType: "CONTAINS",
			run: async (interaction, value) => {
				const { rows: tables }: { rows: { table_name: string }[] } = await Util.database.query(
					"SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
				);

				return tables.map((table) => {
					return {
						name: table.table_name,
						value: table.table_name,
					};
				});
			},
		},
	],
};

export default autocompleteHandler;
