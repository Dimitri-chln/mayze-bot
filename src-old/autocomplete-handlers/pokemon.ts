import AutocompleteHandler from "../types/structures/AutocompleteHandler";
import Util from "../Util";

import PokemonList from "../types/pokemon/PokemonList";
import { DatabasePokemon } from "../types/structures/Database";

const autocompleteHandler: AutocompleteHandler = {
	name: "pokemon",
	options: [
		{
			subCommandGroup: null,
			subCommand: "add-fav",
			name: "pokemon",
			type: "STRING",
			filterType: "CONTAINS",
			run: async (interaction, value) => {
				const language = Util.guildConfigs.get(interaction.guild.id).language;

				const { rows: pokemons }: { rows: DatabasePokemon[] } = await Util.database.query(
					"SELECT * FROM pokemon WHERE users ? $1",
					[interaction.user.id],
				);

				const pokemonList = new PokemonList(pokemons, interaction.user.id);

				return pokemonList.pokemons.map((pokemon) => {
					return {
						name:
							pokemon.data.formatName(language, pokemon.shiny, pokemon.variationType, pokemon.variation) +
							(pokemon.nickname ? ` - "${pokemon.nickname}"` : ""),
						value:
							(pokemon.shiny ? "Shiny " : "") +
							pokemon.data.formatName(language, pokemon.shiny, pokemon.variationType, pokemon.variation, "raw"),
					};
				});
			},
		},
		{
			subCommandGroup: null,
			subCommand: "remove-fav",
			name: "pokemon",
			type: "STRING",
			filterType: "CONTAINS",
			run: async (interaction, value) => {
				const language = Util.guildConfigs.get(interaction.guild.id).language;

				const { rows: pokemons }: { rows: DatabasePokemon[] } = await Util.database.query(
					"SELECT * FROM pokemon WHERE users ? $1",
					[interaction.user.id],
				);

				const pokemonList = new PokemonList(pokemons, interaction.user.id);

				return pokemonList.pokemons.map((pokemon) => {
					return {
						name:
							pokemon.data.formatName(language, pokemon.shiny, pokemon.variationType, pokemon.variation) +
							(pokemon.nickname ? ` - "${pokemon.nickname}"` : ""),
						value:
							(pokemon.shiny ? "Shiny " : "") +
							pokemon.data.formatName(language, pokemon.shiny, pokemon.variationType, pokemon.variation, "raw"),
					};
				});
			},
		},
		{
			subCommandGroup: null,
			subCommand: "nick",
			name: "pokemon",
			type: "STRING",
			filterType: "CONTAINS",
			run: async (interaction, value) => {
				const language = Util.guildConfigs.get(interaction.guild.id).language;

				const { rows: pokemons }: { rows: DatabasePokemon[] } = await Util.database.query(
					"SELECT * FROM pokemon WHERE users ? $1",
					[interaction.user.id],
				);

				const pokemonList = new PokemonList(pokemons, interaction.user.id);

				return pokemonList.pokemons.map((pokemon) => {
					return {
						name:
							pokemon.data.formatName(language, pokemon.shiny, pokemon.variationType, pokemon.variation) +
							(pokemon.nickname ? ` - "${pokemon.nickname}"` : ""),
						value:
							(pokemon.shiny ? "Shiny " : "") +
							pokemon.data.formatName(language, pokemon.shiny, pokemon.variationType, pokemon.variation, "raw"),
					};
				});
			},
		},
		{
			subCommandGroup: null,
			subCommand: "list",
			name: "name",
			type: "STRING",
			filterType: "CONTAINS",
			run: async (interaction, value) => {
				const language = Util.guildConfigs.get(interaction.guild.id).language;

				const pokemons = Util.pokedex.pokemons;

				return pokemons.map((pokemon) => {
					return {
						name: pokemon.formatName(language, false, "default"),
						value: pokemon.formatName(language, false, "default", "default", "raw"),
					};
				});
			},
		},
		{
			subCommandGroup: null,
			subCommand: "list",
			name: "evolution",
			type: "STRING",
			filterType: "CONTAINS",
			run: async (interaction, value) => {
				const language = Util.guildConfigs.get(interaction.guild.id).language;

				const pokemons = Util.pokedex.pokemons;

				return pokemons.map((pokemon) => {
					return {
						name: pokemon.formatName(language, false, "default"),
						value: pokemon.formatName(language, false, "default", "default", "raw"),
					};
				});
			},
		},
	],
};

export default autocompleteHandler;
