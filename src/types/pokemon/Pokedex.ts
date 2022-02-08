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
import { Language } from "../structures/Translations";
import {
	formatName,
	FormatType,
	pokemonImage,
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
				abilities: rawPokemon.abilities,
				genderRatios: rawPokemon.gender_ratios,
				catchRate: rawPokemon.catch_rate,
				heightEu: rawPokemon.height_eu,
				heightUs: rawPokemon.height_us,
				weightEu: rawPokemon.weight_eu,
				weightUs: rawPokemon.weight_us,
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
					(megaEvolution) => {
						return {
							suffix: megaEvolution.suffix,
							names: megaEvolution.names,
							types: megaEvolution.types,
							ability: megaEvolution.ability,
							megaStone: megaEvolution.mega_stone,
							heightEu: megaEvolution.height_eu,
							heightUs: megaEvolution.height_us,
							weightEu: megaEvolution.weight_eu,
							weightUs: megaEvolution.weight_us,
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
				variations: rawPokemon.variations,
				legendary: rawPokemon.legendary,
				ultraBeast: rawPokemon.ultra_beast,
				evolutionFrom: () => this.findByName(rawPokemon.evolution_from),
				evolutions: () =>
					rawPokemon.evolutions.map((evolution) =>
						this.findByName(evolution),
					),
				evolutionLine: () =>
					evolutionLine(this.findById(rawPokemon.national_id)),
				flatEvolutionLine: () =>
					flatEvolutionLine(this.findById(rawPokemon.national_id)),
				stringEvolutionLine: (language: Language) =>
					stringEvolutionLine(
						this.findById(rawPokemon.national_id),
						language,
					),
				formatName: (
					shiny: boolean,
					variation: VariationType,
					language: Language,
					format?: FormatType,
				) =>
					formatName(
						this.findById(rawPokemon.national_id),
						shiny,
						variation,
						language,
						format,
					),
				image: (shiny: boolean, variation: VariationType) =>
					pokemonImage(
						this.findById(rawPokemon.national_id),
						shiny,
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
					(variation) => variation.suffix === "alola",
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

		name = name.replace(/\bshiny\b/i, "").trim();

		let pokemon = this.findByName(name);
		let variation: MegaEvolution | PokemonVariation;

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
				variation = pokemon.megaEvolutions.find((megaEvolution) =>
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
				variation = pokemon.variations.find((variation) =>
					Object.values(variation.names).some(
						(n) => n.toLowerCase() === name?.toLowerCase(),
					),
				);
		}

		if (!pokemon) return;

		return {
			pokemon: pokemon,
			shiny: shiny,
			variationType: variation?.suffix ?? "default",
			variation: variation,
		};
	}

	static catchRates = this.pokemons.map(
		(pokemon, i, dex) =>
			pokemon.catchRate +
			dex.slice(0, i).reduce((sum, p) => sum + p.catchRate, 0),
	);
}

interface PokemonWithVariation {
	pokemon: Pokemon;
	shiny: boolean;
	variationType: VariationType;
	variation: MegaEvolution | PokemonVariation;
}
