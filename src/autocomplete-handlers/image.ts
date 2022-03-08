import AutocompleteHandler from "../types/structures/AutocompleteHandler";
import Util from "../Util";

const autocompleteHandler: AutocompleteHandler = {
	name: "image",
	options: [
		{
			subCommandGroup: null,
			subCommand: "overlay",
			name: "type",
			type: "STRING",
			filterType: "CONTAINS",
			run: async (interaction, value) => {
				const types = Util.config.IMAGE_GENERATION_TYPES;

				return types.map((type) => {
					return {
						name: type.replace(/^./, (a) => a.toUpperCase()),
						value: type,
					};
				});
			},
		},
	],
};

export default autocompleteHandler;
