import { Snowflake } from "discord.js";
import Util from "../../Util";
import { DatabaseUserPokemon } from "../../types/Database";
import Pokemon, { VariationName, VariationTypeName } from "./Pokemon";

export default class UserPokemon {
	readonly userId: Snowflake;
	readonly data: Pokemon;
	readonly shiny: boolean;
	readonly variationType: VariationTypeName;
	readonly variation: VariationName;
	readonly caught: number;
	readonly favorite: boolean;
	readonly nickname?: string;

	constructor(pokemonData: DatabaseUserPokemon) {
		this.userId = pokemonData.user_id;
		this.data = Util.pokedex.findById(pokemonData.pokemon_id);
		this.shiny = pokemonData.shiny;
		this.variationType = pokemonData.variation_type;
		this.variation = pokemonData.variation;
		this.caught = pokemonData.caught;
		this.favorite = pokemonData.favorite;
		this.nickname = pokemonData.nickname;
	}
}
