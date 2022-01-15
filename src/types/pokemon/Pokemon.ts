import { EvolutionLine } from "../../utils/pokemon/pokemonEvolutionLine";
import { FormatType, VariationType } from "../../utils/pokemon/pokemonInfo";
import { Language } from "../structures/LanguageStrings";



export interface RawPokemon {
	names: RawPokemonNames;
	national_id: number;
	types: RawPokemonType[];
	abilities: RawPokemonAbility[];
	gender_ratios?: RawGenderRatios;
	catch_rate: number;
	height_eu: `${number} m`;
	height_us: `${number}'${number}"`;
	weight_eu: `${number} kg`;
	weight_us: `${number} lbs.`;
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
	abilities: PokemonAbility[];
	genderRatios?: GenderRatios;
	catchRate: number;
	heightEu: `${number} m`;
	heightUs: `${number}'${number}"`;
	weightEu: `${number} kg`;
	weightUs: `${number} lbs.`;
	color: string;
	baseStats: BaseStats;
	megaEvolutions?: MegaEvolution[];
	variations?: PokemonVariation[];
	legendary: boolean;
	ultraBeast: boolean;
	evolutionFrom?(): Pokemon;
	evolutions?(): Pokemon[];
	evolutionLine(): EvolutionLine;
	flatEvolutionLine(): Pokemon[];
	stringEvolutionLine(language: Language): string;
	formatName(shiny: boolean, variation: VariationType, language: Language, format?: FormatType): string;
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
	| "Fairy"

interface RawPokemonAbility {
	name: string;
	hidden?: boolean;
}

interface RawGenderRatios {
	male: number;
	female: number;
}

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
	ability: string;
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
	abilities: RawPokemonAbility[];
}



type PokemonNames = {
	en: string;
	fr: string;
};

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
	| "Fairy"

interface PokemonAbility {
	name: string;
	hidden?: boolean;
}

interface GenderRatios {
	male: number;
	female: number;
}

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
	ability: string;
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
	abilities: PokemonAbility[];
}