import { Locale, LocalizationMap } from "discord.js";

import { PokemonLocalizationManager } from "../localizations/LocalizationManager";
import LocalizationItem from "../localizations/LocalizationItem";

import Pokedex, { EvolutionLine } from "./Pokedex";
import pokemonImageNumbers from "../../assets/pokemon-image-numbers.json";

export default class Pokemon {
	readonly pokedex: Pokedex;
	readonly nationalId: number;
	readonly generation: number;
	private readonly _name: string;
	name: LocalizationItem;
	private readonly _types: PokemonTypeName[];
	types: PokemonType[];
	readonly catchRate: number;
	readonly legendary: boolean;
	readonly ultraBeast: boolean;
	private readonly _variations: PokemonVariationData[];
	variations: PokemonVariation[];
	evolutionFrom: Pokemon;
	evolutions: Pokemon[];
	evolutionLine: EvolutionLine;
	flatEvolutionLine: Pokemon[];
	stringEvolutionLine: LocalizationMap;

	constructor(data: PokemonData, pokedex: Pokedex) {
		this.pokedex = pokedex;
		this.nationalId = data.national_id;
		this.generation = data.generation;
		this._name = data.name;
		this._types = data.types.map((type) => PokemonTypeName[type]);
		this.catchRate = data.catch_rate;
		this.legendary = data.legendary;
		this.ultraBeast = data.ultra_beast;
		this._variations = data.variations;
	}

	async localize(pokemonLocalizations: PokemonLocalizationManager) {
		const databaseName = this._name
			.toLowerCase()
			.replace(/[^\w\s]+/g, "")
			.replace(/\s+/g, "_");

		try {
			this.name = pokemonLocalizations.strings.pokemons[databaseName].name;
		} catch (err) {
			console.error(`Failed localizing pokémon ${this._name} (${databaseName})`);
		}

		this.types = this._types.map((type) => ({
			type: type,
			name: pokemonLocalizations.strings.types[PokemonTypeName[type].toLowerCase()],
		}));

		this.variations = this._variations.map((variation) => ({
			variationType: VariationTypeName[variation.variation_type],
			variation: VariationName[variation.variation],
			name: pokemonLocalizations.strings.pokemons[databaseName].variations[variation.variation_type][
				variation.variation
			].name,
			types: variation.types.map((type) => ({
				type: PokemonTypeName[type],
				name: pokemonLocalizations.strings.types[type.toLowerCase()],
			})),
			megaStone: variation.mega_stone
				? pokemonLocalizations.strings.mega_stones[variation.mega_stone.toLowerCase().replace(/\s+/g, "-")]
				: undefined,
		}));
	}

	formatName(
		format: NameFormat = NameFormat.FULL,
		shiny: boolean = false,
		variationType: VariationTypeName = VariationTypeName.default,
		variation: VariationName = VariationName.default,
		locale: Locale,
	) {
		let name = "";
		let badges = "";

		if (shiny) badges += "⭐";
		if (this.legendary) badges += "🎖️";
		if (this.ultraBeast) badges += "🎗️";

		if (variationType === VariationTypeName.default) {
			name = this.name.localization.get(locale);
		} else {
			const pokemonVariation = this.variations.find(
				(v) => v.variationType === variationType && v.variation === variation,
			);

			if (pokemonVariation) name = pokemonVariation.name.localization.get(locale);
			else throw new Error("InvalidVariation");
		}

		switch (format) {
			case NameFormat.FULL:
				return `${badges} ${name}`.trim();
			case NameFormat.BADGE:
				return badges;
			case NameFormat.RAW:
				return name;
		}
	}

	image(
		shiny: boolean = false,
		variationType: VariationTypeName = VariationTypeName.default,
		variation: VariationName = VariationName.default,
	) {
		const url = (n: number) => `https://assets.poketwo.net/${shiny ? "shiny" : "images"}/${n}.png`;

		if (variationType === VariationTypeName.default) return url(this.nationalId);
		else return url(pokemonImageNumbers[VariationTypeName[variationType]][VariationName[variation]][this.nationalId]);
	}
}

export enum PokemonTypeName {
	"Grass" = 1,
	"Poison",
	"Fire",
	"Flying",
	"Water",
	"Bug",
	"Normal",
	"Electric",
	"Ground",
	"Fairy",
	"Fighting",
	"Psychic",
	"Rock",
	"Steel",
	"Ice",
	"Ghost",
	"Dragon",
	"Dark",
}

export interface PokemonType {
	type: PokemonTypeName;
	name: LocalizationItem;
}

export enum VariationTypeName {
	"default" = 1,
	"mega",
	"alola",
	"galar",
}

export enum VariationName {
	"default" = 1,
	"megax",
	"megay",
	"primal",
}

export interface PokemonVariation {
	variationType: VariationTypeName;
	variation: VariationName;
	name: LocalizationItem;
	types: PokemonType[];
	megaStone?: LocalizationItem;
}

export enum NameFormat {
	FULL,
	BADGE,
	RAW,
}

export interface PokemonVariationData {
	variation_type: keyof typeof VariationTypeName;
	variation: keyof typeof VariationName;
	types: (keyof typeof PokemonTypeName)[];
	mega_stone?: string;
}

export interface PokemonData {
	national_id: number;
	generation: number;
	name: string;
	types: (keyof typeof PokemonTypeName)[];
	catch_rate: number;
	legendary: boolean;
	ultra_beast: boolean;
	evolution_from: string;
	evolutions: string[];
	variations: PokemonVariationData[];
}
