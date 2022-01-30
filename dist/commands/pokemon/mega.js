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
var groupArrayBy_1 = __importDefault(require("../../utils/misc/groupArrayBy"));
var command = {
    name: "mega",
    description: {
        fr: "Gérer tes méga gemmes",
        en: "Manage your mega gems"
    },
    userPermissions: [],
    botPermissions: ["ADD_REACTIONS"],
    options: {
        fr: [
            {
                name: "evolve",
                description: "Faire méga évoluer un pokémon",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "pokemon",
                        description: "Le pokémon à faire méga évoluer",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "type",
                        description: "Le type de méga évolution",
                        type: "STRING",
                        required: true,
                        choices: [
                            {
                                name: "Méga",
                                value: "mega"
                            },
                            {
                                name: "Méga X",
                                value: "megax"
                            },
                            {
                                name: "Méga Y",
                                value: "megay"
                            },
                            {
                                name: "Primal",
                                value: "primal"
                            }
                        ]
                    },
                    {
                        name: "shiny",
                        description: "Si le pokémon à méga évoluer est shiny ou non",
                        type: "BOOLEAN",
                        required: false
                    }
                ]
            },
            {
                name: "gems",
                description: "Voir la liste de tes méga gemmes",
                type: "SUB_COMMAND"
            }
        ],
        en: [
            {
                name: "evolve",
                description: "Mega evolve a pokémon",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "pokemon",
                        description: "The pokémon to mega evolve",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "type",
                        description: "The mega evolution type",
                        type: "STRING",
                        required: true,
                        choices: [
                            {
                                name: "Mega",
                                value: "mega"
                            },
                            {
                                name: "Mega X",
                                value: "megax"
                            },
                            {
                                name: "Mega Y",
                                value: "megay"
                            },
                            {
                                name: "Primal",
                                value: "primal"
                            }
                        ]
                    },
                    {
                        name: "shiny",
                        description: "Whether to mega evolve a shiny pokémon or not",
                        type: "BOOLEAN",
                        required: false
                    }
                ]
            },
            {
                name: "gems",
                description: "See the list of your mega gems",
                type: "SUB_COMMAND"
            }
        ]
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        var subCommand, _a, gems, _b, pokemon_1, megaType_1, shiny_1, _c, pokemonData, megaEvolution_1, defaultData, defaultUserData, reply_1, gemList;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    subCommand = interaction.options.getSubcommand();
                    return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM mega_gems WHERE user_id = $1", [interaction.user.id])];
                case 1:
                    _a = __read.apply(void 0, [(_e.sent()).rows, 1]), gems = _a[0].gems;
                    _b = subCommand;
                    switch (_b) {
                        case "evolve": return [3 /*break*/, 2];
                        case "gems": return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 6];
                case 2:
                    pokemon_1 = Pokedex_1.default.findByName(interaction.options.getString("pokemon"));
                    megaType_1 = interaction.options.getString("type");
                    shiny_1 = (_d = interaction.options.getBoolean("shiny")) !== null && _d !== void 0 ? _d : false;
                    return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM pokemons WHERE pokedex_id = $1 AND shiny = $2 AND variation = 'default' AND users ? $3", [pokemon_1.nationalId, shiny_1, interaction.user.id])];
                case 3:
                    _c = __read.apply(void 0, [(_e.sent()).rows, 1]), pokemonData = _c[0];
                    if (!pokemonData)
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.pokemon_not_owned(),
                                ephemeral: true
                            })];
                    megaEvolution_1 = pokemon_1.megaEvolutions.find(function (mega) { return mega.suffix === megaType_1; });
                    if (!megaEvolution_1)
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.invalid_mega_evolution(),
                                ephemeral: true
                            })];
                    if (!gems[megaEvolution_1.megaStone])
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.no_mega_gem(megaEvolution_1.megaStone),
                                ephemeral: true
                            })];
                    Util_1.default.database.query("\n\t\t\t\t\tUPDATE mega_gems\n\t\t\t\t\tSET gems =\n\t\t\t\t\t\tCASE\n\t\t\t\t\t\t\tWHEN (gems -> $1)::int = 1 THEN gems - $1\n\t\t\t\t\t\t\tELSE jsonb_set(gems, '{" + megaEvolution_1.megaStone + "}', ((gems -> $1)::int - 1)::text::jsonb)\n\t\t\t\t\t\tEND\n\t\t\t\t\tWHERE user_id = $2\n\t\t\t\t\t", [megaEvolution_1.megaStone, interaction.user.id]);
                    defaultData = {};
                    defaultData[interaction.user.id] = { caught: 1, favorite: false, nickname: null };
                    defaultUserData = { caught: 1, favorite: false, nickname: null };
                    Util_1.default.database.query("\n\t\t\t\t\tINSERT INTO pokemons VALUES ($1, $2, $3, $4, $5)\n\t\t\t\t\tON CONFLICT (pokedex_id, shiny, variation)\n\t\t\t\t\tDO UPDATE SET users =\n\t\t\t\t\t\tCASE\n\t\t\t\t\t\t\tWHEN pokemons.users -> $6 IS NULL THEN jsonb_set(pokemons.users, '{" + interaction.user.id + "}', $7)\n\t\t\t\t\t\t\tELSE jsonb_set(pokemons.users, '{" + interaction.user.id + ", caught}', ((pokemons.users -> $6 -> 'caught')::int + 1)::text::jsonb)\n\t\t\t\t\t\tEND\n\t\t\t\t\tWHERE pokemons.pokedex_id = EXCLUDED.pokedex_id AND pokemons.shiny = EXCLUDED.shiny AND pokemons.variation = EXCLUDED.variation\n\t\t\t\t\t", [pokemon_1.nationalId, pokemon_1.names.en, shiny_1, megaEvolution_1.suffix, defaultData, interaction.user.id, defaultUserData]);
                    Util_1.default.database.query("\n\t\t\t\t\tUPDATE pokemons\n\t\t\t\t\tSET users =\n\t\t\t\t\t\tCASE\n\t\t\t\t\t\t\tWHEN (users -> $1 -> 'caught')::int = 1 THEN users - $1\n\t\t\t\t\t\t\tELSE jsonb_set(users, '{" + interaction.user.id + ", caught}', ((users -> $1 -> 'caught')::int - 1)::text::jsonb)\n\t\t\t\t\t\tEND\n\t\t\t\t\tWHERE pokedex_id = $2 AND shiny = $3 AND variation = $4\n\t\t\t\t\t", [interaction.user.id, pokemon_1.nationalId, shiny_1, "default"]);
                    return [4 /*yield*/, interaction.reply({
                            embeds: [
                                {
                                    author: {
                                        name: translations.data.evolving_title(interaction.user.tag),
                                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                    },
                                    color: interaction.guild.me.displayColor,
                                    thumbnail: {
                                        url: pokemon_1.image(shiny_1, "default")
                                    },
                                    description: translations.data.evolving(pokemon_1.formatName(shiny_1, "default", translations.language))
                                }
                            ],
                            fetchReply: true
                        })];
                case 4:
                    reply_1 = _e.sent();
                    setTimeout(function () {
                        reply_1.edit({
                            embeds: [
                                reply_1.embeds[0]
                                    .setThumbnail(pokemon_1.image(shiny_1, megaEvolution_1.suffix))
                                    .setDescription(translations.data.evolved(pokemon_1.formatName(shiny_1, "default", translations.language), pokemon_1.formatName(shiny_1, megaEvolution_1.suffix, translations.language)))
                            ]
                        });
                    }, 3000);
                    return [3 /*break*/, 6];
                case 5:
                    {
                        gemList = (0, groupArrayBy_1.default)(Object.entries(gems), 2);
                        interaction.reply({
                            embeds: [
                                {
                                    author: {
                                        name: translations.data.title(interaction.user.tag),
                                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                    },
                                    color: interaction.guild.me.displayColor,
                                    // U+00d7 : ×
                                    description: "```\n" + gemList.map(function (group) { return group.map(function (_a) {
                                        var _b = __read(_a, 2), gem = _b[0], number = _b[1];
                                        return (gem + " \u00D7" + number).padEnd(20, " ");
                                    }).join(" "); }).join("\n") + "\n```",
                                    footer: {
                                        text: "✨ Mayze ✨"
                                    }
                                }
                            ]
                        });
                        return [3 /*break*/, 6];
                    }
                    _e.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    }); }
};
exports.default = command;
