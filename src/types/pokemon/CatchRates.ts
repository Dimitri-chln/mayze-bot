import Pokedex from "./Pokedex";
import PokemonList from "./PokemonList";



export default class CatchRates {
	data: number[];

	constructor(pokemonList: PokemonList, upgrades: PokemonUpgrades) {
		const data: number[] = [];

		for (const pokemon of Pokedex.pokemons) {
			let probability = pokemon.catchRate;

			if (pokemon.legendary || pokemon.ultraBeast) probability *= 1 + (upgrades.legendary_ultrabeast_tier * 2) / 100;
			if (!pokemonList.has(pokemon)) probability *= 1 + (upgrades.new_pokemon_tier * 2) / 100;

			data.push(data.slice(-1)[0] + probability);
		}
	}

	randomPokemon() {
		const randomNumber = Math.random() * this.data.slice(-1)[0];

		for (let i = 0; i < this.data.length; i ++) {
			if (randomNumber < this.data[i]) return Pokedex.findById(i + 1);
		}
	}
}

export interface PokemonUpgrades {
	user_id: string;
	catch_cooldown_tier: number;
	new_pokemon_tier: number;
	legendary_ultrabeast_tier: number;
	mega_gem_tier: number;
	shiny_tier: number;
}