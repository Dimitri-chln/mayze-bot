import { EvolutionLine } from "../../utils/pokemon/pokemonEvolutionLine";
import { FormatType, Variation, VariationType } from "../../utils/pokemon/pokemonInfo";
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
	generation: number;
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
	generation: number;
	evolutionFrom(): Pokemon;
	evolutions(): Pokemon[];
	evolutionLine(): EvolutionLine;
	flatEvolutionLine(): Pokemon[];
	stringEvolutionLine(language: Language): string;
	formatName(
		language: Language,
		shiny?: boolean,
		variationType?: VariationType,
		variation?: Variation,
		format?: FormatType,
	): string;
	image(shiny?: boolean, variationType?: VariationType, variation?: Variation): string;
}

interface RawPokemonNames {
	en: string;
	fr: string;
}

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

interface RawPokemonVariation {
	variation_type: "alola" | "galar";
	variation: "default";
	names: RawPokemonNames;
	types: RawPokemonType[];
}

interface RawMegaEvolution {
	variation_type: "mega";
	variation: "megax" | "megay" | "primal";
	names: RawPokemonNames;
	types: RawPokemonType[];
	mega_stone: string;
	height: number;
	weight: number;
	base_stats: RawBaseStats;
}

export interface PokemonNames {
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

export interface BaseStats {
	hp: number;
	atk: number;
	def: number;
	spAtk: number;
	spDef: number;
	speed: number;
}

export interface PokemonVariation {
	variationType: "alola" | "galar";
	variation: "default";
	names: PokemonNames;
	types: PokemonType[];
}

export interface MegaEvolution {
	variationType: "mega";
	variation: "default" | "megax" | "megay" | "primal";
	names: PokemonNames;
	types: PokemonType[];
	megaStone: string;
	heightEu: `${number} m`;
	heightUs: `${number}'${string}"`;
	weightEu: `${number} kg`;
	weightUs: `${number} lbs.`;
	baseStats: BaseStats;
}
