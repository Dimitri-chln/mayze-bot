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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = this;
var _a = require("discord.js"), Message = _a.Message, TextChannel = _a.TextChannel;
var command = {
    name: "rose-lobby",
    description: "Ajouter une réaction au message d'annonce de la game de roses",
    aliases: ["rose"],
    args: 1,
    usage: "react [<ID message>] | end",
    botPerms: ["ADD_REACTIONS", "USE_EXTERNAL_EMOJIS", "MANAGE_MESSAGES", "MANAGE_ROLES"],
    onlyInGuilds: ["689164798264606784"],
    category: "wolvesville",
    disableSlash: true,
    /**
     * @param {Message} message
     * @param {string[]} args
     * @param {Object[]} options
     */
    run: function (message, args, options, language, languageCode) { return __awaiter(_this, void 0, void 0, function () {
        function secondstoTimestamp(match) {
            if (!match)
                return;
            return parseInt(match[1]) * 1000;
        }
        function chooseTime(del) {
            return __awaiter(this, void 0, void 0, function () {
                var m, filter, collected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, message.author.send("À quelle heure doit commencer la game de roses ? (`<t:...>`)").catch(console.error)];
                        case 1:
                            m = _a.sent();
                            if (!m)
                                return [2 /*return*/, message.reply("je n'ai pas pu te DM. As-tu désactivé les DM ?").catch(console.error)];
                            filter = function (rep) { return /<t:\d+(:[tTdDfFR])?>/.test(rep.content); };
                            return [4 /*yield*/, m.channel.awaitMessages(filter, { max: 1 }).catch(console.error)];
                        case 2:
                            collected = _a.sent();
                            time = collected.first().content;
                            timestamp_1 = secondstoTimestamp(time.match(/<t:(\d+)(?::[tTdDfFR])?>/));
                            if (!del) return [3 /*break*/, 4];
                            m.delete().catch(console.error);
                            return [4 /*yield*/, updateFinalMsg()];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        function choosePassword(del) {
            return __awaiter(this, void 0, void 0, function () {
                var m, filter, collected;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, message.author.send("Quel sera le mot de passe de la game ?").catch(console.error)];
                        case 1:
                            m = _a.sent();
                            if (!m)
                                return [2 /*return*/, message.reply("je n'ai pas pu te DM. As-tu désactivé les DM ?").catch(console.error)];
                            filter = function (rep) { return /.{1,12}/.test(rep.content); };
                            return [4 /*yield*/, m.channel.awaitMessages(filter, { max: 1 }).catch(console.error)];
                        case 2:
                            collected = _a.sent();
                            password_1 = collected.first().content.toUpperCase();
                            if (!del) return [3 /*break*/, 4];
                            m.delete().catch(console.error);
                            return [4 /*yield*/, updateFinalMsg()];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        function updateFinalMsg() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, finalMsg_1.edit({
                                embed: {
                                    author: {
                                        name: "Game de roses",
                                        iconURL: message.client.user.displayAvatarURL()
                                    },
                                    color: message.guild.me.displayColor,
                                    description: "**Le :** `<t:" + Math.round(timestamp_1 / 1000) + ">`\n**Mot de passe :** `" + password_1 + "`",
                                    footer: {
                                        text: "✨ Mayze ✨"
                                    }
                                }
                            }).catch(console.error)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        function getTimezoneOffset(tz) {
            var d = new Date();
            var parts = d.toLocaleString("ja", { timeZone: tz }).split(/[/\s:]/);
            parts[1]--;
            var utcDate = Date.UTC.apply(Date, __spreadArray([], __read(parts), false));
            var tzDate = new Date(d).setMilliseconds(0);
            return (utcDate - tzDate) / 60 / 60 / 1000;
        }
        function getDate(hourTime) {
            var _a = __read(hourTime.match(/(\d{1,2})h(\d{2})?/) || [], 3), hour = _a[1], _b = _a[2], minutes = _b === void 0 ? 0 : _b;
            var dateWithoutOffset = new Date();
            dateWithoutOffset.setUTCHours(hour);
            dateWithoutOffset.setUTCMinutes(minutes);
            dateWithoutOffset.setUTCSeconds(0);
            dateWithoutOffset.setUTCMilliseconds(0);
            var offset = getTimezoneOffset(TIMEZONE);
            var dateString = dateWithoutOffset.toISOString().replace(/Z$/, (offset > 0 ? "+" : "-") + Math.abs(offset).toString().padStart(2, "0") + ":00");
            return new Date(dateString);
        }
        var CronJob, TIMEZONE, announcementChannel, logChannel, subCommand, _a, msg, _b, timestamp_1, password_1, finalMsg_1, reactionFilter, collector_1, msgs;
        var _this = this;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    CronJob = require("cron").CronJob;
                    TIMEZONE = require("../../config.json").TIMEZONE;
                    announcementChannel = message.guild.channels.cache.get("817365433509740554");
                    logChannel = message.client.channels.cache.get("856901268445069322");
                    if (message.channel.id !== announcementChannel.id)
                        return [2 /*return*/];
                    subCommand = args[0].toLowerCase();
                    _a = subCommand;
                    switch (_a) {
                        case "react": return [3 /*break*/, 1];
                        case "end": return [3 /*break*/, 14];
                    }
                    return [3 /*break*/, 19];
                case 1: return [4 /*yield*/, message.delete()];
                case 2:
                    _c.sent();
                    if (!args[1]) return [3 /*break*/, 4];
                    return [4 /*yield*/, announcementChannel.messages.fetch(args[1]).catch(console.error)];
                case 3:
                    _b = (_c.sent());
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, announcementChannel.messages.fetch({ limit: 1 })];
                case 5:
                    _b = (_c.sent()).first();
                    _c.label = 6;
                case 6:
                    msg = _b;
                    if (!msg)
                        return [2 /*return*/, message.reply("ID invalide")
                                .then(function (m) { return m.delete({ timeout: 4000 }).catch(console.error); })
                                .catch(console.error)];
                    msg.react("833620353133707264").catch(console.error);
                    timestamp_1 = secondstoTimestamp(msg.content.match(/<t:(\d+)(?::[tTdDfFR])?>/));
                    if (!!timestamp_1) return [3 /*break*/, 8];
                    return [4 /*yield*/, chooseTime()];
                case 7:
                    _c.sent();
                    _c.label = 8;
                case 8: return [4 /*yield*/, choosePassword()];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, message.author.send({
                            embed: {
                                author: {
                                    name: "Game de roses",
                                    iconURL: message.client.user.displayAvatarURL()
                                },
                                color: message.guild.me.displayColor,
                                description: "**Le :** `<t:" + timestamp_1 / 1000 + ">`\n**Mot de passe :** `" + password_1 + "`",
                                footer: {
                                    text: "✨ Mayze ✨"
                                }
                            }
                        }).catch(console.error)];
                case 10:
                    finalMsg_1 = _c.sent();
                    if (!finalMsg_1)
                        return [2 /*return*/];
                    return [4 /*yield*/, finalMsg_1.react("✅").catch(console.error)];
                case 11:
                    _c.sent();
                    return [4 /*yield*/, finalMsg_1.react("⏱️").catch(console.error)];
                case 12:
                    _c.sent();
                    return [4 /*yield*/, finalMsg_1.react("#️⃣").catch(console.error)];
                case 13:
                    _c.sent();
                    reactionFilter = function (reaction, user) { return !user.bot && ["✅", "⏱️", "#️⃣"].includes(reaction.emoji.name); };
                    collector_1 = finalMsg_1.createReactionCollector(reactionFilter);
                    collector_1.on("collect", function (reaction, user) {
                        switch (reaction.emoji.name) {
                            case "✅":
                                var date = new Date(timestamp_1);
                                if (Date.now() > date.valueOf())
                                    return message.author.send("L'heure est déjà dépassée").catch(console.error);
                                if (message.client.roseTimer)
                                    message.client.roseTimer.stop();
                                message.client.roseTimer = new CronJob(date, function () {
                                    announcementChannel.send("<@&833620668066693140>\nLa game de roses va d\u00E9marrer, le mot de passe est `" + password_1 + "`").catch(console.error);
                                    logChannel.messages.fetch({ limit: 1 }).then(function (messages) {
                                        var logMessage = messages.first();
                                        logMessage.edit("~~" + logMessage.content + "~~").catch(console.error);
                                    });
                                });
                                message.client.roseTimer.start();
                                collector_1.stop();
                                message.author.send("Partie enregistrée").catch(console.error);
                                logChannel.send("**Starting at:** `" + date.toUTCString() + "`\n**Password:** `" + password_1 + "`").catch(console.error);
                                break;
                            case "⏱️":
                                chooseTime(true);
                                break;
                            case "#️⃣":
                                choosePassword(true);
                                break;
                        }
                    });
                    return [3 /*break*/, 20];
                case 14:
                    message.channel.startTyping(1);
                    return [4 /*yield*/, announcementChannel.messages.fetch({ limit: 100 }).catch(console.error)];
                case 15:
                    msgs = _c.sent();
                    if (!msgs) return [3 /*break*/, 17];
                    return [4 /*yield*/, Promise.all(msgs.filter(function (m) { return m.reactions.cache.has("833620353133707264"); })
                            .map(function (m) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, m.reactions.cache.get("833620353133707264").remove().catch(console.error)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); }))];
                case 16:
                    _c.sent();
                    _c.label = 17;
                case 17: return [4 /*yield*/, Promise.all(message.guild.members.cache.filter(function (m) { return m.roles.cache.has("833620668066693140"); })
                        .map(function (member) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, member.roles.remove("833620668066693140").catch(console.error)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    }); }); }))];
                case 18:
                    _c.sent();
                    message.channel.stopTyping();
                    message.channel.send("Game de roses terminée. Tous les rôles ont été retirés").catch(console.error);
                    return [3 /*break*/, 20];
                case 19:
                    message.reply("arguments incorrects").catch(console.error);
                    _c.label = 20;
                case 20: return [2 /*return*/];
            }
        });
    }); }
};
module.exports = command;
