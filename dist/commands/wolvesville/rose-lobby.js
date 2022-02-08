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
var cron_1 = require("cron");
var command = {
    name: "rose-lobby",
    description: {
        fr: "Créer et gérer les games de roses",
        en: "Create and manage rose lobbies"
    },
    userPermissions: ["ADMINISTRATOR"],
    botPermissions: ["ADD_REACTIONS", "USE_EXTERNAL_EMOJIS", "MANAGE_ROLES"],
    guildIds: [Util_1.default.config.MAIN_GUILD_ID],
    options: {
        fr: [
            {
                name: "create",
                description: "Créer une game de roses",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "password",
                        description: "Le mot de passe de la game de roses",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "message",
                        description: "L'ID du message sous lequel les membres devront réagir",
                        type: "STRING",
                        required: false
                    }
                ]
            },
            {
                name: "end",
                description: "Terminer une game de roses",
                type: "SUB_COMMAND"
            }
        ],
        en: [
            {
                name: "create",
                description: "Create a rose lobby",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "password",
                        description: "The lobby's password",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "message",
                        description: "The ID of the message below which members will need to react",
                        type: "STRING",
                        required: false
                    }
                ]
            },
            {
                name: "end",
                description: "End a rose lobby",
                type: "SUB_COMMAND"
            }
        ]
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        var announcementChannel, logChannel, subCommand, _a, announcementId, announcement, date, password_1, annoucements;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    announcementChannel = interaction.client.channels.cache.get("817365433509740554");
                    logChannel = interaction.client.channels.cache.get("856901268445069322");
                    if (interaction.channel.id !== announcementChannel.id)
                        return [2 /*return*/, interaction.followUp({
                                content: translations.data.wrong_channel(),
                                ephemeral: true
                            })];
                    subCommand = interaction.options.getSubcommand();
                    _a = subCommand;
                    switch (_a) {
                        case "create": return [3 /*break*/, 1];
                        case "end": return [3 /*break*/, 3];
                    }
                    return [3 /*break*/, 7];
                case 1:
                    announcementId = interaction.options.getString("message");
                    return [4 /*yield*/, interaction.channel.messages.fetch(announcementId)];
                case 2:
                    announcement = _b.sent();
                    if (!announcement)
                        return [2 /*return*/, interaction.followUp({
                                content: translations.data.invalid_message_id(),
                                ephemeral: true
                            })];
                    announcement.react("833620353133707264");
                    date = new Date(parseInt(announcement.content.match(/<t:(\d+)(?::[tTdDfFR])?>/)[1]));
                    if (!date)
                        return [2 /*return*/, interaction.followUp({
                                content: translations.data.no_date(),
                                ephemeral: true
                            })];
                    if (Date.now() > date.valueOf())
                        return [2 /*return*/, interaction.followUp({
                                content: translations.data.date_passed(),
                                ephemeral: true
                            })];
                    password_1 = interaction.options.getString("password").toUpperCase();
                    if (Util_1.default.roseLobby)
                        Util_1.default.roseLobby.stop();
                    Util_1.default.roseLobby = new cron_1.CronJob(date, function () {
                        announcementChannel.send(translations.data.annoucement(password_1)).catch(console.error);
                        logChannel.messages.fetch({ limit: 1 }).then(function (messages) {
                            var logMessage = messages.first();
                            logMessage.edit("~~" + logMessage.content + "~~").catch(console.error);
                        });
                    });
                    Util_1.default.roseLobby.start();
                    logChannel.send("**Starting at:** `" + date.toUTCString() + "`\n**Password:** `" + password_1 + "`").catch(console.error);
                    return [3 /*break*/, 7];
                case 3:
                    interaction.followUp(translations.data.ending());
                    return [4 /*yield*/, announcementChannel.messages.fetch({ limit: 100 })];
                case 4:
                    annoucements = _b.sent();
                    return [4 /*yield*/, Promise.all(annoucements.filter(function (m) { return m.reactions.cache.has("833620353133707264"); })
                            .map(function (m) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, m.reactions.cache.get("833620353133707264").remove()];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); }))];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, Promise.all(interaction.guild.members.cache.filter(function (m) { return m.roles.cache.has("833620668066693140"); })
                            .map(function (member) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, member.roles.remove("833620668066693140")];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); }))];
                case 6:
                    _b.sent();
                    interaction.editReply(translations.data.ended());
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); }
};
exports.default = command;
