import { Snowflake } from "discord.js";
import { VariationType, Variation } from "../../utils/pokemon/pokemonInfo";
import { Language } from "./Translations";

export interface DatabaseAfkUser {
	user_id: Snowflake;
	timestamp: string;
	message?: string;
}

export enum CanvasOwnerType {
	EVERYONE = 1,
	GUILD = 2,
	CHANNEL = 3,
	USER = 4,
}

export interface DatabaseCanvas {
	name: string;
	size: number;
	data: string[][];
	owner_type: CanvasOwnerType;
	owner_id?: Snowflake;
	users: Snowflake[];
	archived: boolean;
}

export enum ClanMemberRank {
	MEMBER = 1,
	CO_LEADER = 2,
	LEADER = 3,
}

export interface DatabaseClanMember {
	username: string;
	joined_at: string;
	user_id: Snowflake;
	rank: ClanMemberRank;
}

export interface DatabaseColor {
	alias: string;
	name: string;
	code: number;
	palette: number;
}

export interface DatabaseUserMoney {
	user_id: Snowflake;
	money: number;
	last_daily: string;
}

export enum TriggerType {
	CONTAINS = 1,
	EQUAL = 2,
	REGEX = 3,
	STARTS_WITH = 4,
	ENDS_WITH = 5,
}

export interface DatabaseCustomResponse {
	id: number;
	trigger: string;
	response: string;
	trigger_type: TriggerType;
}

export interface DatabaseGuildConfig {
	guild_id: Snowflake;
	language: Language;
	webhook_id?: Snowflake;
}

export interface DatabaseLevel {
	user_id: string;
	chat_xp: number;
	voice_xp: number;
}

export interface DatabaseMegaGems {
	user_id: Snowflake;
	gems: {
		[K: string]: number;
	};
}

export interface DatabaseMemberRoles {
	user_id: Snowflake;
	roles: Snowflake[];
}

export interface DatabaseMudaeWish {
	id: number;
	user_id: Snowflake;
	series: string;
	regex?: string;
}

export interface DatabasePalette {
	id: number;
	name: string;
}

export interface DatabasePlaylist {
	name: string;
	url: string;
	user_id: Snowflake;
	private: boolean;
}

export interface DatabasePokemon {
	national_id: number;
	shiny: boolean;
	variation_type: VariationType;
	variation: Variation;
	users: {
		[K: Snowflake]: {
			caught: number;
			favorite: boolean;
			nickname?: string;
		};
	};
}

export interface DatabasePokemonHunting {
	user_id: Snowflake;
	pokemon_id: number;
	hunt_count: number;
}

export interface DatabaseReminder {
	id: number;
	user_id: Snowflake;
	timestamp: string;
	content: string;
	repeat?: number;
	occurrences?: number;
}

export interface DatabaseTradeBlock {
	user_id: Snowflake;
	blocked_user_id: Snowflake;
}

export interface DatabaseUpgrades {
	user_id: Snowflake;
	catch_cooldown_reduction: number;
	new_pokemon_probability: number;
	legendary_ub_probability: number;
	mega_gem_probability: number;
	shiny_probability: number;
}
