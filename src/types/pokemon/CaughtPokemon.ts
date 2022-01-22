import { Snowflake } from "discord.js";
import { VariationType } from "../../utils/pokemon/pokemonInfo";
import Pokedex from "./Pokedex";
import Pokemon, { DatabasePokemon } from "./Pokemon";



export default class CaughtPokemon {
	data: Pokemon;
	shiny: boolean;
	variation: VariationType;
	caught: number;
	favorite: boolean;
	nickname?: string;

	constructor(pokemonData: DatabasePokemon, userId: Snowflake) {
		this.data = Pokedex.findById(pokemonData.pokedex_id);
		this.shiny = pokemonData.shiny;
		this.variation = pokemonData.variation;
		this.caught = pokemonData.users[userId].caught;
		this.favorite = pokemonData.users[userId].favorite;
		this.nickname = pokemonData.users[userId].nickname;
	}
}