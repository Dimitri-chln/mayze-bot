import { Collection, Locale, LocalizationMap } from "discord.js";

import { PokemonLocalizationManager } from "../localizations/LocalizationManager";
import LocalizationItem from "../localizations/LocalizationItem";

import Pokemon, { PokemonData, PokemonVariation, VariationTypeName } from "./Pokemon";

export default class Pokedex {
	readonly pokemons: Collection<string, Pokemon>;
	readonly megaStones: Collection<string, LocalizationItem>;
	localizations: PokemonLocalizationManager;

	constructor(data: PokemonData[]) {
		this.pokemons = new Collection();
		this.megaStones = new Collection();

		// Add pokémons
		for (const pokemonData of data) {
			this.pokemons.set(pokemonData.name, new Pokemon(pokemonData, this));
		}

		// Add pokémon evolutions
		for (const pokemonData of data) {
			const pokemon = this.pokemons.get(pokemonData.name);
			pokemon.evolutionFrom = this.pokemons.get(pokemonData.evolution_from);
			pokemon.evolutions = pokemonData.evolutions.map((evolution) => this.pokemons.get(evolution));
		}

		// Add pokémon evolution lines
		this.pokemons.forEach((pokemon) => {
			pokemon.evolutionLine = evolutionLine(pokemon);
			pokemon.flatEvolutionLine = flatEvolutionLine(pokemon);
		});
	}

	async localize() {
		const pokemonLocalizations = new PokemonLocalizationManager();
		await pokemonLocalizations.fetch();

		// Localize pokémons
		await Promise.all(this.pokemons.map((pokemon) => pokemon.localize(pokemonLocalizations)));

		// Localize mega stones
		for (const megaStone of Object.values(pokemonLocalizations.strings.mega_stones)) {
			this.megaStones.set(megaStone.default, megaStone);
		}

		// Localize string evolution lines
		this.pokemons.forEach((pokemon) => {
			pokemon.stringEvolutionLine = Object.values(Locale).reduce((localizations, locale) => {
				localizations[locale] = stringEvolutionLine(pokemon, locale);
				return localizations;
			}, {} as LocalizationMap);
		});
	}

	findByName(name: string, locale: Locale) {
		return this.pokemons.find(
			(pokemon) =>
				pokemon.name.default.toLowerCase() === name.toLowerCase() ||
				pokemon.name.localization.get(locale).toLowerCase() === name.toLowerCase(),
		);
	}

	findById(id: number) {
		return this.pokemons.find((pokemon) => pokemon.nationalId === id);
	}

	findByNameWithVariation(name: string, locale: Locale) {
		const shiny = /\bshiny\b/i.test(name);

		name = name
			.replace(/\bshiny\b/i, "")
			.replace(/ +/g, " ")
			.trim();

		let pokemon = this.findByName(name, locale);
		let pokemonVariation: PokemonVariation;

		if (!pokemon) {
			pokemon = this.pokemons.find((pkm) =>
				pkm.variations.some(
					(variation) =>
						variation.name.default.toLowerCase() === name.toLowerCase() ||
						variation.name.localization.get(locale).toLowerCase() === name.toLowerCase(),
				),
			);

			if (pokemon)
				pokemonVariation = pokemon.variations.find(
					(variation) =>
						variation.name.default.toLowerCase() === name.toLowerCase() ||
						variation.name.localization.get(locale).toLowerCase() === name.toLowerCase(),
				);
		}

		if (!pokemon) return;

		return {
			pokemon: pokemon,
			shiny: shiny,
			pokemonVariation: pokemonVariation,
		};
	}

	get pokemonsWithMegaEvolution() {
		return this.pokemons.filter((pokemon) =>
			pokemon.variations.some((variation) => variation.variationType === VariationTypeName.mega),
		);
	}

	get pokemonsWithAlolanVariation() {
		return this.pokemons.filter((pokemon) =>
			pokemon.variations.some((variation) => variation.variationType === VariationTypeName.alola),
		);
	}

	get pokemonsWithGalarianVariation() {
		return this.pokemons.filter((pokemon) =>
			pokemon.variations.some((variation) => variation.variationType === VariationTypeName.galar),
		);
	}
}

function evolutionLine(pokemon: Pokemon, origin = true): EvolutionLine {
	if (origin && pokemon.evolutionFrom) return evolutionLine(pokemon.evolutionFrom);

	return {
		pokemon: pokemon,
		evolutions: pokemon.evolutions.map((evolution) => evolutionLine(evolution, false)),
	};
}

function flatEvolutionLine(pokemon: Pokemon, origin?: EvolutionLine): Pokemon[] {
	const evoLine = origin ?? evolutionLine(pokemon);
	const flatEvoLine = [evoLine.pokemon];

	for (const evolution of evoLine.evolutions) {
		flatEvoLine.push(...flatEvolutionLine(evolution.pokemon, evolution));
	}

	return flatEvoLine;
}

function stringEvolutionLine(pokemon: Pokemon, locale: Locale, origin?: EvolutionLine, depth = 0): string {
	const evoLine = origin ?? evolutionLine(pokemon);
	let stringEvoLine = `${"\t".repeat(depth)}${evoLine.pokemon.name.localization.get(locale)}\n`;

	for (const evolution of evoLine.evolutions) {
		stringEvoLine += stringEvolutionLine(evolution.pokemon, locale, evolution, depth + 1);
	}

	return stringEvoLine;
}

export interface PokemonWithVariation {
	pokemon: Pokemon;
	shiny: boolean;
	variation: PokemonVariation;
}

export interface EvolutionLine {
	pokemon: Pokemon;
	evolutions: EvolutionLine[];
}
