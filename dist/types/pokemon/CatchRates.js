"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Pokedex_1 = __importDefault(require("./Pokedex"));
var CatchRates = /** @class */ (function () {
    function CatchRates(pokemonList, upgrades) {
        var e_1, _a;
        var data = [];
        try {
            for (var _b = __values(Pokedex_1.default.pokemons), _c = _b.next(); !_c.done; _c = _b.next()) {
                var pokemon = _c.value;
                var probability = pokemon.catchRate;
                if (pokemon.legendary || pokemon.ultraBeast)
                    probability *= 1 + (upgrades.legendary_ultrabeast_tier * 2) / 100;
                if (!pokemonList.has(pokemon))
                    probability *= 1 + (upgrades.new_pokemon_tier * 2) / 100;
                data.push(data.slice(-1)[0] + probability);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    CatchRates.prototype.randomPokemon = function () {
        var randomNumber = Math.random() * this.data.slice(-1)[0];
        for (var i = 0; i < this.data.length; i++) {
            if (randomNumber < this.data[i])
                return Pokedex_1.default.findById(i + 1);
        }
    };
    return CatchRates;
}());
exports.default = CatchRates;
