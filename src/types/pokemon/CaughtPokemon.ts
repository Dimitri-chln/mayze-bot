import Util from "../../Util";
import { Snowflake } from "discord.js";
import { VariationType } from "../../utils/pokemon/pokemonInfo";
import Pokemon from "./Pokemon";
import { DatabasePokemon } from "../../types/structures/Database";

export default class CaughtPokemon {
	readonly data: Pokemon;
	readonly shiny: boolean;
	readonly variation: VariationType;
	readonly caught: number;
	readonly favorite: boolean;
	readonly nickname?: string;

	constructor(pokemonData: DatabasePokemon, userId: Snowflake) {
		this.data = Util.pokedex.findById(pokemonData.pokedex_id);
		this.shiny = pokemonData.shiny;
		this.variation = pokemonData.variation;
		this.caught = pokemonData.users[userId].caught;
		this.favorite = pokemonData.users[userId].favorite;
		this.nickname = pokemonData.users[userId].nickname;
	}
}
