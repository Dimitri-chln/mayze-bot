import { Snowflake } from "discord.js";
import { EvolutionLine } from "../../utils/pokemon/pokemonEvolutionLine";
import { FormatType, VariationType } from "../../utils/pokemon/pokemonInfo";
import { Language } from "../structures/Translations";

export interface RawPokemon {
	names: RawPokemonNames;
	national_id: number;
	types: RawPokemonType[];
	catch_rate: number;
	height: number;
	weight: number;
	color: string;
	base_stats: RawBaseStats;
	evolution_from: string;
	evolutions: string[];
	mega_evolutions: RawMegaEvolution[];
	variations: RawPokemonVariation[];
	legendary: boolean;
	ultra_beast: boolean;
}

export default interface Pokemon {
	names: PokemonNames;
	nationalId: number;
	types: PokemonType[];
	catchRate: number;
	heightEu: `${number} m`;
	heightUs: `${number}'${string}"`;
	weightEu: `${number} kg`;
	weightUs: `${number} lbs.`;
	color: string;
	baseStats: BaseStats;
	megaEvolutions: MegaEvolution[];
	variations: PokemonVariation[];
	legendary: boolean;
	ultraBeast: boolean;
	evolutionFrom(): Pokemon;
	evolutions(): Pokemon[];
	evolutionLine(): EvolutionLine;
	flatEvolutionLine(): Pokemon[];
	stringEvolutionLine(language: Language): string;
	formatName(
		language: Language,
		shiny?: boolean,
		variation?: VariationType,
		format?: FormatType,
	): string;
	image(shiny: boolean, variation: VariationType): string;
}

type RawPokemonNames = {
	en: string;
	fr: string;
};

type RawPokemonType =
	| "Normal"
	| "Fighting"
	| "Flying"
	| "Poison"
	| "Ground"
	| "Rock"
	| "Bug"
	| "Ghost"
	| "Steel"
	| "Fire"
	| "Water"
	| "Grass"
	| "Electric"
	| "Psychic"
	| "Ice"
	| "Dragon"
	| "Dark"
	| "Fairy";

interface RawBaseStats {
	hp: number;
	atk: number;
	def: number;
	sp_atk: number;
	sp_def: number;
	speed: number;
}

interface RawMegaEvolution {
	suffix: "mega" | "megax" | "megay" | "primal";
	names: RawPokemonNames;
	types: RawPokemonType[];
	mega_stone: string;
	height_eu: `${number} m`;
	height_us: `${number}'${number}"`;
	weight_eu: `${number} kg`;
	weight_us: `${number} lbs.`;
	base_stats: RawBaseStats;
}

interface RawPokemonVariation {
	suffix: "alola";
	names: RawPokemonNames;
	types: RawPokemonType[];
}

interface PokemonNames {
	en: string;
	fr: string;
}

export type PokemonType =
	| "Normal"
	| "Fighting"
	| "Flying"
	| "Poison"
	| "Ground"
	| "Rock"
	| "Bug"
	| "Ghost"
	| "Steel"
	| "Fire"
	| "Water"
	| "Grass"
	| "Electric"
	| "Psychic"
	| "Ice"
	| "Dragon"
	| "Dark"
	| "Fairy";

interface BaseStats {
	hp: number;
	atk: number;
	def: number;
	spAtk: number;
	spDef: number;
	speed: number;
}

export interface MegaEvolution {
	suffix: "mega" | "megax" | "megay" | "primal";
	names: PokemonNames;
	types: PokemonType[];
	megaStone: string;
	heightEu: `${number} m`;
	heightUs: `${number}'${number}"`;
	weightEu: `${number} kg`;
	weightUs: `${number} lbs.`;
	baseStats: BaseStats;
}

export interface PokemonVariation {
	suffix: "alola";
	names: PokemonNames;
	types: PokemonType[];
}
