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
Object.defineProperty(exports, "__esModule", { value: true });
var command = {
    name: "slots",
    description: {
        fr: "Joue à une partie de casino",
        en: "Play a slots game",
    },
    userPermissions: [],
    botPermissions: ["EMBED_LINKS", "MANAGE_ROLES", "KICK_MEMBERS"],
    cooldown: 5,
    guildIds: ["689164798264606784"],
    options: {
        fr: [],
        en: []
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        function randomSlot() {
            var random = SLOTS[Math.floor(Math.random() * SLOTS.length)];
            SLOTS.push(random);
            result.push(random);
            return random;
        }
        var SPINNING, SLOTS, result, reply;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    SPINNING = interaction.client.emojis.cache.get('845009613664288769').toString();
                    SLOTS = ["🥊", "⛓️", "🔇", "🏓", "🔒"];
                    result = [];
                    return [4 /*yield*/, interaction.followUp({
                            embeds: [
                                {
                                    author: {
                                        name: translations.data.title(),
                                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                    },
                                    color: interaction.guild.me.displayColor,
                                    description: SPINNING + SPINNING + SPINNING,
                                    footer: {
                                        text: "✨ Mayze ✨"
                                    }
                                }
                            ],
                            fetchReply: true
                        })];
                case 1:
                    reply = _a.sent();
                    setTimeout(function () {
                        interaction.editReply({
                            embeds: [reply.embeds[0].setDescription(randomSlot() + SPINNING + SPINNING)]
                        });
                        setTimeout(function () {
                            interaction.editReply({
                                embeds: [reply.embeds[0].setDescription(result[0] + randomSlot() + SPINNING)]
                            });
                            setTimeout(function () {
                                interaction.editReply({
                                    embeds: [reply.embeds[0].setDescription(result[0] + result[1] + randomSlot())]
                                });
                                setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                                    var _a, jailedRole, unJailedRoles, jailedRoles, duration, filter, collected_1, messages, i, _b, _c, filter, collected;
                                    return __generator(this, function (_d) {
                                        switch (_d.label) {
                                            case 0:
                                                if (result[0] !== result[1] || result[1] !== result[2])
                                                    return [2 /*return*/];
                                                _a = result[0];
                                                switch (_a) {
                                                    case "🥊": return [3 /*break*/, 1];
                                                    case "⛓️": return [3 /*break*/, 2];
                                                    case "🔇": return [3 /*break*/, 5];
                                                    case "🏓": return [3 /*break*/, 6];
                                                    case "🔒": return [3 /*break*/, 9];
                                                }
                                                return [3 /*break*/, 11];
                                            case 1:
                                                {
                                                    if (interaction.member.roles.highest.position >= interaction.guild.me.roles.highest.position)
                                                        return [2 /*return*/];
                                                    if (interaction.member.premiumSinceTimestamp)
                                                        return [2 /*return*/];
                                                    interaction.member.kick(translations.data.reason());
                                                    return [3 /*break*/, 11];
                                                }
                                                _d.label = 2;
                                            case 2:
                                                if (interaction.channel.id === "695934227140837386")
                                                    return [2 /*return*/];
                                                if (interaction.member.roles.highest.position >= interaction.guild.me.roles.highest.position)
                                                    return [2 /*return*/];
                                                jailedRole = interaction.guild.roles.cache.get("695943648235487263");
                                                unJailedRoles = interaction.member.roles.cache.filter(function (role) { return interaction.guild.roles.cache.some(function (r) { return r.name === role.name + " (Jailed)"; }); });
                                                jailedRoles = interaction.guild.roles.cache.filter(function (role) { return interaction.member.roles.cache.some(function (r) { return role.name === r.name + " (Jailed)"; }); });
                                                jailedRoles.set(jailedRole.id, jailedRole);
                                                return [4 /*yield*/, interaction.member.roles.remove(unJailedRoles).catch(console.error)];
                                            case 3:
                                                _d.sent();
                                                return [4 /*yield*/, interaction.member.roles.add(jailedRoles).catch(console.error)];
                                            case 4:
                                                _d.sent();
                                                return [3 /*break*/, 11];
                                            case 5:
                                                {
                                                    if (interaction.member.roles.highest.position >= interaction.guild.me.roles.highest.position)
                                                        return [2 /*return*/];
                                                    duration = Math.ceil(Math.random() * 10) * 60 * 1000;
                                                    interaction.member.timeout(duration, translations.data.reason());
                                                    return [3 /*break*/, 11];
                                                }
                                                _d.label = 6;
                                            case 6:
                                                interaction.followUp(translations.data.spam_ping());
                                                filter = function (msg) { return msg.author.id === interaction.user.id && msg.mentions.users.size > 0; };
                                                return [4 /*yield*/, interaction.channel.awaitMessages({ filter: filter, max: 1, time: 120000 })];
                                            case 7:
                                                collected_1 = _d.sent();
                                                if (!collected_1 || !collected_1.size)
                                                    return [2 /*return*/, interaction.followUp({
                                                            content: translations.data.too_late(),
                                                            ephemeral: true
                                                        })];
                                                messages = [];
                                                for (i = 0; i < 25; i++) {
                                                    messages.push(new Promise(function (resolve, reject) {
                                                        interaction.channel.send(collected_1.first().mentions.users.first().toString())
                                                            .then(function (msg) { return resolve(msg); })
                                                            .catch(function () { return resolve(null); });
                                                    }));
                                                }
                                                _c = (_b = interaction.channel).bulkDelete;
                                                return [4 /*yield*/, Promise.all(messages)];
                                            case 8:
                                                _c.apply(_b, [(_d.sent()).filter(function (msg) { return msg; }),
                                                    true]);
                                                return [3 /*break*/, 11];
                                            case 9:
                                                interaction.followUp(translations.data.timeout());
                                                filter = function (msg) { return msg.author.id === interaction.user.id && msg.mentions.users.size > 0; };
                                                return [4 /*yield*/, interaction.channel.awaitMessages({ filter: filter, max: 1, time: 120000 })];
                                            case 10:
                                                collected = _d.sent();
                                                if (!collected || !collected.size)
                                                    return [2 /*return*/, interaction.followUp({
                                                            content: translations.data.too_late(),
                                                            ephemeral: true
                                                        })];
                                                interaction.guild.members.cache.get(collected.first().mentions.users.first().id).timeout(120000);
                                                return [3 /*break*/, 11];
                                            case 11: return [2 /*return*/];
                                        }
                                    });
                                }); }, 2000);
                            }, 2000);
                        }, 2000);
                    }, 2000);
                    return [2 /*return*/];
            }
        });
    }); }
};
exports.default = command;
