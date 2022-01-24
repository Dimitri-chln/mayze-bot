import Pokemon from "../../types/pokemon/Pokemon";
import { Language } from "../../types/structures/Translations";



function _evolutionLine(pokemon: Pokemon, origin = true): EvolutionLine {
	if (origin && pokemon.evolutionFrom()) return _evolutionLine(pokemon.evolutionFrom());

	return {
		pokemon: pokemon,
		evolutions: pokemon.evolutions().map(evolution => _evolutionLine(evolution, false))
	}
}



function _flatEvolutionLine(pokemon: Pokemon, origin?: EvolutionLine): Pokemon[] {
	const evoLine = origin ?? _evolutionLine(pokemon);

	const flatEvoLine = [
		evoLine.pokemon
	];

	for (const evolution of evoLine.evolutions)
		flatEvoLine.push(
			..._flatEvolutionLine(evolution.pokemon, evolution)
		);

	return flatEvoLine;
}



function _stringEvolutionLine(pokemon: Pokemon, language: Language, origin?: EvolutionLine, depth = 0) {
	const evoLine = origin ?? _evolutionLine(pokemon);

	let stringEvoLine = `${"\t".repeat(depth)}${evoLine.pokemon.names[language] ?? evoLine.pokemon.names.en}\n`;

	for (const evolution of evoLine.evolutions) {
		stringEvoLine += _stringEvolutionLine(evolution.pokemon, language, evolution, depth + 1);
	}

	return stringEvoLine;
}



export function evolutionLine(pokemon: Pokemon) {
	return _evolutionLine(pokemon);
}

export function flatEvolutionLine(pokemon: Pokemon) {
	return _flatEvolutionLine(pokemon);
}

export function stringEvolutionLine(pokemon: Pokemon, language: Language) {
	return _stringEvolutionLine(pokemon, language);
}

export interface EvolutionLine {
	pokemon: Pokemon;
	evolutions: EvolutionLine[];
}