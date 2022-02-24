import AutocompleteHandler from "../types/structures/AutocompleteHandler";
import Util from "../Util";

const autocompleteHandler: AutocompleteHandler = {
	name: "stats",
	options: [
		{
			subCommandGroup: "pokemons",
			subCommand: "about",
			name: "pokemon",
			type: "STRING",
			filterType: "CONTAINS",
			run: async (interaction, value) => {
				const language = Util.guildConfigs.get(interaction.guild.id).language;

				const pokemons = Util.pokedex.pokemons;

				return pokemons.map((pokemon) => {
					return {
						name: pokemon.formatName(language, false, "default"),
						value: pokemon.formatName(language, false, "default", "raw"),
					};
				});
			},
		},
	],
};

export default autocompleteHandler;
