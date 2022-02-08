import { DatabaseUpgrades } from "../structures/Database";
import Pokedex from "./Pokedex";
import PokemonList from "./PokemonList";

export default class CatchRates {
	readonly data: number[];

	constructor(pokemonList: PokemonList, upgrades: DatabaseUpgrades) {
		this.data = [];

		for (const pokemon of Pokedex.pokemons) {
			let probability = pokemon.catchRate;

			if (pokemon.legendary || pokemon.ultraBeast)
				probability *=
					1 + (upgrades.legendary_ub_probability * 2) / 100;
			if (!pokemonList.has(pokemon))
				probability *= 1 + (upgrades.new_pokemon_probability * 2) / 100;

			this.data.push((this.data.slice(-1)[0] ?? 0) + probability);
		}
	}

	randomPokemon() {
		const randomNumber = Math.random() * this.data.slice(-1)[0];

		for (let i = 0; i < this.data.length; i++) {
			if (randomNumber < this.data[i]) return Pokedex.findById(i + 1);
		}
	}
}
