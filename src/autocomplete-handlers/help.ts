import AutocompleteHandler from "../types/structures/AutocompleteHandler";
import Util from "../Util";

const autocompleteHandler: AutocompleteHandler = {
	name: "help",
	options: [
		{
			subCommandGroup: null,
			subCommand: null,
			name: "command",
			type: "STRING",
			filterType: "CONTAINS",
			run: async (interaction, value) => {
				const publicCommands = Util.commands
					.filter(
						(cmd) =>
							(!cmd.guildIds || cmd.guildIds.includes(interaction.guild.id)) &&
							cmd.category !== "admin",
					)
					.sort((a, b) => a.name.localeCompare(b.name));

				return publicCommands.map((cmd) => {
					return {
						name: cmd.name,
						value: cmd.name,
					};
				});
			},
		},
	],
};

export default autocompleteHandler;
