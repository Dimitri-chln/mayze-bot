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
				const topRole = interaction.guild.roles.cache.get("818531980480086086");
				const bottomRole = interaction.guild.roles.cache.get("735809874205737020");

				const roles = interaction.guild.roles.cache
					.filter((role) => role.rawPosition > bottomRole.rawPosition && role.rawPosition < topRole.rawPosition)
					.sort((a, b) => b.rawPosition - a.rawPosition);

				return Array.from(roles).map(([, role], i) => {
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
