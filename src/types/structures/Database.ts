import { Snowflake } from "discord.js";
import { VariationType } from "../../utils/pokemon/pokemonInfo";

export interface DatabaseColor {
	alias: string;
	name: string;
	code: number;
	palette: string;
}

enum TriggerType {
	"CONTAINS",
	"EQUAL",
	"REGEX",
	"STARTS_WITH",
	"ENDS_WITH",
}

export interface DatabaseCustomResponse {
	id: number;
	trigger: string;
	response: string;
	trigger_type: TriggerType;
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
		};
	};
}

export interface DatabaseReminder {
	id: number;
	user_id: Snowflake;
	timestamp: string;
	content: string;
}

export interface DatabaseUpgrades {
	user_id: Snowflake;
	catch_cooldown_reduction: number;
	new_pokemon_probability: number;
	legendary_ub_probability: number;
	mega_gem_probability: number;
	shiny_probability: number;
}

export interface DatabaseWish {
	id: number;
	user_id: Snowflake;
	series: string;
	regex: string;
}
