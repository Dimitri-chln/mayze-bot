import { Snowflake } from "discord.js";
import { VariationType } from "../../utils/pokemon/pokemonInfo";



export interface DatabaseColor {
	alias: string;
	name: string;
	code: number;
	palette: string;
}

export interface DatabaseLevel {
	user_id: string;
	chat_xp: number;
	voice_xp: number;
}

export interface DatabasePokemon {
	pokedex_id: number;
	shiny: boolean;
	variation: VariationType;
	users: {
		[K: Snowflake]: {
			caught: number;
			favorite: boolean;
			nickname?: string;
		}
	}
}

export interface DatabaseReminder {
	id: number;
	user_id: Snowflake;
	timestamp: string;
	content: string;
}

export interface DatabaseWish {
	id: number;
	user_id: Snowflake;
	series: string;
	regex: string;
}