"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var CaughtPokemon_1 = __importDefault(require("./CaughtPokemon"));
var PokemonList = /** @class */ (function () {
    function PokemonList(pokemonList, userId) {
        this.pokemons = pokemonList.map(function (pokemonData) {
            return new CaughtPokemon_1.default(pokemonData, userId);
        });
    }
    PokemonList.prototype.has = function (pokemon, variation) {
        if (variation === void 0) { variation = "default"; }
        return this.pokemons.some(function (pkm) { return pkm.data.nationalId === pokemon.nationalId && pkm.variation === variation; });
    };
    return PokemonList;
}());
exports.default = PokemonList;
