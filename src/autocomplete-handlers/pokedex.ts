import AutocompleteHandler from "../types/structures/AutocompleteHandler";
import Util from "../Util";

const autocompleteHandler: AutocompleteHandler = {
	name: "pokedex",
	options: [
		{
			subCommandGroup: null,
			subCommand: "find",
			name: "pokemon",
			type: "STRING",
			filterType: "CONTAINS",
			run: async (interaction, value) => {
				const language = Util.guildConfigs.get(interaction.guild.id).language;

				const pokemons = Util.pokedex.pokemons;

				return (
					pokemons
						// Normal pokémons
						.map((pokemon) => {
							return {
								name: pokemon.formatName(language, false, "default"),
								value: pokemon.formatName(language, false, "default", "raw"),
							};
						})
						.concat(
							// Shiny pokémons
							pokemons.map((pokemon) => {
								return {
									name: pokemon.formatName(language, true, "default"),
									value:
										"Shiny " +
										pokemon.formatName(language, true, "default", "raw"),
								};
							}),
						)
						.concat(
							// Alolan pokémons
							pokemons
								.filter((pokemon) =>
									Util.pokedex.alolaPokemons.has(pokemon.nationalId),
								)
								.map((pokemon) => {
									return {
										name: pokemon.formatName(language, false, "alola"),
										value: pokemon.formatName(language, true, "alola", "raw"),
									};
								}),
						)
						.concat(
							// Shiny alolan pokémons
							pokemons
								.filter((pokemon) =>
									Util.pokedex.alolaPokemons.has(pokemon.nationalId),
								)
								.map((pokemon) => {
									return {
										name: pokemon.formatName(language, true, "alola"),
										value:
											"Shiny " +
											pokemon.formatName(language, true, "alola", "raw"),
									};
								}),
						)
						.concat(
							// Mega pokémons
							...pokemons
								.filter((pokemon) =>
									Util.pokedex.megaEvolvablePokemons.has(pokemon.nationalId),
								)
								.map((pokemon) => {
									return pokemon.megaEvolutions.map((megaEvolution) => {
										return {
											name: pokemon.formatName(
												language,
												false,
												megaEvolution.suffix,
											),
											value: pokemon.formatName(
												language,
												true,
												megaEvolution.suffix,
												"raw",
											),
										};
									});
								}),
						)
						.concat(
							// Shiny mega pokémons
							...pokemons
								.filter((pokemon) =>
									Util.pokedex.megaEvolvablePokemons.has(pokemon.nationalId),
								)
								.map((pokemon) => {
									return pokemon.megaEvolutions.map((megaEvolution) => {
										return {
											name: pokemon.formatName(
												language,
												true,
												megaEvolution.suffix,
											),
											value:
												"Shiny " +
												pokemon.formatName(
													language,
													true,
													megaEvolution.suffix,
													"raw",
												),
										};
									});
								}),
						)
				);
			},
		},
		{
			subCommandGroup: null,
			subCommand: "evo-line",
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
