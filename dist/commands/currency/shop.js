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
var command = {
    name: "shop",
    description: {
        fr: "Acheter des améliorations pour Mayze",
        en: "Buy upgrades for Mayze"
    },
    userPermissions: [],
    botPermissions: ["EMBED_LINKS"],
    options: {
        fr: [
            {
                name: "list",
                description: "Voir la liste des objets et améliorations disponibles",
                type: "SUB_COMMAND"
            },
            {
                name: "buy",
                description: "Acheter un objet ou une amélioration dans le magasin",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "item",
                        description: "L'objet ou amélioration à acheter",
                        type: "STRING",
                        required: false,
                        choices: [
                            {
                                name: "Réduction du temps d'attente pour attraper un pokémon",
                                value: "catch_cooldown_reduction"
                            },
                            {
                                name: "Probabilité des nouveaux pokémons",
                                value: "new_pokemon_probability"
                            },
                            {
                                name: "Probabilité des pokémons légendaires et chimères",
                                value: "legendary_ub_probability"
                            },
                            {
                                name: "Probabilités des méga gemmes",
                                value: "mega_gem_probability"
                            },
                            {
                                name: "Probabilité des pokémons shiny",
                                value: "shiny_probability"
                            }
                        ]
                    },
                    {
                        name: "number",
                        description: "Le nombre d'objets ou d'améliorations à acheter",
                        type: "INTEGER",
                        required: false,
                        minValue: 1
                    }
                ]
            }
        ],
        en: [
            {
                name: "list",
                description: "See the list of available items and upgrades",
                type: "SUB_COMMAND"
            },
            {
                name: "buy",
                description: "Buy an item or upgrade from the shop",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "item",
                        description: "The item or upgrade to buy",
                        type: "STRING",
                        required: false,
                        choices: [
                            {
                                name: "Catch cooldown reduction",
                                value: "catch_cooldown_reduction"
                            },
                            {
                                name: "New pokémon probability",
                                value: "new_pokemon_probability"
                            },
                            {
                                name: "Legendary pokémon and ultra beast probability",
                                value: "legendary_ub_probability"
                            },
                            {
                                name: "Mega gem probability",
                                value: "mega_gem_probability"
                            },
                            {
                                name: "Shiny pokémon probability",
                                value: "shiny_probability"
                            }
                        ]
                    },
                    {
                        name: "number",
                        description: "The number of items or tiers to buy",
                        type: "INTEGER",
                        required: false,
                        minValue: 1
                    }
                ]
            }
        ]
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        var UPGRADES_PRICES, UPGRADES_BENEFITS, UPGRADES_MAX_TIER, upgradesData, _a, money, upgrades, subCommand, upgrade, number, upgradeCost;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    UPGRADES_PRICES = {
                        catch_cooldown_reduction: function (tier) { return 5000 + 2000 * tier; },
                        new_pokemon_probability: function (tier) { return 250 + 50 * tier; },
                        legendary_ub_probability: function (tier) { return 250 + 50 * tier; },
                        mega_gem_probability: function (tier) { return 250 + 50 * tier; },
                        shiny_probability: function (tier) { return 250 + 50 * tier; }
                    };
                    UPGRADES_BENEFITS = {
                        catch_cooldown_reduction: function (tier) { return 0.5 * tier; },
                        new_pokemon_probability: function (tier) { return 2 * tier; },
                        legendary_ub_probability: function (tier) { return 2 * tier; },
                        mega_gem_probability: function (tier) { return 2 * tier; },
                        shiny_probability: function (tier) { return 2 * tier; }
                    };
                    UPGRADES_MAX_TIER = {
                        catch_cooldown_reduction: 20,
                        new_pokemon_probability: 100,
                        legendary_ub_probability: 100,
                        mega_gem_probability: 100,
                        shiny_probability: 100
                    };
                    return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM upgrades WHERE user_id = $1", [interaction.user.id])];
                case 1:
                    upgradesData = (_d.sent()).rows;
                    return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM currency WHERE user_id = $1", [interaction.user.id])];
                case 2:
                    _a = __read.apply(void 0, [(_d.sent()).rows, 1]), money = _a[0];
                    upgrades = (_b = upgradesData[0]) !== null && _b !== void 0 ? _b : {
                        user_id: interaction.user.id,
                        catch_cooldown_reduction: 0,
                        new_pokemon_probability: 0,
                        legendary_ub_probability: 0,
                        mega_gem_probability: 0,
                        shiny_probability: 0
                    };
                    subCommand = interaction.options.getSubcommand();
                    switch (subCommand) {
                        case "list": {
                            interaction.reply({
                                embeds: [
                                    {
                                        author: {
                                            name: translations.data.title(),
                                            iconURL: interaction.client.user.displayAvatarURL()
                                        },
                                        color: interaction.guild.me.displayColor,
                                        title: translations.data.balance(money.money),
                                        fields: [
                                            {
                                                name: translations.data.catch_cooldown_reduction(),
                                                value: translations.data.field_cooldown(upgrades.catch_cooldown_reduction.toString(), UPGRADES_BENEFITS.catch_cooldown_reduction(upgrades.catch_cooldown_reduction).toString(), (Util_1.default.commands.get("catch").cooldown / 60).toString(), ((Util_1.default.commands.get("catch").cooldown / 60) - UPGRADES_BENEFITS.catch_cooldown_reduction(upgrades.catch_cooldown_reduction)).toString(), UPGRADES_PRICES.catch_cooldown_reduction(upgrades.catch_cooldown_reduction).toString(), upgrades.catch_cooldown_reduction === UPGRADES_MAX_TIER[upgrades.catch_cooldown_reduction]),
                                            },
                                            {
                                                name: translations.data.new_pokemon_probability(),
                                                value: translations.data.field(upgrades.new_pokemon_probability.toString(), UPGRADES_BENEFITS.new_pokemon_probability(upgrades.new_pokemon_probability).toString(), UPGRADES_PRICES.new_pokemon_probability(upgrades.new_pokemon_probability).toString(), upgrades.new_pokemon_probability === UPGRADES_MAX_TIER[upgrades.new_pokemon_probability])
                                            },
                                            {
                                                name: translations.data.legendary_ub_probability(),
                                                value: translations.data.field(upgrades.legendary_ub_probability.toString(), UPGRADES_BENEFITS.legendary_ub_probability(upgrades.legendary_ub_probability).toString(), UPGRADES_PRICES.legendary_ub_probability(upgrades.legendary_ub_probability).toString(), upgrades.legendary_ub_probability === UPGRADES_MAX_TIER[upgrades.legendary_ub_probability])
                                            },
                                            {
                                                name: translations.data.mega_gem_probability(),
                                                value: translations.data.field(upgrades.mega_gem_probability.toString(), UPGRADES_BENEFITS.mega_gem_probability(upgrades.mega_gem_probability).toString(), UPGRADES_PRICES.mega_gem_probability(upgrades.mega_gem_probability).toString(), upgrades.mega_gem_probability === UPGRADES_MAX_TIER[upgrades.mega_gem_probability])
                                            },
                                            {
                                                name: translations.data.shiny_probability(),
                                                value: translations.data.field(upgrades.shiny_probability.toString(), UPGRADES_BENEFITS.shiny_probability(upgrades.shiny_probability).toString(), UPGRADES_PRICES.shiny_probability(upgrades.shiny_probability).toString(), upgrades.shiny_probability === UPGRADES_MAX_TIER[upgrades.shiny_probability])
                                            }
                                        ],
                                        footer: {
                                            text: "✨ Mayze ✨"
                                        }
                                    }
                                ]
                            });
                            break;
                        }
                        case "buy": {
                            upgrade = interaction.options.getString("upgrade");
                            number = (_c = interaction.options.getInteger("number")) !== null && _c !== void 0 ? _c : 1;
                            upgradeCost = Math.round(number * (UPGRADES_PRICES[upgrade](upgrades[upgrade]) +
                                UPGRADES_PRICES[upgrade](upgrades[upgrade] + number - 1)) / 2);
                            if (money.money < upgradeCost)
                                return [2 /*return*/, interaction.reply({
                                        content: translations.data.not_enough_money(),
                                        ephemeral: true
                                    })];
                            if (upgrades[upgrade] + number > UPGRADES_MAX_TIER[upgrade])
                                return [2 /*return*/, interaction.reply({
                                        content: translations.data.max_tier_reached(),
                                        ephemeral: true
                                    })];
                            upgrades[upgrade] += number;
                            Util_1.default.database.query("UPDATE currency SET money = money - $2 WHERE user_id = $1", [interaction.user.id, upgradeCost]);
                            Util_1.default.database.query("\n\t\t\t\t\tINSERT INTO upgrades VALUES ($1, $2, $3, $4, $5, $6)\n\t\t\t\t\tON CONFLICT (user_id)\n\t\t\t\t\tDO UPDATE SET\n\t\t\t\t\t\tcatch_cooldown_reduction = $2,\n\t\t\t\t\t\tnew_pokemon_probability = $3,\n\t\t\t\t\t\tlegendary_ub_probability = $4,\n\t\t\t\t\t\tmega_gem_probability = $5,\n\t\t\t\t\t\tshiny_probability = $6\n\t\t\t\t\tWHERE upgrades.user_id = EXCLUDED.user_id\n\t\t\t\t\t", Object.values(upgrades));
                            interaction.reply(translations.data.new_tier(upgrades[upgrade], upgradeCost.toString()));
                            break;
                        }
                    }
                    return [2 /*return*/];
            }
        });
    }); }
};
exports.default = command;
