import Util from "../../Util";
import { Snowflake } from "discord.js";
import { Variation, VariationType } from "../../utils/pokemon/pokemonInfo";
import Pokemon from "./Pokemon";
import { DatabasePokemon } from "../../types/structures/Database";

export default class CaughtPokemon {
	readonly data: Pokemon;
	readonly shiny: boolean;
	readonly variationType: VariationType;
	readonly variation: Variation;
	readonly caught: number;
	readonly favorite: boolean;
	readonly nickname?: string;

	constructor(pokemonData: DatabasePokemon, userId: Snowflake) {
		this.data = Util.pokedex.findById(pokemonData.national_id);
		this.shiny = pokemonData.shiny;
		this.variationType = pokemonData.variation_type;
		this.variation = pokemonData.variation;
		this.caught = pokemonData.users[userId].caught;
		this.favorite = pokemonData.users[userId].favorite;
		this.nickname = pokemonData.users[userId].nickname;
	}
}
