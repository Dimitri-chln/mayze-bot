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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringEvolutionLine = exports.flatEvolutionLine = exports.evolutionLine = void 0;
function _evolutionLine(pokemon, origin) {
    if (origin === void 0) { origin = true; }
    if (origin && pokemon.evolutionFrom())
        return _evolutionLine(pokemon.evolutionFrom());
    return {
        pokemon: pokemon,
        evolutions: pokemon.evolutions().map(function (evolution) { return _evolutionLine(evolution, false); })
    };
}
function _flatEvolutionLine(pokemon, origin) {
    var e_1, _a;
    var evoLine = origin !== null && origin !== void 0 ? origin : _evolutionLine(pokemon);
    var flatEvoLine = [
        evoLine.pokemon
    ];
    try {
        for (var _b = __values(evoLine.evolutions), _c = _b.next(); !_c.done; _c = _b.next()) {
            var evolution = _c.value;
            flatEvoLine.push.apply(flatEvoLine, __spreadArray([], __read(_flatEvolutionLine(evolution.pokemon, evolution)), false));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return flatEvoLine;
}
function _stringEvolutionLine(pokemon, language, origin, depth) {
    var e_2, _a;
    var _b;
    if (depth === void 0) { depth = 0; }
    var evoLine = origin !== null && origin !== void 0 ? origin : _evolutionLine(pokemon);
    var stringEvoLine = "" + "\t".repeat(depth) + ((_b = evoLine.pokemon.names[language]) !== null && _b !== void 0 ? _b : evoLine.pokemon.names.en) + "\n";
    try {
        for (var _c = __values(evoLine.evolutions), _d = _c.next(); !_d.done; _d = _c.next()) {
            var evolution = _d.value;
            stringEvoLine += _stringEvolutionLine(evolution.pokemon, language, evolution, depth + 1);
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return stringEvoLine;
}
function evolutionLine(pokemon) {
    return _evolutionLine(pokemon);
}
exports.evolutionLine = evolutionLine;
function flatEvolutionLine(pokemon) {
    return _flatEvolutionLine(pokemon);
}
exports.flatEvolutionLine = flatEvolutionLine;
function stringEvolutionLine(pokemon, language) {
    return _stringEvolutionLine(pokemon, language);
}
exports.stringEvolutionLine = stringEvolutionLine;
