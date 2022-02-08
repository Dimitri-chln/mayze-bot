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
var CatchRates_1 = __importDefault(require("../../types/pokemon/CatchRates"));
var PokemonList_1 = __importDefault(require("../../types/pokemon/PokemonList"));
var image_urls_json_1 = require("../../assets/image-urls.json");
var command = {
    name: "catch",
    description: {
        fr: "Attrape un pokémon !",
        en: "Catch a pokémon!"
    },
    userPermissions: [],
    botPermissions: ["EMBED_LINKS"],
    cooldown: 1200,
    options: {
        fr: [],
        en: []
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        var SHINY_FREQUENCY, ALOLAN_FREQUENCY, MEGA_GEM_FREQUENCY, UPGRADES_BENEFITS, caughtPokemonsData, pokemonList, _a, userUpgrades, upgrades, catchRates, randomPokemon, huntFooterText, _b, userHunt, huntedPokemon, probability, megaGem, megaPokemon, defaultData_1, shiny, variation, catchReward, defaultUserData, defaultData, _c, caughtTotal, reply, logChannel;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    SHINY_FREQUENCY = 0.004, ALOLAN_FREQUENCY = 0.05, MEGA_GEM_FREQUENCY = 0.02;
                    UPGRADES_BENEFITS = {
                        catch_cooldown: function (tier) { return 0.5 * tier; },
                        mega_gem_probability: function (tier) { return 2 * tier; },
                        shiny_probability: function (tier) { return 2 * tier; }
                    };
                    return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM pokemons WHERE users ? $1 AND variation = 'default'", [interaction.user.id])];
                case 1:
                    caughtPokemonsData = (_d.sent()).rows;
                    pokemonList = new PokemonList_1.default(caughtPokemonsData, interaction.user.id);
                    return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM upgrades WHERE user_id = $1", [interaction.user.id])];
                case 2:
                    _a = __read.apply(void 0, [(_d.sent()).rows, 1]), userUpgrades = _a[0];
                    upgrades = userUpgrades !== null && userUpgrades !== void 0 ? userUpgrades : {
                        user_id: interaction.user.id,
                        catch_cooldown_reduction: 0,
                        new_pokemon_probability: 0,
                        legendary_ub_probability: 0,
                        mega_gem_probability: 0,
                        shiny_probability: 0
                    };
                    catchRates = new CatchRates_1.default(pokemonList, upgrades);
                    randomPokemon = catchRates.randomPokemon();
                    return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM pokemon_hunting WHERE user_id = $1", [interaction.user.id])];
                case 3:
                    _b = __read.apply(void 0, [(_d.sent()).rows, 1]), userHunt = _b[0];
                    if (!userHunt) return [3 /*break*/, 6];
                    huntedPokemon = Pokedex_1.default.findById(userHunt.pokemon_id);
                    probability = ((userHunt.hunt_count + 1) / 100) * (huntedPokemon.catchRate / 255);
                    if (probability > 1)
                        probability = 1;
                    if (!(Math.random() < probability)) return [3 /*break*/, 5];
                    return [4 /*yield*/, Util_1.default.database.query("UPDATE pokemon_hunting SET hunt_count = 0 WHERE user_id = $1", [interaction.user.id])];
                case 4:
                    _d.sent();
                    randomPokemon = huntedPokemon;
                    return [3 /*break*/, 6];
                case 5:
                    huntFooterText = translations.data.hunt_probability(/^[aeiou]/i.test(huntedPokemon.names[translations.language]), huntedPokemon.names[translations.language], (Math.round(probability * 100 * 10000) / 10000).toString());
                    _d.label = 6;
                case 6:
                    {
                        // Mega Gems
                        if (Math.random() < MEGA_GEM_FREQUENCY * (1 + UPGRADES_BENEFITS.mega_gem_probability(upgrades.mega_gem_probability) / 100)) {
                            megaPokemon = Pokedex_1.default.megaEvolvablePokemons.random();
                            megaGem = megaPokemon.megaEvolutions[Math.floor(Math.random() * megaPokemon.megaEvolutions.length)].megaStone;
                            defaultData_1 = {};
                            defaultData_1[interaction.user.id] = 1;
                            Util_1.default.database.query("\n\t\t\t\t\tINSERT INTO mega_gems VALUES ($1, $2)\n\t\t\t\t\tON CONFLICT (user_id)\n\t\t\t\t\tDO UPDATE SET gems = \n\t\t\t\t\t\tCASE\n\t\t\t\t\t\t\tWHEN mega_gems.gems -> $3 IS NULL THEN mega_gems.gems || $2\n\t\t\t\t\t\t\tELSE jsonb_set(mega_gems.gems, '{" + megaGem + "}', ((mega_gems.gems -> $3)::int + 1)::text::jsonb)\n\t\t\t\t\t\tEND\n\t\t\t\t\tWHERE mega_gems.user_id = EXCLUDED.user_id\n\t\t\t\t\t", [interaction.user.id, defaultData_1, megaGem]);
                        }
                    }
                    shiny = Math.random() < SHINY_FREQUENCY * (1 + (UPGRADES_BENEFITS.shiny_probability(upgrades.shiny_probability) / 100));
                    variation = Pokedex_1.default.alolaPokemons.has(randomPokemon.nationalId) && Math.random() < ALOLAN_FREQUENCY
                        ? "alola"
                        : "default";
                    catchReward = Math.round(Util_1.default.config.CATCH_REWARD * (255 / randomPokemon.catchRate
                        * (shiny ? Util_1.default.config.SHINY_REWARD_MULTIPLIER : 1)
                        * (variation === "alola" ? Util_1.default.config.ALOLAN_REWARD_MULTIPLIER : 1)));
                    defaultUserData = {
                        caught: 1,
                        favorite: false,
                        nickname: null
                    };
                    defaultData = {};
                    defaultData[interaction.user.id] = defaultUserData;
                    return [4 /*yield*/, Util_1.default.database.query("\n\t\t\tINSERT INTO pokemons VALUES ($1, $2, $3, $4)\n\t\t\tON CONFLICT (pokedex_id, shiny, variation)\n\t\t\tDO UPDATE SET users =\n\t\t\t\tCASE\n\t\t\t\t\tWHEN pokemons.users -> $5 IS NULL THEN jsonb_set(pokemons.users, '{" + interaction.user.id + "}', $6)\n\t\t\t\t\tELSE jsonb_set(pokemons.users, '{" + interaction.user.id + ", caught}', ((pokemons.users -> $5 -> 'caught')::int + 1)::text::jsonb)\n\t\t\t\tEND\n\t\t\tWHERE pokemons.pokedex_id = EXCLUDED.pokedex_id AND pokemons.shiny = EXCLUDED.shiny AND pokemons.variation = EXCLUDED.variation\n\t\t\tRETURNING (users -> $5 -> 'caught')::int AS caught\n\t\t\t", [
                            randomPokemon.nationalId,
                            shiny,
                            variation,
                            defaultData,
                            interaction.user.id,
                            defaultUserData
                        ])];
                case 7:
                    _c = __read.apply(void 0, [(_d.sent()).rows, 1]), caughtTotal = _c[0].caught;
                    Util_1.default.database.query("UPDATE pokemon_hunting SET hunt_count = hunt_count + 1 WHERE user_id = $1", [interaction.user.id]).catch(console.error);
                    Util_1.default.database.query("\n\t\t\tINSERT INTO currency VALUES ($1, $2)\n\t\t\tON CONFLICT (user_id)\n\t\t\tDO UPDATE SET money = currency.money + $2\n\t\t\tWHERE currency.user_id = EXCLUDED.user_id\n\t\t\t", [interaction.user.id, catchReward]).catch(console.error);
                    return [4 /*yield*/, interaction.followUp({
                            embeds: [
                                {
                                    author: {
                                        name: caughtTotal > 1 ? translations.data.caught() : translations.data.caught_new(),
                                        iconURL: image_urls_json_1.pokeball
                                    },
                                    image: {
                                        url: randomPokemon.image(shiny, variation)
                                    },
                                    color: shiny
                                        ? 0xF3D508
                                        : randomPokemon.legendary || randomPokemon.ultraBeast
                                            ? 0xCE2F20
                                            : interaction.guild.me.displayColor,
                                    description: translations.data.caught_title(interaction.user.toString(), !shiny && (variation === "alola" || /^[aeiou]/i.test(randomPokemon.names[translations.language])), randomPokemon.formatName(shiny, variation, translations.language), catchReward.toString()) + (megaGem ? translations.data.mega_gem(megaGem) : ""),
                                    footer: {
                                        text: "✨ Mayze ✨" + (huntFooterText || ""),
                                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                    }
                                }
                            ],
                            fetchReply: true
                        })];
                case 8:
                    reply = _d.sent();
                    if (Util_1.default.beta)
                        return [2 /*return*/];
                    logChannel = interaction.client.channels.cache.get("839538540206882836");
                    logChannel.send({
                        embeds: [
                            {
                                author: {
                                    name: "#" + interaction.channel.name + " (" + interaction.guild.name + ")",
                                    url: reply.url,
                                    iconURL: interaction.guild.iconURL()
                                },
                                thumbnail: {
                                    url: randomPokemon.image(shiny, variation)
                                },
                                color: shiny
                                    ? 0xF3D508
                                    : randomPokemon.legendary || randomPokemon.ultraBeast
                                        ? 0xCE2F20
                                        : Util_1.default.config.MAIN_COLOR,
                                description: translations.data.caught_title_en(interaction.user.toString(), !shiny && (variation === "alola" || /^[aeiou]/i.test(randomPokemon.names.en)), randomPokemon.formatName(shiny, variation, "en")),
                                footer: {
                                    text: "✨ Mayze ✨",
                                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                }
                            }
                        ]
                    });
                    return [2 /*return*/];
            }
        });
    }); }
};
exports.default = command;
