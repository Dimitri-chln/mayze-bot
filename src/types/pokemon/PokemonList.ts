import { Snowflake } from "discord.js";
import { VariationType } from "../../utils/pokemon/pokemonInfo";
import CaughtPokemon from "./CaughtPokemon";
import Pokemon from "./Pokemon";
import { DatabasePokemon } from "../../types/structures/Database";

export default class PokemonList {
	readonly pokemons: CaughtPokemon[];

	constructor(pokemonList: DatabasePokemon[], userId: Snowflake) {
		this.pokemons = pokemonList.map((pokemonData) => new CaughtPokemon(pokemonData, userId));
	}

	has(pokemon: Pokemon, shiny: boolean = false, variationType: VariationType = "default") {
		return this.pokemons.some(
			(pkm) => pkm.data.nationalId === pokemon.nationalId && pkm.shiny === shiny && pkm.variationType === variationType,
		);
	}
}
