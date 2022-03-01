import { Language } from "../structures/Translations";

import {
	evolutionLine,
	flatEvolutionLine,
	stringEvolutionLine,
} from "../../utils/pokemon/pokemonEvolutionLine";
import Pokemon, {
	MegaEvolution,
	PokemonVariation,
	RawPokemon,
} from "./Pokemon";
import {
	formatName,
	FormatType,
	pokemonImage,
	Variation,
	VariationType,
} from "../../utils/pokemon/pokemonInfo";

import { Collection } from "discord.js";

export default class Pokedex {
	static pokemons: Pokemon[] = require("../../assets/pokemons.json").map(
		(rawPokemon: RawPokemon) => {
			const pokemon: Pokemon = {
				names: rawPokemon.names,
				nationalId: rawPokemon.national_id,
				types: rawPokemon.types,
				catchRate: rawPokemon.catch_rate,
				heightEu: `${rawPokemon.height} m`,
				heightUs: `${Math.floor(rawPokemon.height * 3.281)}'${Math.round(
					(rawPokemon.height * 3.281) % 12,
				)
					.toString()
					.padStart(2, "0")}"`,
				weightEu: `${rawPokemon.weight / 1000} kg`,
				weightUs: `${rawPokemon.weight / 4536} lbs.`,
				color: rawPokemon.color,
				baseStats: {
					hp: rawPokemon.base_stats.hp,
					atk: rawPokemon.base_stats.atk,
					def: rawPokemon.base_stats.def,
					spAtk: rawPokemon.base_stats.sp_atk,
					spDef: rawPokemon.base_stats.sp_def,
					speed: rawPokemon.base_stats.speed,
				},
				megaEvolutions: rawPokemon.mega_evolutions.map(
					(megaEvolution): MegaEvolution => {
						return {
							variationType: megaEvolution.variation_type,
							variation: megaEvolution.variation,
							names: megaEvolution.names,
							types: megaEvolution.types,
							megaStone: megaEvolution.mega_stone,
							heightEu: `${megaEvolution.height} m`,
							heightUs: `${Math.floor(
								megaEvolution.height * 3.281,
							)}'${Math.round((rawPokemon.height * 3.281) % 12)
								.toString()
								.padStart(2, "0")}"`,
							weightEu: `${megaEvolution.weight / 1000} kg`,
							weightUs: `${megaEvolution.weight / 4536} lbs.`,
							baseStats: {
								hp: megaEvolution.base_stats.hp,
								atk: megaEvolution.base_stats.atk,
								def: megaEvolution.base_stats.def,
								spAtk: megaEvolution.base_stats.sp_atk,
								spDef: megaEvolution.base_stats.sp_def,
								speed: megaEvolution.base_stats.speed,
							},
						};
					},
				),
				variations: rawPokemon.variations.map(
					(rawPokemonVariation): PokemonVariation => {
						return {
							variationType: rawPokemonVariation.variation_type,
							variation: rawPokemonVariation.variation,
							names: rawPokemonVariation.names,
							types: rawPokemonVariation.types,
						};
					},
				),
				legendary: rawPokemon.legendary,
				ultraBeast: rawPokemon.ultra_beast,
				generation: rawPokemon.generation,
				evolutionFrom: () => this.findByName(rawPokemon.evolution_from),
				evolutions: () =>
					rawPokemon.evolutions.map((evolution) => this.findByName(evolution)),
				evolutionLine: () =>
					evolutionLine(this.findById(rawPokemon.national_id)),
				flatEvolutionLine: () =>
					flatEvolutionLine(this.findById(rawPokemon.national_id)),
				stringEvolutionLine: (language: Language) =>
					stringEvolutionLine(this.findById(rawPokemon.national_id), language),
				formatName: (
					language: Language,
					shiny?: boolean,
					variationType?: VariationType,
					variation?: Variation,
					format?: FormatType,
				) =>
					formatName(
						this.findById(rawPokemon.national_id),
						shiny,
						variationType,
						variation,
						language,
						format,
					),
				image: (
					shiny?: boolean,
					variationType?: VariationType,
					variation?: Variation,
				) =>
					pokemonImage(
						this.findById(rawPokemon.national_id),
						shiny,
						variationType,
						variation,
					),
			};

			return pokemon;
		},
	);

	static megaEvolvablePokemons: Collection<number, Pokemon> = new Collection(
		this.pokemons
			.filter((pokemon) => pokemon.megaEvolutions.length)
			.map((pokemon) => [pokemon.nationalId, pokemon]),
	);

	static alolaPokemons: Collection<number, Pokemon> = new Collection(
		this.pokemons
			.filter((pokemon) =>
				pokemon.variations.some(
					(variation) => variation.variationType === "alola",
				),
			)
			.map((pokemon) => [pokemon.nationalId, pokemon]),
	);

	static galarPokemons: Collection<number, Pokemon> = new Collection(
		this.pokemons
			.filter((pokemon) =>
				pokemon.variations.some(
					(variation) => variation.variationType === "galar",
				),
			)
			.map((pokemon) => [pokemon.nationalId, pokemon]),
	);

	static findById(id: number) {
		return this.pokemons.find((pokemon) => pokemon.nationalId === id);
	}

	static findByName(name: string) {
		return this.pokemons.find((pokemon) =>
			Object.values(pokemon.names).some(
				(n) => n.toLowerCase() === name?.toLowerCase(),
			),
		);
	}

	static findByNameWithVariation(name: string): PokemonWithVariation {
		const shiny = /\bshiny\b/i.test(name);

		name = name
			.replace(/\bshiny\b/i, "")
			.replace(/ +/g, " ")
			.trim();

		let pokemon = this.findByName(name);
		let pokemonVariation: PokemonVariation | MegaEvolution;

		// Mega evolutions
		if (!pokemon) {
			pokemon = this.pokemons.find((pkm) =>
				pkm.megaEvolutions.some((megaEvolution) =>
					Object.values(megaEvolution.names).some(
						(n) => n.toLowerCase() === name?.toLowerCase(),
					),
				),
			);

			if (pokemon)
				pokemonVariation = pokemon.megaEvolutions.find((megaEvolution) =>
					Object.values(megaEvolution.names).some(
						(n) => n.toLowerCase() === name?.toLowerCase(),
					),
				);
		}

		// Variations
		if (!pokemon) {
			pokemon = this.pokemons.find((pkm) =>
				pkm.variations.some((variation) =>
					Object.values(variation.names).some(
						(n) => n.toLowerCase() === name?.toLowerCase(),
					),
				),
			);

			if (pokemon)
				pokemonVariation = pokemon.variations.find((variation) =>
					Object.values(variation.names).some(
						(n) => n.toLowerCase() === name?.toLowerCase(),
					),
				);
		}

		if (!pokemon) return;

		return {
			pokemon: pokemon,
			shiny: shiny,
			pokemonVariation: pokemonVariation,
		};
	}

	static defaultCatchRates = this.pokemons.map(
		(pokemon, i, dex) =>
			pokemon.catchRate +
			dex.slice(0, i).reduce((sum, p) => sum + p.catchRate, 0),
	);
}

interface PokemonWithVariation {
	pokemon: Pokemon;
	shiny: boolean;
	pokemonVariation: PokemonVariation | MegaEvolution;
}
