import { Snowflake } from "discord.js";
import { VariationType } from "../../utils/pokemon/pokemonInfo";
import CaughtPokemon from "./CaughtPokemon";
import Pokemon from "./Pokemon";
import { DatabasePokemon } from "../../types/structures/Database";



export default class PokemonList {
	pokemons: CaughtPokemon[];

	constructor(pokemonList: DatabasePokemon[], userId: Snowflake) {
		this.pokemons = pokemonList.map(pokemonData =>
			new CaughtPokemon(pokemonData, userId)
		);
	}

	has(pokemon: Pokemon, variation: VariationType = "default") {
		return this.pokemons.some(pkm => pkm.data.nationalId === pokemon.nationalId && pkm.variation === variation);
	}
}