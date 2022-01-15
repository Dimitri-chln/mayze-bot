import CaughtPokemon, { PokemonVariationName, PokemonData } from "./CaughtPokemon";
import Pokemon from "./Pokemon";



export default class PokemonList {
	pokemons: CaughtPokemon[];

	constructor(pokemonList: PokemonData[]) {
		this.pokemons = pokemonList.map(pokemonData =>
			new CaughtPokemon(pokemonData)	
		);
	}

	has(pokemon: Pokemon, variation?: PokemonVariationName) {
		return this.pokemons.some(pkm => pkm.data.nationalId === pokemon.nationalId && pkm.variation === (variation ?? "default"));
	}
}