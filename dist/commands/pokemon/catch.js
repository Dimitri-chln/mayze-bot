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
var CatchRates_1 = __importDefault(require("../../types/pokemon/CatchRates"));
var PokemonList_1 = __importDefault(require("../../types/pokemon/PokemonList"));
var image_urls_json_1 = require("../../assets/image-urls.json");
var config_json_1 = require("../../config.json");
var command = {
    name: "catch",
    description: {
        fr: "Attrape un pokémon !",
        en: "Catch a pokémon!"
    },
    userPermissions: [],
    botPermissions: ["EMBED_LINKS"],
    options: {
        fr: [],
        en: []
    },
    run: function (interaction, languageStrings) { return __awaiter(void 0, void 0, void 0, function () {
        var SHINY_FREQUENCY, ALOLAN_FREQUENCY, MEGA_GEM_FREQUENCY, UPGRADES_BENEFITS, caughtPokemonsData, pokemonList, upgradesData, upgrades, catchRates, randomPokemon, huntFooterText, rows, huntedPokemon, probability, megaGem, megaPokemon, defaultData_1, shiny, variation, catchReward, defaultData, defaultUserData, res, reply, logChannel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    SHINY_FREQUENCY = 0.004, ALOLAN_FREQUENCY = 0.05, MEGA_GEM_FREQUENCY = 0.02;
                    UPGRADES_BENEFITS = {
                        catch_cooldown: function (tier) { return 0.5 * tier; },
                        mega_gem_probability: function (tier) { return 2 * tier; },
                        shiny_probability: function (tier) { return 2 * tier; }
                    };
                    return [4 /*yield*/, Util_1.default.database.query("SELECT pokedex_id FROM pokemons WHERE users ? $1 AND variation = 'default'", [interaction.user.id])];
                case 1:
                    caughtPokemonsData = (_a.sent())["rows"];
                    pokemonList = new PokemonList_1.default(caughtPokemonsData);
                    return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM upgrades WHERE user_id = $1", [interaction.user.id])];
                case 2:
                    upgradesData = (_a.sent())["rows"];
                    upgrades = upgradesData.length
                        ? upgradesData[0]
                        : {
                            user_id: interaction.user.id,
                            catch_cooldown_tier: 0,
                            new_pokemon_tier: 0,
                            legendary_ultrabeast_tier: 0,
                            mega_gem_tier: 0,
                            shiny_tier: 0
                        };
                    catchRates = new CatchRates_1.default(pokemonList, upgrades);
                    randomPokemon = catchRates.randomPokemon();
                    return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM pokemon_hunting WHERE user_id = $1", [interaction.user.id])];
                case 3:
                    rows = (_a.sent()).rows;
                    if (!rows.length) return [3 /*break*/, 6];
                    huntedPokemon = Pokedex_1.default.findById(rows[0].pokemon_id);
                    probability = ((rows[0].hunt_count + 1) / 100) * (huntedPokemon.catchRate / 255);
                    if (probability > 1)
                        probability = 1;
                    if (!(Math.random() < probability)) return [3 /*break*/, 5];
                    return [4 /*yield*/, Util_1.default.database.query("UPDATE pokemon_hunting SET hunt_count = 0 WHERE user_id = $1", [interaction.user.id])];
                case 4:
                    _a.sent();
                    randomPokemon = huntedPokemon;
                    return [3 /*break*/, 6];
                case 5:
                    huntFooterText = languageStrings.data.hunt_probability(/^[aeiou]/i.test(huntedPokemon.names[languageStrings.language]), huntedPokemon.names[languageStrings.language], Math.round(probability * 100 * 10000 / 10000).toString());
                    _a.label = 6;
                case 6:
                    {
                        // Mega Gems
                        if (Math.random() < MEGA_GEM_FREQUENCY * (1 + UPGRADES_BENEFITS.mega_gem_probability(upgrades.mega_gem_tier) / 100)) {
                            megaPokemon = Pokedex_1.default.megaEvolvablePokemons[Math.floor(Math.random() * Pokedex_1.default.megaEvolvablePokemons.length)];
                            megaGem = megaPokemon.megaEvolutions[Math.floor(Math.random() * megaPokemon.megaEvolutions.length)].megaStone;
                            defaultData_1 = {};
                            defaultData_1[interaction.user.id] = 1;
                            Util_1.default.database.query("\n\t\t\t\t\tINSERT INTO mega_gems VALUES ($1, $2)\n\t\t\t\t\tON CONFLICT (user_id)\n\t\t\t\t\tDO UPDATE SET gems = \n\t\t\t\t\t\tCASE\n\t\t\t\t\t\t\tWHEN mega_gems.gems -> $3 IS NULL THEN mega_gems.gems || $2\n\t\t\t\t\t\t\tELSE jsonb_set(mega_gems.gems, '{" + megaGem + "}', ((mega_gems.gems -> $3)::int + 1)::text::jsonb)\n\t\t\t\t\t\tEND\n\t\t\t\t\tWHERE mega_gems.user_id = EXCLUDED.user_id\n\t\t\t\t\t", [interaction.user.id, defaultData_1, megaGem]);
                        }
                    }
                    shiny = Math.random() < SHINY_FREQUENCY * (1 + (UPGRADES_BENEFITS.shiny_probability(upgrades.shiny_tier) / 100));
                    variation = randomPokemon.variations.some(function (variation) { return variation.suffix === "alola"; }) && Math.random() < ALOLAN_FREQUENCY
                        ? "alola"
                        : "default";
                    catchReward = Math.round(config_json_1.CATCH_REWARD * (255 / randomPokemon.catchRate
                        * (shiny ? config_json_1.SHINY_REWARD_MULTIPLIER : 1)
                        * (variation === "alola" ? config_json_1.ALOLAN_REWARD_MULTIPLIER : 1)));
                    defaultData = {};
                    defaultData[interaction.user.id] = {
                        caught: 1,
                        favorite: false,
                        nickname: null
                    };
                    defaultUserData = {
                        caught: 1,
                        favorite: false,
                        nickname: null
                    };
                    return [4 /*yield*/, Util_1.default.database.query("\n\t\t\tINSERT INTO pokemons VALUES ($1, $2, $3, $4)\n\t\t\tON CONFLICT (pokedex_id, shiny, variation)\n\t\t\tDO UPDATE SET users =\n\t\t\t\tCASE\n\t\t\t\t\tWHEN pokemons.users -> $5 IS NULL THEN jsonb_set(pokemons.users, '{" + interaction.user.id + "}', $6)\n\t\t\t\t\tELSE jsonb_set(pokemons.users, '{" + interaction.user.id + ", caught}', ((pokemons.users -> $5 -> 'caught')::int + 1)::text::jsonb)\n\t\t\t\tEND\n\t\t\tWHERE pokemons.pokedex_id = EXCLUDED.pokedex_id AND pokemons.shiny = EXCLUDED.shiny AND pokemons.variation = EXCLUDED.variation\n\t\t\tRETURNING (users -> $5 -> 'caught')::int AS caught\n\t\t\t", [
                            randomPokemon.nationalId,
                            shiny,
                            variation,
                            defaultData,
                            interaction.user.id,
                            defaultUserData
                        ])];
                case 7:
                    res = _a.sent();
                    Util_1.default.database.query("UPDATE pokemon_hunting SET hunt_count = hunt_count + 1 WHERE user_id = $1", [interaction.user.id]).catch(console.error);
                    Util_1.default.database.query("\n\t\t\tINSERT INTO currency VALUES ($1, $2)\n\t\t\tON CONFLICT (user_id)\n\t\t\tDO UPDATE SET money = currency.money + $2\n\t\t\tWHERE currency.user_id = EXCLUDED.user_id\n\t\t\t", [interaction.user.id, catchReward]).catch(console.error);
                    return [4 /*yield*/, interaction.reply({
                            embeds: [
                                {
                                    author: {
                                        name: res && res.rows[0].caught > 1 ? languageStrings.data.caught() : languageStrings.data.caught_new(),
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
                                    description: languageStrings.data.caught_title(interaction.user.toString(), !shiny && (variation === "alola" || /^[aeiou]/i.test(randomPokemon.names[languageStrings.language])), randomPokemon.formatName(shiny, variation, languageStrings.language), catchReward.toString()) + (megaGem ? languageStrings.data.mega_gem(megaGem) : ""),
                                    footer: {
                                        text: "✨ Mayze ✨" + (huntFooterText || ""),
                                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                    }
                                }
                            ],
                            fetchReply: true
                        })];
                case 8:
                    reply = _a.sent();
                    if (Util_1.default.beta)
                        return [2 /*return*/];
                    logChannel = interaction.client.channels.cache.get('839538540206882836');
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
                                        : 0x010101,
                                description: languageStrings.data.caught_title_en(interaction.user.toString(), !shiny && (variation === "alola" || /^[aeiou]/i.test(randomPokemon.names.en)), randomPokemon.formatName(shiny, variation, "en")),
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
