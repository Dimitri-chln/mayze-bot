const pokedex = require("oakdex-pokedex");

/**
 * @typedef {object} EvolutionLine
 * @property {pokedex.Pokemon} pokemon
 * @property {EvolutionLine[]} evolutions
 */

/**
 * @param {pokedex.Pokemon | string} pokemon 
 * @param {boolean} origin
 * @returns {EvolutionLine}
 */
function getEvolutionLine(pokemon, origin = true) {
	if (typeof pokemon === "string") pokemon = pokedex.findPokemon(pokemon);
	if (!pokemon) return;

	if (pokemon.evolution_from && origin) return getEvolutionLine(pokemon.evolution_from);

	const evolutionLine = {
		pokemon,
		evolutions: []
	};

	for (const evolution of pokemon.evolutions) {
		evolutionLine.evolutions.push(getEvolutionLine(evolution.to, false))
	}

	return evolutionLine;
}

/**
 * @param {pokedex.Pokemon | string} pokemon 
 * @param {?EvolutionLine} origin 
 * @returns {pokedex.Pokemon[]}
 */
function getFlatEvolutionLine(pokemon, origin = null) {
	const evolutionLine = origin ?? getEvolutionLine(pokemon);

	const flatEvolutionLine = [
		evolutionLine.pokemon
	];

	for (const evolution of evolutionLine.evolutions) {
		flatEvolutionLine.push(...getFlatEvolutionLine(evolution.pokemon, evolution));
	}

	return flatEvolutionLine;
}

/**
 * @param {pokedex.Pokemon | string} pokemon 
 * @param {string} languageCode 
 * @param {?EvolutionLine} origin 
 * @param {number} depth 
 * @returns {string}
 */
function getStringEvolutionLine(pokemon, languageCode, origin = null, depth = 0) {
	const evolutionLine = origin ?? getEvolutionLine(pokemon);

	let stringEvolutionLine = `${"\t".repeat(depth)}${evolutionLine.pokemon.names[languageCode] || evolutionLine.pokemon.names.en}\n`;

	for (const evolution of evolutionLine.evolutions) {
		stringEvolutionLine += getStringEvolutionLine(evolution.pokemon, languageCode, evolution, depth + 1);
	}

	return stringEvolutionLine;
}

module.exports = {
	getEvolutionLine,
	getFlatEvolutionLine,
	getStringEvolutionLine
};