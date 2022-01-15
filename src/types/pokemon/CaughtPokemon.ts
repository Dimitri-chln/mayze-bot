import Pokedex from "./Pokedex";
import Pokemon from "./Pokemon";



export default class CaughtPokemon {
	data: Pokemon;
	shiny: boolean;
	variation: PokemonVariationName;
	caught: number;
	favorite: boolean;
	nickname: string;

	constructor(pokemonData: PokemonData) {
		this.data = Pokedex.findById(pokemonData.pokedex_id);
		this.shiny = pokemonData.shiny;
		this.variation = pokemonData.variation;
		this.caught = pokemonData.caught;
		this.favorite = pokemonData.favorite;
		this.nickname = pokemonData.nickname;
	}
}

export type PokemonVariationName = "default" | "alola";

export interface PokemonData {
	pokedex_id: number;
	pokedex_name: string;
	shiny: boolean;
	variation: PokemonVariationName;
	caught: number;
	favorite: boolean;
	nickname: string;
}