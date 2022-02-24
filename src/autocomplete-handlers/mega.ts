import AutocompleteHandler from "../types/structures/AutocompleteHandler";
import Util from "../Util";

const autocompleteHandler: AutocompleteHandler = {
	name: "mega",
	options: [
		{
			subCommandGroup: null,
			subCommand: "evolve",
			name: "pokemon",
			type: "STRING",
			filterType: "CONTAINS",
			run: async (interaction, value) => {
				const language = Util.guildConfigs.get(interaction.guild.id).language;

				const pokemons = Util.pokedex.megaEvolvablePokemons;

				return pokemons
					.map((pokemon) => {
						return {
							name: pokemon.formatName(language, false, "default"),
							value: pokemon.formatName(language, false, "default", "raw"),
						};
					})
					.concat(
						pokemons.map((pokemon) => {
							return {
								name: pokemon.formatName(language, true, "default"),
								value:
									"Shiny " +
									pokemon.formatName(language, true, "default", "raw"),
							};
						}),
					);
			},
		},
	],
};

export default autocompleteHandler;
