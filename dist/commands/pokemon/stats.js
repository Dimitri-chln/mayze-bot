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
var pagination_1 = __importDefault(require("../../utils/misc/pagination"));
var command = {
    name: "stats",
    description: {
        fr: "Obtenir des statistiques sur le bot",
        en: "Get statistics about the bot"
    },
    userPermissions: [],
    botPermissions: ["EMBED_LINKS"],
    options: {
        fr: [
            {
                name: "pokemons",
                description: "Obtenir des statistiques à propos des pokémons",
                type: "SUB_COMMAND_GROUP",
                options: [
                    {
                        name: "global",
                        description: "Obtenir les statistiques globales à propos des pokémons",
                        type: "SUB_COMMAND"
                    },
                    {
                        name: "about",
                        description: "Obtenir les statistiques d'un pokémon",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "pokemon",
                                description: "Le pokémon dont tu veux voir les statistiques",
                                type: "STRING",
                                required: true
                            }
                        ]
                    },
                    {
                        name: "caught",
                        description: "Voir le classement des pokémons les plus attrapés",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "shiny",
                                description: "Ne montrer que les pokémons shiny",
                                type: "BOOLEAN",
                                required: false
                            },
                            {
                                name: "legendary",
                                description: "Ne montrer que les pokémons légendaires",
                                type: "BOOLEAN",
                                required: false
                            },
                            {
                                name: "ultra-beast",
                                description: "Ne montrer que les chimères",
                                type: "BOOLEAN",
                                required: false
                            },
                            {
                                name: "variation",
                                description: "Ne montrer qu'un type de variation",
                                type: "STRING",
                                required: false,
                                choices: [
                                    {
                                        name: "Pokémons méga",
                                        value: "mega"
                                    },
                                    {
                                        name: "Pokémons d'Alola",
                                        value: "alola"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        en: [
            {
                name: "pokemons",
                description: "Get statistics about pokémons",
                type: "SUB_COMMAND_GROUP",
                options: [
                    {
                        name: "global",
                        description: "Get global statistics about Mayze's pokémons",
                        type: "SUB_COMMAND"
                    },
                    {
                        name: "about",
                        description: "Get statistics about one pokémon",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "pokemon",
                                description: "The pokémon whose statistics to get",
                                type: "STRING",
                                required: true
                            }
                        ]
                    },
                    {
                        name: "caught",
                        description: "See the ranking of the most caught pokémons",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "shiny",
                                description: "Show shiny pokémons only",
                                type: "BOOLEAN",
                                required: false
                            },
                            {
                                name: "legendary",
                                description: "Show legendary pokémons only",
                                type: "BOOLEAN",
                                required: false
                            },
                            {
                                name: "ultra-beast",
                                description: "Show ultra beasts only",
                                type: "BOOLEAN",
                                required: false
                            },
                            {
                                name: "variation",
                                description: "Show one variation type only",
                                type: "STRING",
                                required: false,
                                choices: [
                                    {
                                        name: "Mega pokémons",
                                        value: "mega"
                                    },
                                    {
                                        name: "Alolan pokémons",
                                        value: "alola"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        var subCommandGroup, _a, subCommand, _b, description, total, _c, normal, _d, shiny, allNormal, legendary, legendaryTotal, ultraBeast, ultraBeastTotal, allShiny, legendaryShiny, legendaryShinyTotal, ultraBeastShiny, ultraBeastShinyTotal, _e, alola, _f, alolaShiny, _g, mega, _h, megaShiny, pokemon, description, total, _j, normal, _k, shiny, _l, alola, _m, alolaShiny, _o, mega, _p, megaShiny, shiny_1, variation_1, pokemons, pages, page, _loop_1, i;
        var _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2;
        return __generator(this, function (_3) {
            switch (_3.label) {
                case 0:
                    subCommandGroup = interaction.options.getSubcommandGroup();
                    _a = subCommandGroup;
                    switch (_a) {
                        case "pokemons": return [3 /*break*/, 1];
                    }
                    return [3 /*break*/, 23];
                case 1:
                    subCommand = interaction.options.getSubcommand();
                    _b = subCommand;
                    switch (_b) {
                        case "global": return [3 /*break*/, 2];
                        case "about": return [3 /*break*/, 11];
                        case "caught": return [3 /*break*/, 20];
                    }
                    return [3 /*break*/, 22];
                case 2:
                    description = "", total = 0;
                    return [4 /*yield*/, Util_1.default.database.query("\n\t\t\t\t\t\t\tSELECT SUM((value -> 'caught')::int) AS total\n\t\t\t\t\t\t\tFROM pokemons, jsonb_each(users)\n\t\t\t\t\t\t\tWHERE shiny = false AND variation = 'default'\n\t\t\t\t\t\t\t")];
                case 3:
                    _c = __read.apply(void 0, [(_3.sent()).rows, 1]), normal = _c[0];
                    description += translations.data.normal(((_q = normal.total) !== null && _q !== void 0 ? _q : 0).toString());
                    total += (_r = normal.total) !== null && _r !== void 0 ? _r : 0;
                    return [4 /*yield*/, Util_1.default.database.query("\n\t\t\t\t\t\t\tSELECT SUM((value -> 'caught')::int) AS total\n\t\t\t\t\t\t\tFROM pokemons, jsonb_each(users)\n\t\t\t\t\t\t\tWHERE shiny AND variation = 'default'\n\t\t\t\t\t\t\t")];
                case 4:
                    _d = __read.apply(void 0, [(_3.sent()).rows, 1]), shiny = _d[0];
                    description += translations.data.shiny(((_s = shiny.total) !== null && _s !== void 0 ? _s : 0).toString());
                    total += (_t = shiny.total) !== null && _t !== void 0 ? _t : 0;
                    return [4 /*yield*/, Util_1.default.database.query("\n\t\t\t\t\t\t\tSELECT pokedex_id, users\n\t\t\t\t\t\t\tFROM pokemons\n\t\t\t\t\t\t\tWHERE shiny = false AND variation = 'default'\n\t\t\t\t\t\t\t")];
                case 5:
                    allNormal = (_3.sent()).rows;
                    legendary = allNormal.filter(function (pokemon) { return Pokedex_1.default.findById(pokemon.pokedex_id).legendary; });
                    legendaryTotal = legendary.reduce(function (total, pkm) { return total + Object.values(pkm.users).reduce(function (sum, user) { return sum + user.caught; }, 0); }, 0);
                    description += translations.data.legendary(legendaryTotal.toString());
                    total += legendaryTotal;
                    ultraBeast = allNormal.filter(function (pokemon) { return Pokedex_1.default.findById(pokemon.pokedex_id).ultraBeast; });
                    ultraBeastTotal = ultraBeast.reduce(function (total, pkm) { return total + Object.values(pkm.users).reduce(function (sum, user) { return sum + user.caught; }, 0); }, 0);
                    description += translations.data.ultra_beast(ultraBeastTotal.toString());
                    total += ultraBeastTotal;
                    return [4 /*yield*/, Util_1.default.database.query("\n\t\t\t\t\t\t\tSELECT pokedex_id, users\n\t\t\t\t\t\t\tFROM pokemons\n\t\t\t\t\t\t\tWHERE shiny AND variation = 'default'\n\t\t\t\t\t\t\t")];
                case 6:
                    allShiny = (_3.sent()).rows;
                    legendaryShiny = allShiny.filter(function (pokemon) { return Pokedex_1.default.findById(pokemon.pokedex_id).legendary; });
                    legendaryShinyTotal = legendaryShiny.reduce(function (total, pkm) { return total + Object.values(pkm.users).reduce(function (sum, user) { return sum + user.caught; }, 0); }, 0);
                    description += translations.data.legendary_shiny(legendaryShinyTotal.toString());
                    total += legendaryShinyTotal;
                    ultraBeastShiny = allShiny.filter(function (pokemon) { return Pokedex_1.default.findById(pokemon.pokedex_id).ultraBeast; });
                    ultraBeastShinyTotal = ultraBeastShiny.reduce(function (total, pkm) { return total + Object.values(pkm.users).reduce(function (sum, user) { return sum + user.caught; }, 0); }, 0);
                    description += translations.data.ultra_beast_shiny(ultraBeastShinyTotal.toString());
                    total += ultraBeastShinyTotal;
                    return [4 /*yield*/, Util_1.default.database.query("\n\t\t\t\t\t\t\tSELECT SUM((value -> 'caught')::int) AS total\n\t\t\t\t\t\t\tFROM pokemons, jsonb_each(users)\n\t\t\t\t\t\t\tWHERE shiny = false AND variation = 'alola'\n\t\t\t\t\t\t\t")];
                case 7:
                    _e = __read.apply(void 0, [(_3.sent()).rows, 1]), alola = _e[0];
                    description += translations.data.alola(((_u = alola.total) !== null && _u !== void 0 ? _u : 0).toString());
                    total += (_v = alola.total) !== null && _v !== void 0 ? _v : 0;
                    return [4 /*yield*/, Util_1.default.database.query("\n\t\t\t\t\t\t\tSELECT SUM((value -> 'caught')::int) AS total\n\t\t\t\t\t\t\tFROM pokemons, jsonb_each(users)\n\t\t\t\t\t\t\tWHERE shiny AND variation = 'alola'\n\t\t\t\t\t\t\t")];
                case 8:
                    _f = __read.apply(void 0, [(_3.sent()).rows, 1]), alolaShiny = _f[0];
                    description += translations.data.alola_shiny(((_w = alolaShiny.total) !== null && _w !== void 0 ? _w : 0).toString());
                    total += (_x = alolaShiny.total) !== null && _x !== void 0 ? _x : 0;
                    return [4 /*yield*/, Util_1.default.database.query("\n\t\t\t\t\t\t\tSELECT SUM((value -> 'caught')::int) AS total\n\t\t\t\t\t\t\tFROM pokemons, jsonb_each(users)\n\t\t\t\t\t\t\tWHERE shiny = false AND variation = ANY('{ \"mega\", \"megax\", \"megay\", \"primal\" }')\n\t\t\t\t\t\t\t")];
                case 9:
                    _g = __read.apply(void 0, [(_3.sent()).rows, 1]), mega = _g[0];
                    description += translations.data.mega(((_y = mega.total) !== null && _y !== void 0 ? _y : 0).toString());
                    total += (_z = mega.total) !== null && _z !== void 0 ? _z : 0;
                    return [4 /*yield*/, Util_1.default.database.query("\n\t\t\t\t\t\t\tSELECT SUM((value -> 'caught')::int) AS total\n\t\t\t\t\t\t\tFROM pokemons, jsonb_each(users)\n\t\t\t\t\t\t\tWHERE shiny AND variation = ANY('{ \"mega\", \"megax\", \"megay\", \"primal\" }')\n\t\t\t\t\t\t\t")];
                case 10:
                    _h = __read.apply(void 0, [(_3.sent()).rows, 1]), megaShiny = _h[0];
                    description += translations.data.mega_shiny(((_0 = megaShiny.total) !== null && _0 !== void 0 ? _0 : 0).toString());
                    total += (_1 = megaShiny.total) !== null && _1 !== void 0 ? _1 : 0;
                    description += translations.data.total(total.toString());
                    interaction.reply({
                        embeds: [
                            {
                                author: {
                                    name: translations.data.title(),
                                    iconURL: interaction.client.user.displayAvatarURL()
                                },
                                color: interaction.guild.me.displayColor,
                                description: description,
                                footer: {
                                    text: "✨ Mayze ✨"
                                }
                            }
                        ]
                    });
                    return [3 /*break*/, 22];
                case 11:
                    pokemon = Pokedex_1.default.findByName(interaction.options.getString("pokemon"));
                    if (!pokemon)
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.invalid_pokemon(),
                                ephemeral: true
                            })];
                    description = "", total = 0;
                    return [4 /*yield*/, Util_1.default.database.query("\n\t\t\t\t\t\t\tSELECT SUM((value -> 'caught')::int) AS total\n\t\t\t\t\t\t\tFROM pokemons, jsonb_each(users)\n\t\t\t\t\t\t\tWHERE pokedex_id = $1 AND shiny = false AND variation = 'default'\n\t\t\t\t\t\t\t", [pokemon.nationalId])];
                case 12:
                    _j = __read.apply(void 0, [(_3.sent()).rows, 1]), normal = _j[0];
                    description += translations.data.normal(normal.total);
                    total += normal.total;
                    return [4 /*yield*/, Util_1.default.database.query("\n\t\t\t\t\t\t\tSELECT SUM((value -> 'caught')::int) AS total\n\t\t\t\t\t\t\tFROM pokemons, jsonb_each(users)\n\t\t\t\t\t\t\tWHERE pokedex_id = $1 AND shiny = true AND variation = 'default'\n\t\t\t\t\t\t\t", [pokemon.nationalId])];
                case 13:
                    _k = __read.apply(void 0, [(_3.sent()).rows, 1]), shiny = _k[0];
                    description += translations.data.shiny(shiny.total);
                    total += shiny.total;
                    if (!pokemon.variations.some(function (variation) { return variation.suffix === "alola"; })) return [3 /*break*/, 16];
                    return [4 /*yield*/, Util_1.default.database.query("\n\t\t\t\t\t\t\t\tSELECT SUM((value -> 'caught')::int) AS total\n\t\t\t\t\t\t\t\tFROM pokemons, jsonb_each(users)\n\t\t\t\t\t\t\t\tWHERE pokedex_id = $1 AND shiny = false AND variation = 'alola'\n\t\t\t\t\t\t\t\t", [pokemon.nationalId])];
                case 14:
                    _l = __read.apply(void 0, [(_3.sent()).rows, 1]), alola = _l[0];
                    description += translations.data.alola(alola.total);
                    total += alola.total;
                    return [4 /*yield*/, Util_1.default.database.query("\n\t\t\t\t\t\t\t\tSELECT SUM((value -> 'caught')::int) AS total\n\t\t\t\t\t\t\t\tFROM pokemons, jsonb_each(users)\n\t\t\t\t\t\t\t\tWHERE pokedex_id = $1 AND shiny = true AND variation = 'alola'\n\t\t\t\t\t\t\t\t", [pokemon.nationalId])];
                case 15:
                    _m = __read.apply(void 0, [(_3.sent()).rows, 1]), alolaShiny = _m[0];
                    description += translations.data.alola_shiny(alolaShiny.total);
                    total += alolaShiny.total;
                    _3.label = 16;
                case 16:
                    if (!pokemon.megaEvolutions.length) return [3 /*break*/, 19];
                    return [4 /*yield*/, Util_1.default.database.query("\n\t\t\t\t\t\t\t\tSELECT SUM((value -> 'caught')::int) AS total\n\t\t\t\t\t\t\t\tFROM pokemons, jsonb_each(users)\n\t\t\t\t\t\t\t\tWHERE pokedex_id = $1 AND shiny = false AND variation = ANY('{ \"mega\", \"megax\", \"megay\", \"primal\" }')\n\t\t\t\t\t\t\t\t", [pokemon.nationalId])];
                case 17:
                    _o = __read.apply(void 0, [(_3.sent()).rows, 1]), mega = _o[0];
                    description += translations.data.mega(mega.total);
                    total += mega.total;
                    return [4 /*yield*/, Util_1.default.database.query("\n\t\t\t\t\t\t\t\tSELECT SUM((value -> 'caught')::int) AS total\n\t\t\t\t\t\t\t\tFROM pokemons, jsonb_each(users)\n\t\t\t\t\t\t\t\tWHERE pokedex_id = $1 AND shiny = false AND variation = ANY('{ \"mega\", \"megax\", \"megay\", \"primal\" }')\n\t\t\t\t\t\t\t\t", [pokemon.nationalId])];
                case 18:
                    _p = __read.apply(void 0, [(_3.sent()).rows, 1]), megaShiny = _p[0];
                    description += translations.data.mega_shiny(megaShiny.total);
                    total += megaShiny.total;
                    _3.label = 19;
                case 19:
                    description += translations.data.total(total.toString());
                    interaction.reply({
                        embeds: [
                            {
                                author: {
                                    name: translations.data.title(),
                                    iconURL: interaction.client.user.displayAvatarURL()
                                },
                                title: pokemon.names[translations.language] + "#" + pokemon.nationalId.toString().padStart(3, "0"),
                                color: interaction.guild.me.displayColor,
                                description: description,
                                footer: {
                                    text: "✨ Mayze ✨"
                                }
                            }
                        ]
                    });
                    return [3 /*break*/, 22];
                case 20:
                    shiny_1 = Boolean(interaction.options.getBoolean("shiny"));
                    variation_1 = (_2 = interaction.options.getString("variation")) !== null && _2 !== void 0 ? _2 : "default";
                    return [4 /*yield*/, Util_1.default.database.query("\n\t\t\t\t\t\t\tSELECT pokedex_id, shiny, variation, SUM((value -> 'caught')::int) AS total\n\t\t\t\t\t\t\tFROM pokemons, jsonb_each(users)\n\t\t\t\t\t\t\tWHERE shiny = $1 AND variation = $2\n\t\t\t\t\t\t\tGROUP BY pokedex_id, shiny, variation\n\t\t\t\t\t\t\tORDER BY total DESC\n\t\t\t\t\t\t\t", [shiny_1, variation_1])];
                case 21:
                    pokemons = (_3.sent()).rows;
                    pokemons = pokemons.filter(function (pokemon) {
                        if (interaction.options.getBoolean("legendary") && !Pokedex_1.default.findById(pokemon.pokedex_id).legendary)
                            return false;
                        if (interaction.options.getBoolean("ultra-beast") && !Pokedex_1.default.findById(pokemon.pokedex_id).ultraBeast)
                            return false;
                        return true;
                    });
                    pages = [];
                    page = {
                        embeds: [
                            {
                                author: {
                                    name: translations.data.title(),
                                    iconURL: interaction.client.user.displayAvatarURL()
                                },
                                title: translations.data.most_caught_title(),
                                color: interaction.guild.me.displayColor
                            }
                        ]
                    };
                    _loop_1 = function (i) {
                        page.embeds[0].description = pokemons.slice(i, i + Util_1.default.config.ITEMS_PER_PAGE).map(function (pokemon, j) {
                            return translations.data.most_caught_description((i + j + 1).toString(), Pokedex_1.default.findById(pokemon.pokedex_id).formatName(shiny_1, variation_1, translations.language), pokemon.total.toString());
                        }).join("\n");
                        pages.push(page);
                    };
                    for (i = 0; i < pokemons.length; i += Util_1.default.config.ITEMS_PER_PAGE) {
                        _loop_1(i);
                    }
                    ;
                    (0, pagination_1.default)(interaction, pages);
                    return [3 /*break*/, 22];
                case 22: return [3 /*break*/, 23];
                case 23: return [2 /*return*/];
            }
        });
    }); }
};
exports.default = command;
