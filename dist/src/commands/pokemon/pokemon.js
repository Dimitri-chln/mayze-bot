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
var espapeMarkdown_1 = __importDefault(require("../../utils/misc/espapeMarkdown"));
var command = {
    name: "pokemon",
    description: {
        fr: "Obtenir la liste des pokémons que tu as attrapés",
        en: "Get the list of all the pokémons you caught"
    },
    userPermissions: [],
    botPermissions: ["EMBED_LINKS"],
    options: {
        fr: [
            {
                name: "addfav",
                description: "Ajouter un pokémon à tes favoris",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "pokemon",
                        description: "Le pokémon à ajouter",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "removefav",
                description: "Retirer un pokémon de tes favoris",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "pokemon",
                        description: "Le pokémon à retirer",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "nick",
                description: "Modifier le surnom d'un de tes pokémons",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "pokemon",
                        description: "Le pokémon à renommer",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "nickname",
                        description: "Le nouveau surnom du pokémon. Laisse vide pour le réinitialiser",
                        type: "STRING",
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
            },
            {
                name: "list",
                description: "Obtenir la liste de tes pokémons",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "L'utilisateur dont tu veux obtenir la liste",
                        type: "USER",
                        required: false
                    },
                    {
                        name: "normal",
                        description: "Une option pour n'afficher que les pokémons normaux",
                        type: "BOOLEAN",
                        required: false
                    },
                    {
                        name: "favorite",
                        description: "Une option pour n'afficher que tes pokémons favoris",
                        type: "BOOLEAN",
                        required: false
                    },
                    {
                        name: "legendary",
                        description: "Une option pour n'afficher que les pokémons légendaires",
                        type: "BOOLEAN",
                        required: false
                    },
                    {
                        name: "ultra-beast",
                        description: "Une option pour n'afficher que les chimères",
                        type: "BOOLEAN",
                        required: false
                    },
                    {
                        name: "shiny",
                        description: "Une option pour n'afficher que les pokémons shiny",
                        type: "BOOLEAN",
                        required: false
                    },
                    {
                        name: "alola",
                        description: "Une option pour n'afficher que les pokémons d'Alola",
                        type: "BOOLEAN",
                        required: false
                    },
                    {
                        name: "mega",
                        description: "Une option pour n'afficher que les méga pokémons",
                        type: "BOOLEAN",
                        required: false
                    },
                    {
                        name: "id",
                        description: "Une option pour trouver un pokémon grâce à son ID. Pour afficher les ID à côté des pokémons, utiliser la valeur 0",
                        type: "INTEGER",
                        required: false
                    },
                    {
                        name: "name",
                        description: "Une option pour trouver un pokémon grâce à son nom ou surnom",
                        type: "STRING",
                        required: false
                    },
                    {
                        name: "evolution",
                        description: "Une option pour trouver la ligne d'évolutions complète d'un pokémon",
                        type: "STRING",
                        required: false
                    }
                ]
            }
        ],
        en: [
            {
                name: "addfav",
                description: "Add a pokémon to your favorites",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "pokemon",
                        description: "The pokémon to add",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "removefav",
                description: "Remove a pokémon from your favorites",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "pokemon",
                        description: "The pokémon to remove",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "nick",
                description: "Change the nickname of one of your pokémons",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "pokemon",
                        description: "The pokémon to rename",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "nickname",
                        description: "The new nickname of the pokémon. Leave blank to reset",
                        type: "STRING",
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
            },
            {
                name: "list",
                description: "Get the list of your pokémons",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "The user whose pokémons to check",
                        type: "USER",
                        required: false
                    },
                    {
                        name: "normal",
                        description: "An option to display normal pokémons only",
                        type: "BOOLEAN",
                        required: false
                    },
                    {
                        name: "favorite",
                        description: "An option to display your favorite pokémons only",
                        type: "BOOLEAN",
                        required: false
                    },
                    {
                        name: "legendary",
                        description: "An option to display legendary pokémons only",
                        type: "BOOLEAN",
                        required: false
                    },
                    {
                        name: "ultra-beast",
                        description: "An option to display ultra beasts only",
                        type: "BOOLEAN",
                        required: false
                    },
                    {
                        name: "shiny",
                        description: "An option to display shiny pokémons only",
                        type: "BOOLEAN",
                        required: false
                    },
                    {
                        name: "alola",
                        description: "An option to display alolan pokémons only",
                        type: "BOOLEAN",
                        required: false
                    },
                    {
                        name: "mega",
                        description: "An option to display mega pokémons only",
                        type: "BOOLEAN",
                        required: false
                    },
                    {
                        name: "id",
                        description: "An option to find a pokémon by its ID. To display IDs next to the pokémons instead, use the value 0",
                        type: "INTEGER",
                        required: false
                    },
                    {
                        name: "name",
                        description: "An option to find a pokémon by its name or nickname",
                        type: "STRING",
                        required: false
                    },
                    {
                        name: "evolution",
                        description: "An option to show the whole evolution line of a pokémon",
                        type: "STRING",
                        required: false
                    }
                ]
            }
        ]
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        var subCommand, _a, _b, pokemon, shiny, variationType, pokemons, _c, pokemon, shiny, variationType, pokemons, _d, pokemon, shiny, variationType, nickname, pokemons, pokemon, stringEvolutionLine, user_1, pokemons, pokemonList, pages, page, total, i;
        var _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    subCommand = interaction.options.getSubcommand();
                    _a = subCommand;
                    switch (_a) {
                        case "addfav": return [3 /*break*/, 1];
                        case "removefav": return [3 /*break*/, 4];
                        case "nick": return [3 /*break*/, 7];
                        case "evoline": return [3 /*break*/, 10];
                        case "list": return [3 /*break*/, 11];
                    }
                    return [3 /*break*/, 13];
                case 1:
                    _b = (_e = Pokedex_1.default.findByNameWithVariation(interaction.options.getString("pokemon"))) !== null && _e !== void 0 ? _e : {}, pokemon = _b.pokemon, shiny = _b.shiny, variationType = _b.variationType;
                    if (!pokemon)
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.invalid_pokemon(),
                                ephemeral: true
                            })];
                    return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM pokemons WHERE pokedex_id = $1 AND shiny = $2 AND variation = $3 AND users ? $4", [pokemon.nationalId, shiny, variationType, interaction.user.id])];
                case 2:
                    pokemons = (_k.sent()).rows;
                    if (!pokemons.length)
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.pokemon_not_owned(),
                                ephemeral: true
                            })];
                    return [4 /*yield*/, Util_1.default.database.query("\n\t\t\t\t\tUPDATE pokemons SET users = jsonb_set(users, '{" + interaction.user.id + ", favorite}', TRUE::text::jsonb)\n\t\t\t\t\tWHERE pokedex_id = $1 AND shiny = $2 AND variation = $3\n\t\t\t\t\t", [pokemon.nationalId, shiny, variationType])];
                case 3:
                    _k.sent();
                    interaction.reply({
                        content: translations.data.favorite_added(pokemon.formatName(shiny, variationType, translations.language)),
                        ephemeral: true
                    });
                    return [3 /*break*/, 13];
                case 4:
                    _c = (_f = Pokedex_1.default.findByNameWithVariation(interaction.options.getString("pokemon"))) !== null && _f !== void 0 ? _f : {}, pokemon = _c.pokemon, shiny = _c.shiny, variationType = _c.variationType;
                    if (!pokemon)
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.invalid_pokemon(),
                                ephemeral: true
                            })];
                    return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM pokemons WHERE pokedex_id = $1 AND shiny = $2 AND variation = $3 AND users ? $4", [pokemon.nationalId, shiny, variationType, interaction.user.id])];
                case 5:
                    pokemons = (_k.sent()).rows;
                    if (!pokemons.length)
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.pokemon_not_owned(),
                                ephemeral: true
                            })];
                    return [4 /*yield*/, Util_1.default.database.query("\n\t\t\t\t\tUPDATE pokemons SET users = jsonb_set(users, '{" + interaction.user.id + ", favorite}', FALSE::text::jsonb)\n\t\t\t\t\tWHERE pokedex_id = $1 AND shiny = $2 AND variation = $3\n\t\t\t\t\t", [pokemon.nationalId, shiny, variationType])];
                case 6:
                    _k.sent();
                    interaction.reply({
                        content: translations.data.favorite_removed(pokemon.formatName(shiny, variationType, translations.language)),
                        ephemeral: true
                    });
                    return [3 /*break*/, 13];
                case 7:
                    _d = (_g = Pokedex_1.default.findByNameWithVariation(interaction.options.getString("pokemon"))) !== null && _g !== void 0 ? _g : {}, pokemon = _d.pokemon, shiny = _d.shiny, variationType = _d.variationType;
                    if (!pokemon)
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.invalid_pokemon(),
                                ephemeral: true
                            })];
                    nickname = interaction.options.getString("nickname");
                    if (nickname && nickname.length > 30)
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.nickname_too_long()
                            })];
                    return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM pokemons WHERE pokedex_id = $1 AND shiny = $2 AND variation = $3 AND users ? $4", [pokemon.nationalId, shiny, variationType, interaction.user.id])];
                case 8:
                    pokemons = (_k.sent()).rows;
                    if (!pokemons.length)
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.pokemon_not_owned(),
                                ephemeral: true
                            })];
                    return [4 /*yield*/, Util_1.default.database.query("\n\t\t\t\t\tUPDATE pokemons SET users = jsonb_set(users, '{" + interaction.user.id + ", nickname}', $4::jsonb)\n\t\t\t\t\tWHERE pokedex_id = $1 AND shiny = $2 AND variation = $3\n\t\t\t\t\t", [pokemon.nationalId, shiny, variationType, nickname])];
                case 9:
                    _k.sent();
                    interaction.reply({
                        content: translations.data.nickname_updated(pokemon.formatName(shiny, variationType, translations.language), nickname),
                        ephemeral: true
                    });
                    return [3 /*break*/, 13];
                case 10:
                    {
                        pokemon = Pokedex_1.default.findByName(interaction.options.getString("pokemon"));
                        if (!pokemon)
                            return [2 /*return*/, interaction.reply({
                                    content: translations.data.invalid_pokemon(),
                                    ephemeral: true
                                })];
                        stringEvolutionLine = pokemon.stringEvolutionLine(translations.language);
                        interaction.reply({
                            embeds: [
                                {
                                    author: {
                                        name: translations.data.evoline_title((_h = pokemon.names[translations.language]) !== null && _h !== void 0 ? _h : pokemon.names.en),
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
                        return [3 /*break*/, 13];
                    }
                    _k.label = 11;
                case 11:
                    user_1 = (_j = interaction.options.getUser("user")) !== null && _j !== void 0 ? _j : interaction.user;
                    return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM pokemons WHERE users ? $1 ORDER BY legendary DESC, ultra_beast DESC, shiny DESC, (users -> $1 -> 'caught')::int DESC, pokedex_id ASC", [user_1.id])];
                case 12:
                    pokemons = (_k.sent()).rows;
                    pokemonList = new PokemonList_1.default(pokemons.filter(function (pkm) {
                        if (interaction.options.getBoolean("normal") && (pkm.shiny || pkm.variation !== "default"))
                            return false;
                        if (interaction.options.getBoolean("favorite") && !pkm.users[user_1.id].favorite)
                            return false;
                        if (interaction.options.getBoolean("legendary") && !Pokedex_1.default.findById(pkm.pokedex_id).legendary)
                            return false;
                        if (interaction.options.getBoolean("ultra-beast") && !Pokedex_1.default.findById(pkm.pokedex_id).ultraBeast)
                            return false;
                        if (interaction.options.getBoolean("shiny") && !pkm.shiny)
                            return false;
                        if (interaction.options.getBoolean("alola") && pkm.variation !== "alola")
                            return false;
                        if (interaction.options.getBoolean("mega") && !["mega", "megax", "megay", "primal"].includes(pkm.variation))
                            return false;
                        if (interaction.options.getInteger("id") &&
                            interaction.options.getInteger("id") !== 0 &&
                            pkm.pokedex_id !== interaction.options.getInteger("id"))
                            return false;
                        if (interaction.options.getString("name") &&
                            !new RegExp(interaction.options.getString("name"), "i").test(Pokedex_1.default.findById(pkm.pokedex_id).names[translations.language]) &&
                            !new RegExp(interaction.options.getString("name"), "i").test(pkm.users[user_1.id].nickname))
                            return false;
                        if (interaction.options.getString("evolution") &&
                            Pokedex_1.default.findByName(interaction.options.getString("evolution")) &&
                            !Pokedex_1.default.findByName(interaction.options.getString("evolution")).flatEvolutionLine().some(function (p) { return p.nationalId === pkm.pokedex_id; }))
                            return false;
                        return true;
                    }), user_1.id);
                    pages = [];
                    page = {
                        embeds: [
                            {
                                author: {
                                    name: translations.data.title(user_1.tag),
                                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                },
                                color: interaction.guild.me.displayColor,
                                description: translations.data.no_pokemon()
                            }
                        ]
                    };
                    if (!pokemonList.pokemons.length)
                        pages.push(page);
                    total = pokemons.reduce(function (sum, p) { return sum + p.users[user_1.id].caught; }, 0);
                    for (i = 0; i < pokemonList.pokemons.length; i += Util_1.default.config.ITEMS_PER_PAGE) {
                        page.embeds[0] = {
                            author: {
                                name: translations.data.title(user_1.tag),
                                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                            },
                            title: translations.data.total(total.toString(), total > 1),
                            color: interaction.guild.me.displayColor,
                            description: pokemonList.pokemons
                                .slice(i, i + Util_1.default.config.ITEMS_PER_PAGE)
                                .map(function (p) { return translations.data.description(p.data.formatName(p.shiny, p.variation, translations.language, "badge"), p.data.formatName(p.shiny, p.variation, translations.language, "raw"), interaction.options.getInteger("id") === 0 ? "#" + p.data.nationalId.toString().padStart(3, "0") : "", (0, espapeMarkdown_1.default)(p.nickname), p.caught.toString(), p.caught > 1, p.favorite ? "https~d//www.pokemon.com/" + (translations.language === "en" ? "us" : translations.language) + "/pokedex/" + p.data.names[translations.language].toLowerCase().replace(/[:\.']/g, "").replace(/\s/g, "-").replace(/\u2642/, "-male").replace(/\u2640/, "-female") : ""); }).join("\n")
                        };
                        if (pokemonList.pokemons.length === 1)
                            page.embeds[0].thumbnail.url = pokemonList.pokemons[0].data.image(pokemonList.pokemons[0].shiny, pokemonList.pokemons[0].variation);
                        pages.push(page);
                    }
                    ;
                    (0, pagination_1.default)(interaction, pages);
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    }); }
};
exports.default = command;
