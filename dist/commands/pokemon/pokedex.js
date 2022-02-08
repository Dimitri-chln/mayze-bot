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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = __importDefault(require("../../Util"));
var Pokedex_1 = __importDefault(require("../../types/pokemon/Pokedex"));
var pagination_1 = __importDefault(require("../../utils/misc/pagination"));
var PokemonList_1 = __importDefault(require("../../types/pokemon/PokemonList"));
var command = {
    name: "pokedex",
    description: {
        fr: "Obtenir des informations sur un pokémon ou sur ton pokédex",
        en: "Get information about a pokémon or your pokédex"
    },
    userPermissions: [],
    botPermissions: ["EMBED_LINKS"],
    options: {
        fr: [
            {
                name: "find",
                description: "Trouver un pokémon en particulier dans le pokédex",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "pokemon",
                        description: "Le nom ou l'ID du pokémon",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "list",
                description: "Voir ton pokédex",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "caught",
                        description: "Pokémons que tu as attrapés uniquement",
                        type: "BOOLEAN",
                        required: false
                    },
                    {
                        name: "uncaught",
                        description: "Pokémons que tu n'as pas attrapés uniquement",
                        type: "BOOLEAN",
                        required: false
                    },
                    {
                        name: "shiny",
                        description: "Pokémons shiny uniquement",
                        type: "BOOLEAN",
                        required: false
                    },
                    {
                        name: "legendary",
                        description: "Pokémons légendaires uniquement",
                        type: "BOOLEAN",
                        required: false
                    },
                    {
                        name: "ultra-beast",
                        description: "Chimères uniquement",
                        type: "BOOLEAN",
                        required: false
                    },
                    {
                        name: "alola",
                        description: "Pokémons d'Alola uniquement",
                        type: "BOOLEAN",
                        required: false
                    },
                    {
                        name: "mega",
                        description: "Pokémons méga uniquement",
                        type: "BOOLEAN",
                        required: false
                    }
                ]
            },
            {
                name: "evoline",
                description: "Obtenir la ligne d'évolutions d'un pokémon",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "pokemon",
                        description: "Le pokémon dont tu veux obtenir la ligne d'évolutions",
                        type: "STRING",
                        required: true
                    }
                ]
            }
        ],
        en: [
            {
                name: "find",
                description: "Find a particular pokémon in the pokédex",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "pokemon",
                        description: "The pokémon's name or ID",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "list",
                description: "See your pokédex",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "caught",
                        description: "Pokémons you caught only",
                        type: "BOOLEAN",
                        required: false
                    },
                    {
                        name: "uncaught",
                        description: "Pokémons you haven't caught only",
                        type: "BOOLEAN",
                        required: false
                    },
                    {
                        name: "shiny",
                        description: "Shiny pokémons only",
                        type: "BOOLEAN",
                        required: false
                    },
                    {
                        name: "legendary",
                        description: "Legendary pokémons only",
                        type: "BOOLEAN",
                        required: false
                    },
                    {
                        name: "ultra-beast",
                        description: "Ultra beasts only",
                        type: "BOOLEAN",
                        required: false
                    },
                    {
                        name: "alola",
                        description: "Alolan pokémons only",
                        type: "BOOLEAN",
                        required: false
                    },
                    {
                        name: "mega",
                        description: "Mega pokémons only",
                        type: "BOOLEAN",
                        required: false
                    }
                ]
            },
            {
                name: "evoline",
                description: "Get the evolution line of a pokémon",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "pokemon",
                        description: "The pokémon whose evolution line to get",
                        type: "STRING",
                        required: true
                    }
                ]
            }
        ]
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        var subCommand, _a, input, _b, pokemon_1, shiny, variationType, pokemons, pokemonList_1, userPokedex, shiny_1, pages, page, i, pokemon, stringEvolutionLine;
        var _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    subCommand = interaction.options.getSubcommand();
                    _a = subCommand;
                    switch (_a) {
                        case "find": return [3 /*break*/, 1];
                        case "list": return [3 /*break*/, 2];
                        case "evoline": return [3 /*break*/, 4];
                    }
                    return [3 /*break*/, 5];
                case 1:
                    {
                        input = interaction.options.getString("pokemon");
                        _b = (_c = Pokedex_1.default.findByNameWithVariation(input)) !== null && _c !== void 0 ? _c : {
                            pokemon: Pokedex_1.default.findById(parseInt(input)),
                            shiny: false,
                            variationType: "default"
                        }, pokemon_1 = _b.pokemon, shiny = _b.shiny, variationType = _b.variationType;
                        if (!pokemon_1)
                            return [2 /*return*/, interaction.followUp(translations.data.invalid_pokemon())];
                        interaction.followUp({
                            embeds: [
                                {
                                    title: pokemon_1.formatName(shiny, variationType, translations.language) + " #" + pokemon_1.nationalId.toString().padStart(3, "0"),
                                    color: interaction.guild.me.displayColor,
                                    image: {
                                        url: pokemon_1.image(shiny, variationType)
                                    },
                                    fields: [
                                        {
                                            name: translations.data.field_alternative_names(),
                                            value: Object.keys(pokemon_1.names).filter(function (l) { return l !== translations.language; }).map(function (l) { return Util_1.default.config.LANGUAGE_FLAGS[l] + " " + pokemon_1.names[l]; }).join("\n"),
                                            inline: true
                                        },
                                        {
                                            name: translations.data.field_height(),
                                            value: pokemon_1.heightEu,
                                            inline: true
                                        },
                                        {
                                            name: translations.data.field_weight(),
                                            value: pokemon_1.weightEu,
                                            inline: true
                                        },
                                        {
                                            name: translations.data.field_base_stats(),
                                            value: translations.data.base_stats(pokemon_1.baseStats.hp.toString(), pokemon_1.baseStats.atk.toString(), pokemon_1.baseStats.def.toString(), pokemon_1.baseStats.spAtk.toString(), pokemon_1.baseStats.spDef.toString(), pokemon_1.baseStats.speed.toString()),
                                            inline: true
                                        },
                                        {
                                            name: translations.data.field_forms(),
                                            value: pokemon_1.variations.length || pokemon_1.megaEvolutions.length
                                                ? pokemon_1.variations.map(function (variation) { return "\u2022 " + variation.names[translations.language]; }).join("\n") + "\n"
                                                    + pokemon_1.megaEvolutions.map(function (megaEvolution) { return "\u2022 " + megaEvolution.names[translations.language]; }).join("\n")
                                                : "∅",
                                            inline: true
                                        },
                                        {
                                            name: translations.data.field_types(),
                                            value: pokemon_1.types.map(function (type) { return "\u2022 " + type; }).join("\n"),
                                            inline: true
                                        }
                                    ],
                                    footer: {
                                        text: "✨ Mayze ✨"
                                    }
                                }
                            ]
                        });
                        return [3 /*break*/, 5];
                    }
                    _f.label = 2;
                case 2: return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM pokemons WHERE users ? $1", [interaction.user.id])];
                case 3:
                    pokemons = (_f.sent()).rows;
                    pokemonList_1 = new PokemonList_1.default(pokemons, interaction.user.id);
                    userPokedex = Pokedex_1.default.pokemons.filter(function (pokemon) {
                        if (interaction.options.getBoolean("caught") && !pokemonList_1.has(pokemon))
                            return false;
                        if (interaction.options.getBoolean("uncaught") && pokemonList_1.has(pokemon))
                            return false;
                        if (interaction.options.getBoolean("legendary") && !pokemon.legendary)
                            return false;
                        if (interaction.options.getBoolean("ultra-beast") && !pokemon.ultraBeast)
                            return false;
                        if (interaction.options.getBoolean("alola") && !Pokedex_1.default.alolaPokemons.has(pokemon.nationalId))
                            return false;
                        if (interaction.options.getBoolean("mega") && !Pokedex_1.default.megaEvolvablePokemons.has(pokemon.nationalId))
                            return false;
                        return true;
                    });
                    shiny_1 = (_d = interaction.options.getBoolean("shiny")) !== null && _d !== void 0 ? _d : false;
                    pages = [];
                    page = function (desc) {
                        return {
                            embeds: [
                                {
                                    author: {
                                        name: translations.data.title(interaction.user.tag),
                                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                    },
                                    color: interaction.guild.me.displayColor,
                                    description: desc
                                }
                            ]
                        };
                    };
                    if (!userPokedex.length)
                        pages.push(page(translations.data.no_pokemon()));
                    for (i = 0; i < userPokedex.length; i += Util_1.default.config.ITEMS_PER_PAGE) {
                        pages.push(page(userPokedex
                            .slice(i, i + Util_1.default.config.ITEMS_PER_PAGE)
                            .map(function (pkm) {
                            if (interaction.options.getBoolean("mega")) {
                                return pkm.megaEvolutions.map(function (megaEvolution) { return translations.data.description(pokemonList_1.has(pkm), pkm.formatName(shiny_1, megaEvolution.suffix, translations.language), pkm.nationalId.toString().padStart(3, "0")); }).join("\n");
                            }
                            else {
                                var variationType = interaction.options.getBoolean("alola")
                                    ? "alola"
                                    : "default";
                                return translations.data.description(pokemonList_1.has(pkm), pkm.formatName(shiny_1, variationType, translations.language), pkm.nationalId.toString().padStart(3, "0"));
                            }
                        })
                            .join("\n")));
                    }
                    ;
                    (0, pagination_1.default)(interaction, pages);
                    return [3 /*break*/, 5];
                case 4:
                    {
                        pokemon = Pokedex_1.default.findByName(interaction.options.getString("pokemon"));
                        if (!pokemon)
                            return [2 /*return*/, interaction.followUp(translations.data.invalid_pokemon())];
                        stringEvolutionLine = pokemon.stringEvolutionLine(translations.language);
                        interaction.followUp({
                            embeds: [
                                {
                                    author: {
                                        name: translations.data.evoline_title((_e = pokemon.names[translations.language]) !== null && _e !== void 0 ? _e : pokemon.names.en),
                                        iconURL: interaction.client.user.displayAvatarURL()
                                    },
                                    thumbnail: {
                                        url: "https://assets.poketwo.net/images/" + pokemon.nationalId + ".png?v=26"
                                    },
                                    color: interaction.guild.me.displayColor,
                                    description: "```\n" + stringEvolutionLine + "\n```",
                                    footer: {
                                        text: "✨ Mayze ✨"
                                    }
                                }
                            ]
                        });
                        return [3 /*break*/, 5];
                    }
                    _f.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    }); }
};
exports.default = command;
