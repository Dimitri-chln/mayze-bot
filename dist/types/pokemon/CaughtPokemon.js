"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Pokedex_1 = __importDefault(require("./Pokedex"));
var CaughtPokemon = /** @class */ (function () {
    function CaughtPokemon(pokemonData, userId) {
        this.data = Pokedex_1.default.findById(pokemonData.pokedex_id);
        this.shiny = pokemonData.shiny;
        this.variation = pokemonData.variation;
        this.caught = pokemonData.users[userId].caught;
        this.favorite = pokemonData.users[userId].favorite;
        this.nickname = pokemonData.users[userId].nickname;
    }
    return CaughtPokemon;
}());
exports.default = CaughtPokemon;
