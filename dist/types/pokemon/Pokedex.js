"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pokemonEvolutionLine_1 = require("../../utils/pokemon/pokemonEvolutionLine");
var pokemonInfo_1 = require("../../utils/pokemon/pokemonInfo");
var discord_js_1 = require("discord.js");
var Pokedex = /** @class */ (function () {
    function Pokedex() {
    }
    Pokedex.findById = function (id) {
        return this.pokemons.find(function (pokemon) {
            return pokemon.nationalId === id;
        });
    };
    Pokedex.findByName = function (name) {
        return this.pokemons.find(function (pokemon) {
            return Object.values(pokemon.names).some(function (n) { return n.toLowerCase() === (name === null || name === void 0 ? void 0 : name.toLowerCase()); });
        });
    };
    Pokedex.findByNameWithVariation = function (name) {
        var _b;
        var shiny = /\bshiny\b/i.test(name);
        name = name.replace(/\bshiny\b/i, "").trim();
        var pokemon = this.findByName(name);
        var variation;
        // Mega evolutions
        if (!pokemon) {
            pokemon = this.pokemons.find(function (pkm) {
                return pkm.megaEvolutions.some(function (megaEvolution) {
                    return Object.values(megaEvolution.names).some(function (n) { return n.toLowerCase() === (name === null || name === void 0 ? void 0 : name.toLowerCase()); });
                });
            });
            if (pokemon)
                variation = pokemon.megaEvolutions.find(function (megaEvolution) {
                    return Object.values(megaEvolution.names).some(function (n) { return n.toLowerCase() === (name === null || name === void 0 ? void 0 : name.toLowerCase()); });
                });
        }
        // Variations
        if (!pokemon) {
            pokemon = this.pokemons.find(function (pkm) {
                return pkm.variations.some(function (variation) {
                    return Object.values(variation.names).some(function (n) { return n.toLowerCase() === (name === null || name === void 0 ? void 0 : name.toLowerCase()); });
                });
            });
            if (pokemon)
                variation = pokemon.variations.find(function (variation) {
                    return Object.values(variation.names).some(function (n) { return n.toLowerCase() === (name === null || name === void 0 ? void 0 : name.toLowerCase()); });
                });
        }
        if (!pokemon)
            return;
        return {
            pokemon: pokemon,
            shiny: shiny,
            variationType: (_b = variation === null || variation === void 0 ? void 0 : variation.suffix) !== null && _b !== void 0 ? _b : "default",
            variation: variation
        };
    };
    var _a;
    _a = Pokedex;
    Pokedex.pokemons = require("../../assets/pokemons.json")
        .map(function (rawPokemon) {
        var pokemon = {
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
                speed: rawPokemon.base_stats.speed
            },
            megaEvolutions: rawPokemon.mega_evolutions.map(function (megaEvolution) {
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
                        speed: megaEvolution.base_stats.speed
                    }
                };
            }),
            variations: rawPokemon.variations,
            legendary: rawPokemon.legendary,
            ultraBeast: rawPokemon.ultra_beast,
            evolutionFrom: function () { return _a.findByName(rawPokemon.evolution_from); },
            evolutions: function () { return rawPokemon.evolutions.map(function (evolution) { return _a.findByName(evolution); }); },
            evolutionLine: function () { return (0, pokemonEvolutionLine_1.evolutionLine)(_a.findById(rawPokemon.national_id)); },
            flatEvolutionLine: function () { return (0, pokemonEvolutionLine_1.flatEvolutionLine)(_a.findById(rawPokemon.national_id)); },
            stringEvolutionLine: function (language) { return (0, pokemonEvolutionLine_1.stringEvolutionLine)(_a.findById(rawPokemon.national_id), language); },
            formatName: function (shiny, variation, language, format) { return (0, pokemonInfo_1.formatName)(_a.findById(rawPokemon.national_id), shiny, variation, language, format); },
            image: function (shiny, variation) { return (0, pokemonInfo_1.pokemonImage)(_a.findById(rawPokemon.national_id), shiny, variation); }
        };
        return pokemon;
    });
    Pokedex.megaEvolvablePokemons = new discord_js_1.Collection(_a.pokemons
        .filter(function (pokemon) { return pokemon.megaEvolutions.length; })
        .map(function (pokemon) { return [pokemon.nationalId, pokemon]; }));
    Pokedex.alolaPokemons = new discord_js_1.Collection(_a.pokemons
        .filter(function (pokemon) { return pokemon.variations.some(function (variation) { return variation.suffix === "alola"; }); })
        .map(function (pokemon) { return [pokemon.nationalId, pokemon]; }));
    Pokedex.catchRates = _a.pokemons
        .map(function (pokemon, i, dex) {
        return pokemon.catchRate + dex.slice(0, i).reduce(function (sum, p) { return sum + p.catchRate; }, 0);
    });
    return Pokedex;
}());
exports.default = Pokedex;
