import { Snowflake, Locale } from "discord.js";
import { VariationName, VariationTypeName } from "../structures/pokemons/Pokemon";

export enum CanvasOwnerType {
	EVERYONE = 1,
	GUILD = 2,
	CHANNEL = 3,
	USER = 4,
}

export interface DatabaseCanvas {
	id: number;
	name: string;
	size: number;
	data: string[][];
	owner_type: CanvasOwnerType;
	owner_id?: Snowflake;
	archived: boolean;
}

export interface DatabaseCanvasPalette {
	canvas_id: number;
	palette_id: number;
}

export interface DatabaseColor {
	id: number;
	alias: string;
	name: string;
	value: number;
	palette: number;
}

export interface DatabaseCooldown {
	command: string;
	user_id: Snowflake;
	expires_at: Date;
}

export interface DatabaseGuildConfig {
	guild_id: Snowflake;
	locale: Locale;
	jail_role_id?: Snowflake;
}

export enum ItemType {
	ITEM = 1,
	UPGRADE = 2,
}

export interface DatabaseItem {
	id: number;
	name: string;
	shop_id: number;
	type: number;
	base_price: number;
	price_increment?: number;
	max?: number;
}

export type DatabaseLocalizations = {
	name: string;
	default: string;
} & {
	[K in Locale]: string;
};

export interface DatabaseMegaStone {
	id: number;
	pokemon_id: number;
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

export interface DatabaseShop {
	id: number;
	name: string;
}

export interface DatabaseUser {
	id: Snowflake;
	afk_since: Date;
	afk_message: string;
	currency_money: number;
	currency_last_daily: Date;
	level_chat_xp: number;
	level_voice_xp: number;
	canvas_id: number;
}

export interface DatabaseUserItem {
	user_id: number;
	item_id: number;
	quantity: number;
}

export interface DatabaseUserPokemon {
	user_id: Snowflake;
	pokemon_id: number;
	shiny: boolean;
	variation_type: VariationTypeName;
	variation: VariationName;
	caught: number;
	favorite: boolean;
	nickname?: string;
}

export interface DatabaseUserRole {
	user_id: Snowflake;
	role_id: Snowflake;
}

export interface DatabaseUserMegaStone {
	user_id: Snowflake;
	mega_stone_id: number;
}
