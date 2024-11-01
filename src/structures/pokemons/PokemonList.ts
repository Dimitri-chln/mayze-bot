import Util from "../../Util";

import { User } from "discord.js";

import { DatabaseUserPokemon } from "../../types/Database";
import Pokemon, { VariationName, VariationTypeName } from "./Pokemon";
import UserPokemon from "./UserPokemon";

export default class PokemonList {
	readonly user: User;
	readonly pokemons: UserPokemon[];

	constructor(user: User, data: DatabaseUserPokemon[]) {
		this.user = user;
		this.pokemons = data.map((pokemonData) => new UserPokemon(pokemonData));
	}

	has(
		nationalId: number,
		shiny: boolean = false,
		variationType: VariationTypeName = VariationTypeName.default,
		variation: VariationName = VariationName.default,
	): boolean {
		return this.pokemons.some(
			(pkm) =>
				pkm.data.nationalId === nationalId &&
				pkm.shiny === shiny &&
				pkm.variationType === variationType &&
				pkm.variation === variation,
		);
	}
}
