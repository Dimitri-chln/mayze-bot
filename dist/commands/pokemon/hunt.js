"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = __importDefault(require("../../Util"));
var Pokedex_1 = __importDefault(require("../../types/pokemon/Pokedex"));
var command = {
    name: "hunt",
    description: {
        fr: "Chasse un pokémon en particulier",
        en: "Hunt a specific pokémon"
    },
    userPermissions: [],
    botPermissions: ["ADD_REACTIONS"],
    options: {
        fr: [
            {
                name: "pokemon",
                description: "Le pokémon à chasser (\"none\" pour réinitialiser)",
                type: "STRING",
                required: false
            }
        ],
        en: [
            {
                name: "pokemon",
                description: "The pokémon to hunt (\"none\" to reset)",
                type: "STRING",
                required: false
            }
        ]
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        var input, _a, huntedPokemonData, huntedPokemon, probability, pokemon, msg, filter, collected;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    input = interaction.options.getString("pokemon");
                    if (!!input) return [3 /*break*/, 2];
                    return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM pokemon_hunting WHERE user_id = $1", [interaction.user.id])];
                case 1:
                    _a = __read.apply(void 0, [(_e.sent()).rows, 1]), huntedPokemonData = _a[0];
                    if (huntedPokemonData) {
                        huntedPokemon = Pokedex_1.default.findById(huntedPokemonData.pokemon_id);
                        probability = huntedPokemonData.hunt_count < 100
                            ? (huntedPokemonData.hunt_count / 100) * (huntedPokemon.catchRate / 255)
                            : 1;
                        interaction.reply({
                            content: translations.data.hunt_info((_b = huntedPokemon.names[translations.language]) !== null && _b !== void 0 ? _b : huntedPokemon.names.en, (Math.round(probability * 100 * 10000) / 10000).toString()),
                            ephemeral: true
                        });
                    }
                    else {
                        interaction.reply({
                            content: translations.data.not_hunting(),
                            ephemeral: true
                        });
                    }
                    return [2 /*return*/];
                case 2:
                    if (input === "none") {
                        Util_1.default.database.query("DELETE FROM pokemon_hunting WHERE user_id = $1", [interaction.user.id])
                            .then(function () {
                            interaction.reply({
                                content: translations.data.deleted(),
                                ephemeral: true
                            });
                        });
                        return [2 /*return*/];
                    }
                    pokemon = Pokedex_1.default.findByName(input);
                    if (!pokemon)
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.invalid_pokemon(),
                                ephemeral: true
                            })];
                    return [4 /*yield*/, interaction.reply({
                            content: translations.data.confirmation((_c = pokemon.names[translations.language]) !== null && _c !== void 0 ? _c : pokemon.names.en),
                            ephemeral: true,
                            fetchReply: true
                        })];
                case 3:
                    msg = _e.sent();
                    return [4 /*yield*/, msg.react("✅").catch(console.error)];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, msg.react("❌").catch(console.error)];
                case 5:
                    _e.sent();
                    filter = function (reaction, user) { return user.id === interaction.user.id && ["✅", "❌"].includes(reaction.emoji.name); };
                    return [4 /*yield*/, msg.awaitReactions({ filter: filter, max: 1, time: 30000 })];
                case 6:
                    collected = _e.sent();
                    msg.reactions.removeAll().catch(console.error);
                    if (!collected.size)
                        return [2 /*return*/];
                    if (!(collected.first().emoji.name === "✅")) return [3 /*break*/, 8];
                    return [4 /*yield*/, Util_1.default.database.query("\n\t\t\t\tINSERT INTO pokemon_hunting VALUES ($1, $2)\n\t\t\t\tON CONFLICT (user_id)\n\t\t\t\tDO UPDATE SET pokemon_id = EXCLUDED.pokemon_id, hunt_count = 0\n\t\t\t\tWHERE pokemon_hunting.user_id = EXCLUDED.user_id\n\t\t\t\t", [interaction.user.id, pokemon.nationalId])];
                case 7:
                    _e.sent();
                    interaction.reply({
                        content: translations.data.hunting((_d = pokemon.names[translations.language]) !== null && _d !== void 0 ? _d : pokemon.names.en),
                        ephemeral: true
                    });
                    return [3 /*break*/, 9];
                case 8:
                    interaction.reply({
                        content: translations.data.cancelled(),
                        ephemeral: true
                    });
                    _e.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    }); }
};
exports.default = command;
