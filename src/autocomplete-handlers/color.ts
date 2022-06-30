import AutocompleteHandler from "../types/structures/AutocompleteHandler";
import Util from "../Util";

const autocompleteHandler: AutocompleteHandler = {
	name: "color",
	options: [
		{
			subCommandGroup: null,
			subCommand: null,
			name: "name",
			type: "STRING",
			filterType: "CONTAINS",
			run: async (interaction, value) => {
				return Array.from(Util.colorRoles).map(([, role], i) => {
					return {
						name: `${i + 1} - ${role.name}`,
						value: role.id,
					};
				});
			},
		},
	],
};

export default autocompleteHandler;
