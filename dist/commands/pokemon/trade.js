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
var Util_1 = __importDefault(require("../../Util"));
var Pokedex_1 = __importDefault(require("../../types/pokemon/Pokedex"));
var command = {
    name: "trade",
    description: {
        fr: "Echanger des pokémons avec d'autres utilisateurs",
        en: "Trade pokémons with other users"
    },
    userPermissions: [],
    botPermissions: ["EMBED_LINKS"],
    options: {
        fr: [
            {
                name: "start",
                description: "Commencer un échange avec un autre utilisateur",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "L'utilisateur avec qui échanger",
                        type: "USER",
                        required: true
                    },
                    {
                        name: "offer",
                        description: "Les pokémons à offrir",
                        type: "STRING",
                        required: false
                    },
                    {
                        name: "demand",
                        description: "Les pokémons à demander",
                        type: "STRING",
                        required: false
                    }
                ]
            },
            {
                name: "block",
                description: "Bloquer un utilisateur pour l'empêcher d'échanger avec toi",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "L'utilisateur à bloquer",
                        type: "USER",
                        required: true
                    }
                ]
            },
            {
                name: "unblock",
                description: "Débloquer un utilisateur",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "L'utilisateur à débloquer",
                        type: "USER",
                        required: true
                    }
                ]
            }
        ],
        en: [
            {
                name: "start",
                description: "Start a trade with another user",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "The user to trade with",
                        type: "USER",
                        required: true
                    },
                    {
                        name: "offer",
                        description: "The pokémons to offer",
                        type: "STRING",
                        required: false
                    },
                    {
                        name: "demand",
                        description: "The pokémons to ask for",
                        type: "STRING",
                        required: false
                    }
                ]
            },
            {
                name: "block",
                description: "Block a user to prevent them from trading with you",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "The user to block",
                        type: "USER",
                        required: true
                    }
                ]
            },
            {
                name: "unblock",
                description: "Unblock a user",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "The user to unblock",
                        type: "USER",
                        required: true
                    }
                ]
            }
        ]
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        function checkValidPokemons(user1, pokemons1, user2, pokemons2) {
            return __awaiter(this, void 0, void 0, function () {
                var user1Pokemons, user2Pokemons, errors1, errors2, errors1fav, errors2fav, _loop_1, pokemons1_1, pokemons1_1_1, pokemon, _loop_2, pokemons2_1, pokemons2_1_1, pokemon;
                var e_1, _a, e_2, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM pokemons WHERE users ? $1", [user1.id])];
                        case 1:
                            user1Pokemons = (_c.sent()).rows;
                            return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM pokemons WHERE users ? $1", [user2.id])];
                        case 2:
                            user2Pokemons = (_c.sent()).rows;
                            errors1 = [], errors2 = [], errors1fav = [], errors2fav = [];
                            _loop_1 = function (pokemon) {
                                var pkm = user1Pokemons.find(function (p) { return p.pokedex_id === pokemon.data.nationalId && p.shiny === pokemon.shiny && p.variation === pokemon.variation; });
                                if (!pkm || pokemon.number > pkm.users[user1.id].caught)
                                    errors1.push("**" + (pkm ? (pokemon.number - pkm.users[user1.id].caught).toString() : pokemon.number.toString()) + " " + pokemon.data.formatName(pokemon.shiny, pokemon.variation, translations.language));
                                if (pkm && pkm.users[user1.id].favorite)
                                    errors1fav.push("**" + pokemon.data.formatName(pokemon.shiny, pokemon.variation, translations.language) + "**");
                            };
                            try {
                                for (pokemons1_1 = __values(pokemons1), pokemons1_1_1 = pokemons1_1.next(); !pokemons1_1_1.done; pokemons1_1_1 = pokemons1_1.next()) {
                                    pokemon = pokemons1_1_1.value;
                                    _loop_1(pokemon);
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (pokemons1_1_1 && !pokemons1_1_1.done && (_a = pokemons1_1.return)) _a.call(pokemons1_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                            _loop_2 = function (pokemon) {
                                var pkm = user2Pokemons.find(function (p) { return p.pokedex_id === pokemon.data.nationalId && p.shiny === pokemon.shiny && p.variation === pokemon.variation; });
                                if (!pkm || pokemon.number > pkm.users[user2.id].caught)
                                    errors2.push("**" + (pkm ? (pokemon.number - pkm.users[user2.id].caught).toString() : pokemon.number.toString()) + " " + pokemon.data.formatName(pokemon.shiny, pokemon.variation, translations.language));
                                if (pkm && pkm.users[user2.id].favorite)
                                    errors2fav.push("**" + pokemon.data.formatName(pokemon.shiny, pokemon.variation, translations.language) + "**");
                            };
                            try {
                                for (pokemons2_1 = __values(pokemons2), pokemons2_1_1 = pokemons2_1.next(); !pokemons2_1_1.done; pokemons2_1_1 = pokemons2_1.next()) {
                                    pokemon = pokemons2_1_1.value;
                                    _loop_2(pokemon);
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (pokemons2_1_1 && !pokemons2_1_1.done && (_b = pokemons2_1.return)) _b.call(pokemons2_1);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                            return [2 /*return*/, (errors1.length ? translations.data.not_enough(user1.username, errors1.join(", ")) : "")
                                    + (errors2.length ? translations.data.not_enough(user2.username, errors2.join(", ")) : "")
                                    + (errors1fav.length ? translations.data.favorite(user1.username, errors1fav.join(", "), errors1fav.length > 1) : "")
                                    + (errors2fav.length ? translations.data.favorite(user2.username, errors2fav.join(", "), errors2fav.length > 1) : "")];
                    }
                });
            });
        }
        var logChannel, subCommand, user, _a, _b, blocked, error_1, offer_1, demand_1, errors, trade_1, filter, collector_1, cancelledBy_1, accepted_1;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    logChannel = interaction.client.channels.cache.get(Util_1.default.config.TRADE_LOG_CHANNEL_ID);
                    subCommand = interaction.options.getSubcommand();
                    user = interaction.options.getUser("user");
                    if (user.id === interaction.user.id)
                        return [2 /*return*/, interaction.followUp({
                                content: translations.data.same_user(),
                                ephemeral: true
                            })];
                    _a = subCommand;
                    switch (_a) {
                        case "block": return [3 /*break*/, 1];
                        case "unblock": return [3 /*break*/, 2];
                        case "start": return [3 /*break*/, 3];
                    }
                    return [3 /*break*/, 7];
                case 1:
                    {
                        Util_1.default.database.query("\n\t\t\t\t\tINSERT INTO trade_block (user_id, blocked_user_id) VALUES ($1, $2)\n\t\t\t\t\tON CONFLICT (user_id, blocked_user_id)\n\t\t\t\t\tDO NOTHING\n\t\t\t\t\t", [interaction.user.id, user.id]);
                        interaction.followUp({
                            content: translations.data.blocked(user.tag),
                            ephemeral: true
                        });
                        return [3 /*break*/, 7];
                    }
                    _e.label = 2;
                case 2:
                    {
                        Util_1.default.database.query("DELETE FROM trade_block WHERE user_id = $1 AND blocked_user_id = $2", [interaction.user.id, user.id]);
                        interaction.followUp({
                            content: translations.data.unblocked(user.tag),
                            ephemeral: true
                        });
                        return [3 /*break*/, 7];
                    }
                    _e.label = 3;
                case 3: return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM trade_block WHERE user_id = $1 AND blocked_user_id = $2", [interaction.user.id, user.id])];
                case 4:
                    _b = __read.apply(void 0, [(_e.sent()).rows, 1]), blocked = _b[0];
                    if (blocked)
                        return [2 /*return*/, interaction.followUp({
                                content: translations.data.not_allowed(user.tag),
                                ephemeral: true
                            })];
                    error_1 = "";
                    offer_1 = interaction.options.getString("offer").split(/,(?: *)?/)
                        .map(function (input) {
                        var _a, _b;
                        var number = (_b = parseInt(((_a = input.match(/^(\d+) */)) !== null && _a !== void 0 ? _a : [])[1])) !== null && _b !== void 0 ? _b : 1;
                        var pokemon = Pokedex_1.default.findByNameWithVariation(input.replace(/^(\d+) */, ""));
                        if (pokemon)
                            return {
                                data: pokemon.pokemon,
                                number: number,
                                shiny: pokemon.shiny,
                                variation: pokemon.variationType,
                            };
                        else
                            error_1 += translations.data.invalid_pokemon(input.replace(/^(\d+) */, ""));
                    })
                        .filter(function (p) { return p; })
                        // Filter duplicates
                        .filter(function (p, i, a) { return i === a.findIndex(function (v) { return p.data.nationalId === v.data.nationalId && p.shiny === v.shiny && p.variation === v.variation; }); });
                    demand_1 = interaction.options.getString("demand").split(/,(?: *)?/)
                        .map(function (input) {
                        var _a, _b;
                        var number = (_b = parseInt(((_a = input.match(/^(\d+) */)) !== null && _a !== void 0 ? _a : [])[1])) !== null && _b !== void 0 ? _b : 1;
                        var pokemon = Pokedex_1.default.findByNameWithVariation(input.replace(/^(\d+) */, ""));
                        if (pokemon)
                            return {
                                data: pokemon.pokemon,
                                number: number,
                                shiny: pokemon.shiny,
                                variation: pokemon.variationType,
                            };
                        else
                            error_1 += translations.data.invalid_pokemon(input.replace(/^(\d+) */, ""));
                    })
                        .filter(function (p) { return p; })
                        // Filter duplicates
                        .filter(function (p, i, a) { return i === a.findIndex(function (v) { return p.data.nationalId === v.data.nationalId && p.shiny === v.shiny && p.variation === v.variation; }); });
                    if (!offer_1.length && !demand_1.length)
                        return [2 /*return*/, interaction.followUp({
                                content: translations.data.empty_trade(),
                                ephemeral: true
                            })];
                    if (error_1)
                        return [2 /*return*/, interaction.followUp({
                                content: error_1,
                                ephemeral: true
                            })];
                    return [4 /*yield*/, checkValidPokemons(interaction.user, offer_1, user, demand_1)];
                case 5:
                    errors = _e.sent();
                    if (errors)
                        return [2 /*return*/, interaction.followUp(errors)];
                    return [4 /*yield*/, interaction.followUp({
                            content: user.toString(),
                            embeds: [
                                {
                                    author: {
                                        name: translations.data.title(interaction.user.tag, user.tag),
                                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                    },
                                    color: interaction.guild.me.displayColor,
                                    // U+00d7 : ×
                                    fields: [
                                        {
                                            name: translations.data.offer(interaction.user.username, false),
                                            value: "```\n" + ((_c = offer_1.map(function (pkm) { return "\u00D7" + pkm.number + " " + pkm.data.formatName(pkm.shiny, pkm.variation, translations.language); }).join("\n")) !== null && _c !== void 0 ? _c : "Ø") + "\n```",
                                            inline: true
                                        },
                                        {
                                            name: translations.data.demand(user.username, false),
                                            value: "```\n" + ((_d = demand_1.map(function (pkm) { return "\u00D7" + pkm.number + " " + pkm.data.formatName(pkm.shiny, pkm.variation, translations.language); }).join("\n")) !== null && _d !== void 0 ? _d : "Ø") + "\n```",
                                            inline: true
                                        }
                                    ],
                                    footer: {
                                        text: "\u2728 Mayze \u2728 | " + translations.data.footer()
                                    }
                                }
                            ],
                            components: [
                                {
                                    type: "ACTION_ROW",
                                    components: [
                                        {
                                            type: "BUTTON",
                                            customId: "accept",
                                            emoji: "✅",
                                            style: "SUCCESS"
                                        },
                                        {
                                            type: "BUTTON",
                                            customId: "deny",
                                            emoji: "❌",
                                            style: "DANGER"
                                        }
                                    ]
                                }
                            ],
                            fetchReply: true
                        })];
                case 6:
                    trade_1 = _e.sent();
                    filter = function (buttonInteraction) { return buttonInteraction.user.id === interaction.user.id || buttonInteraction.user.id === user.id; };
                    collector_1 = trade_1.createMessageComponentCollector({ filter: filter, componentType: "BUTTON", time: 120000 });
                    accepted_1 = [false, false];
                    collector_1.on("collect", function (buttonInteraction) { return __awaiter(void 0, void 0, void 0, function () {
                        var index;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (buttonInteraction.customId) {
                                case "deny": {
                                    cancelledBy_1 = buttonInteraction.user;
                                    collector_1.stop();
                                    break;
                                }
                                case "accept": {
                                    index = buttonInteraction.user.id === interaction.user.id ? 0 : 1;
                                    accepted_1[index] = true;
                                    trade_1.edit({
                                        content: trade_1.content,
                                        embeds: [
                                            {
                                                author: {
                                                    name: translations.data.title(interaction.user.tag, user.tag),
                                                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                                },
                                                color: interaction.guild.me.displayColor,
                                                // U+00d7 : ×
                                                fields: [
                                                    {
                                                        name: translations.data.offer(interaction.user.username, accepted_1[0]),
                                                        value: "```\n" + ((_a = offer_1.map(function (pkm) { return "\u00D7" + pkm.number + " " + pkm.data.formatName(pkm.shiny, pkm.variation, translations.language); }).join("\n")) !== null && _a !== void 0 ? _a : "Ø") + "\n```",
                                                        inline: true
                                                    },
                                                    {
                                                        name: translations.data.demand(user.username, accepted_1[1]),
                                                        value: "```\n" + ((_b = demand_1.map(function (pkm) { return "\u00D7" + pkm.number + " " + pkm.data.formatName(pkm.shiny, pkm.variation, translations.language); }).join("\n")) !== null && _b !== void 0 ? _b : "Ø") + "\n```",
                                                        inline: true
                                                    }
                                                ],
                                                footer: {
                                                    text: "\u2728 Mayze \u2728 | " + translations.data.footer()
                                                }
                                            }
                                        ],
                                        components: trade_1.components
                                    });
                                    if (accepted_1.every(function (v) { return v; }))
                                        collector_1.stop();
                                    break;
                                }
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    collector_1.on("end", function () { return __awaiter(void 0, void 0, void 0, function () {
                        var errorsNew, offerSuccess, _loop_3, offer_2, offer_2_1, pkm, demandSuccess, _loop_4, demand_2, demand_2_1, pkm;
                        var e_3, _a, e_4, _b;
                        var _c, _d;
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0:
                                    trade_1.edit({
                                        content: trade_1.content,
                                        embeds: trade_1.embeds,
                                        components: [
                                            {
                                                type: "ACTION_ROW",
                                                components: [
                                                    {
                                                        type: "BUTTON",
                                                        customId: "accept",
                                                        emoji: "✅",
                                                        style: "SUCCESS",
                                                        disabled: true
                                                    },
                                                    {
                                                        type: "BUTTON",
                                                        customId: "deny",
                                                        emoji: "❌",
                                                        style: "DANGER",
                                                        disabled: true
                                                    }
                                                ]
                                            }
                                        ]
                                    });
                                    if (!accepted_1.every(function (v) { return v; })) {
                                        interaction.followUp(translations.data.cancelled(cancelledBy_1 === null || cancelledBy_1 === void 0 ? void 0 : cancelledBy_1.username));
                                        return [2 /*return*/];
                                    }
                                    ;
                                    return [4 /*yield*/, checkValidPokemons(interaction.user, offer_1, user, demand_1)];
                                case 1:
                                    errorsNew = _e.sent();
                                    if (errorsNew) {
                                        interaction.followUp(errorsNew);
                                        return [2 /*return*/];
                                    }
                                    offerSuccess = [];
                                    _loop_3 = function (pkm) {
                                        var defaultUserData = {
                                            caught: pkm.number,
                                            favorite: false,
                                            nickname: null
                                        };
                                        var s = [];
                                        Util_1.default.database.query("\n\t\t\t\t\t\t\tUPDATE pokemons\n\t\t\t\t\t\t\tSET users =\n\t\t\t\t\t\t\t\tCASE\n\t\t\t\t\t\t\t\t\tWHEN (users -> $1 -> 'caught')::int = $2 THEN users - $1\n\t\t\t\t\t\t\t\t\tELSE jsonb_set(users, '{" + interaction.user.id + ", caught}', ((users -> $1 -> 'caught')::int - $2)::text::jsonb)\n\t\t\t\t\t\t\t\tEND\n\t\t\t\t\t\t\tWHERE pokedex_id = $3 AND shiny = $4 AND variation = $5\n\t\t\t\t\t\t\t", [interaction.user.id, pkm.number, pkm.data.nationalId, pkm.shiny, pkm.variation])
                                            .then(function () { return s.push(true); })
                                            .catch(function (err) {
                                            console.error(err);
                                            s.push(false);
                                        });
                                        Util_1.default.database.query("\n\t\t\t\t\t\t\tUPDATE pokemons\n\t\t\t\t\t\t\tSET users =\n\t\t\t\t\t\t\t\tCASE\n\t\t\t\t\t\t\t\t\tWHEN users -> $1 IS NULL THEN jsonb_set(users, '{" + user.id + "}', $3)\n\t\t\t\t\t\t\t\t\tELSE jsonb_set(users, '{" + user.id + ", caught}', ((users -> $1 -> 'caught')::int + $2)::text::jsonb)\n\t\t\t\t\t\t\t\tEND\n\t\t\t\t\t\t\tWHERE pokedex_id = $4 AND shiny = $5 AND variation = $6\n\t\t\t\t\t\t\t", [user.id, pkm.number, defaultUserData, pkm.data.nationalId, pkm.shiny, pkm.variation])
                                            .then(function () { return s.push(true); })
                                            .catch(function (err) {
                                            console.error(err);
                                            s.push(false);
                                        });
                                        offerSuccess.push(s);
                                    };
                                    try {
                                        for (offer_2 = __values(offer_1), offer_2_1 = offer_2.next(); !offer_2_1.done; offer_2_1 = offer_2.next()) {
                                            pkm = offer_2_1.value;
                                            _loop_3(pkm);
                                        }
                                    }
                                    catch (e_3_1) { e_3 = { error: e_3_1 }; }
                                    finally {
                                        try {
                                            if (offer_2_1 && !offer_2_1.done && (_a = offer_2.return)) _a.call(offer_2);
                                        }
                                        finally { if (e_3) throw e_3.error; }
                                    }
                                    demandSuccess = [];
                                    _loop_4 = function (pkm) {
                                        var defaultUserData = {
                                            caught: pkm.number,
                                            favorite: false,
                                            nickname: null
                                        };
                                        var s = [];
                                        Util_1.default.database.query("\n\t\t\t\t\t\t\tUPDATE pokemons\n\t\t\t\t\t\t\tSET users =\n\t\t\t\t\t\t\t\tCASE\n\t\t\t\t\t\t\t\t\tWHEN (users -> $1 -> 'caught')::int = $2 THEN users - $1\n\t\t\t\t\t\t\t\t\tELSE jsonb_set(users, '{" + user.id + ", caught}', ((users -> $1 -> 'caught')::int - $2)::text::jsonb)\n\t\t\t\t\t\t\t\tEND\n\t\t\t\t\t\t\tWHERE pokedex_id = $3 AND shiny = $4 AND variation = $5\n\t\t\t\t\t\t\t", [user.id, pkm.number, pkm.data.nationalId, pkm.shiny, pkm.variation])
                                            .then(function () { return s.push(true); })
                                            .catch(function (err) {
                                            console.error(err);
                                            s.push(false);
                                        });
                                        Util_1.default.database.query("\n\t\t\t\t\t\t\tUPDATE pokemons\n\t\t\t\t\t\t\tSET users =\n\t\t\t\t\t\t\t\tCASE\n\t\t\t\t\t\t\t\t\tWHEN users -> $1 IS NULL THEN jsonb_set(users, '{" + interaction.user.id + "}', $3)\n\t\t\t\t\t\t\t\t\tELSE jsonb_set(users, '{" + interaction.user.id + ", caught}', ((users -> $1 -> 'caught')::int + $2)::text::jsonb)\n\t\t\t\t\t\t\t\tEND\n\t\t\t\t\t\t\tWHERE pokedex_id = $4 AND shiny = $5 AND variation = $6\n\t\t\t\t\t\t\t", [interaction.user.id, pkm.number, defaultUserData, pkm.data.nationalId, pkm.shiny, pkm.variation])
                                            .then(function () { return s.push(true); })
                                            .catch(function (err) {
                                            console.error(err);
                                            s.push(false);
                                        });
                                        demandSuccess.push(s);
                                    };
                                    try {
                                        for (demand_2 = __values(demand_1), demand_2_1 = demand_2.next(); !demand_2_1.done; demand_2_1 = demand_2.next()) {
                                            pkm = demand_2_1.value;
                                            _loop_4(pkm);
                                        }
                                    }
                                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                                    finally {
                                        try {
                                            if (demand_2_1 && !demand_2_1.done && (_b = demand_2.return)) _b.call(demand_2);
                                        }
                                        finally { if (e_4) throw e_4.error; }
                                    }
                                    // Dummy request to await all other ones
                                    return [4 /*yield*/, Util_1.default.database.query("SELECT pokedex_id FROM pokemons WHERE pokedex_id = 0").catch(console.error)];
                                case 2:
                                    // Dummy request to await all other ones
                                    _e.sent();
                                    logChannel.send({
                                        embeds: [
                                            {
                                                author: {
                                                    name: interaction.user.tag + " / " + user.tag,
                                                    url: trade_1.url,
                                                    iconURL: interaction.guild.iconURL({ dynamic: true })
                                                },
                                                color: Util_1.default.config.MAIN_COLOR,
                                                fields: [
                                                    {
                                                        name: "Offer:",
                                                        value: "```\n" + ((_c = offer_1.map(function (pkm, i) { return "\u00D7" + pkm.number + " " + pkm.data.formatName(pkm.shiny, pkm.variation, translations.language) + " - " + offerSuccess[i].map(function (s) { return s ? "✅" : "❌"; }).join(" "); }).join("\n")) !== null && _c !== void 0 ? _c : "Ø") + "\n```",
                                                        inline: true
                                                    },
                                                    {
                                                        name: "Demand:",
                                                        value: "```\n" + ((_d = demand_1.map(function (pkm, i) { return "\u00D7" + pkm.number + " " + pkm.data.formatName(pkm.shiny, pkm.variation, translations.language) + " - " + demandSuccess[i].map(function (s) { return s ? "✅" : "❌"; }).join(" "); }).join("\n")) !== null && _d !== void 0 ? _d : "Ø") + "\n```",
                                                        inline: true
                                                    }
                                                ],
                                                footer: {
                                                    text: "✨ Mayze ✨"
                                                }
                                            }
                                        ]
                                    }).catch(console.error);
                                    interaction.followUp(translations.data.trade_complete());
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); }
};
exports.default = command;
