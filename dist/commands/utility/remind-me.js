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
var dhms_1 = __importDefault(require("dhms"));
var formatTime_1 = __importDefault(require("../../utils/misc/formatTime"));
var command = {
    name: "remind-me",
    description: {
        fr: "Gérer tes rappels",
        en: "Manage your reminders"
    },
    userPermissions: [],
    botPermissions: ["EMBED_LINKS"],
    options: {
        fr: [
            {
                name: "list",
                description: "Obtenir la liste de tes rappels",
                type: "SUB_COMMAND"
            },
            {
                name: "create",
                description: "Créer un rappel",
                type: "SUB_COMMAND_GROUP",
                options: [
                    {
                        name: "in",
                        description: "Créer un rappel à partir d'une durée",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "duration",
                                description: "La durée dans laquelle le rappel doit s'activer",
                                type: "STRING",
                                required: true
                            },
                            {
                                name: "reminder",
                                description: "Le rappel",
                                type: "STRING",
                                required: true
                            }
                        ]
                    },
                    {
                        name: "on",
                        description: "Créer un rappel à partir d'une date",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "date",
                                description: "La date à laquelle le rappel doit s'activer",
                                type: "STRING",
                                required: true
                            },
                            {
                                name: "reminder",
                                description: "Le rappel",
                                type: "STRING",
                                required: true
                            }
                        ]
                    },
                    {
                        name: "each",
                        description: "Créer un rappel qui se répétera à intervalles réguliers",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "duration",
                                description: "La durée entre chaque activation",
                                type: "STRING",
                                required: true
                            },
                            {
                                name: "reminder",
                                description: "Le rappel",
                                type: "STRING",
                                required: true
                            }
                        ]
                    }
                ]
            },
            {
                name: "remove",
                description: "Retirer un rappel",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "reminder",
                        description: "Le numéro du rappel",
                        type: "INTEGER",
                        required: true,
                        minValue: 1
                    }
                ]
            }
        ],
        en: [
            {
                name: "list",
                description: "Get the list of your reminders",
                type: "SUB_COMMAND"
            },
            {
                name: "create",
                description: "Create a reminder",
                type: "SUB_COMMAND_GROUP",
                options: [
                    {
                        name: "in",
                        description: "Create a reminder based on a duration",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "duration",
                                description: "The time before the reminder triggers",
                                type: "STRING",
                                required: true
                            },
                            {
                                name: "reminder",
                                description: "The reminder",
                                type: "STRING",
                                required: true
                            }
                        ]
                    },
                    {
                        name: "on",
                        description: "Create a reminder based on a date",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "date",
                                description: "The date which the reminder will trigger at",
                                type: "STRING",
                                required: true
                            },
                            {
                                name: "reminder",
                                description: "The reminder",
                                type: "STRING",
                                required: true
                            }
                        ]
                    },
                    {
                        name: "each",
                        description: "Create a reminder that will repeat based on a duration",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "duration",
                                description: "The time between each trigger",
                                type: "STRING",
                                required: true
                            },
                            {
                                name: "reminder",
                                description: "The reminder",
                                type: "STRING",
                                required: true
                            }
                        ]
                    }
                ]
            },
            {
                name: "remove",
                description: "Remove a reminder",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "reminder",
                        description: "The reminder's number",
                        type: "INTEGER",
                        required: true,
                        minValue: 1
                    }
                ]
            }
        ]
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        var subCommand, reminders, _a, duration, date, content, date, duration, content, duration, date, content, number;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    subCommand = interaction.options.getSubcommand();
                    return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM reminders WHERE user_id = $1", [interaction.user.id])];
                case 1:
                    reminders = (_b.sent()).rows;
                    _a = subCommand;
                    switch (_a) {
                        case "in": return [3 /*break*/, 2];
                        case "on": return [3 /*break*/, 4];
                        case "each": return [3 /*break*/, 6];
                        case "remove": return [3 /*break*/, 8];
                        case "list": return [3 /*break*/, 10];
                    }
                    return [3 /*break*/, 11];
                case 2:
                    duration = (0, dhms_1.default)(interaction.options.getString("duration"));
                    if (!duration)
                        return [2 /*return*/, interaction.followUp({
                                content: translations.data.invalid_duration(),
                                ephemeral: true
                            })];
                    date = new Date(Date.now() + duration);
                    content = interaction.options.getString("reminder");
                    if (!/^https?:\/\//.test(content))
                        content = content.replace(/^./, function (a) { return a.toUpperCase(); });
                    return [4 /*yield*/, Util_1.default.database.query("INSERT INTO reminders (user_id, timestamp, content) VALUES ($1, $2, $3)", [interaction.user.id, date, content])];
                case 3:
                    _b.sent();
                    interaction.followUp(translations.data.created((0, formatTime_1.default)(duration, translations.language), content));
                    return [3 /*break*/, 11];
                case 4:
                    date = new Date(interaction.options.getString("duration"));
                    if (!date)
                        return [2 /*return*/, interaction.followUp({
                                content: translations.data.invalid_date(),
                                ephemeral: true
                            })];
                    duration = date.valueOf() - Date.now();
                    content = interaction.options.getString("reminder");
                    if (!/^https?:\/\//.test(content))
                        content = content.replace(/^./, function (a) { return a.toUpperCase(); });
                    return [4 /*yield*/, Util_1.default.database.query("INSERT INTO reminders (user_id, timestamp, content) VALUES ($1, $2, $3)", [interaction.user.id, date, content])];
                case 5:
                    _b.sent();
                    interaction.followUp(translations.data.created((0, formatTime_1.default)(duration, translations.language), content));
                    return [3 /*break*/, 11];
                case 6:
                    duration = (0, dhms_1.default)(interaction.options.getString("duration"));
                    if (!duration)
                        return [2 /*return*/, interaction.followUp({
                                content: translations.data.invalid_duration(),
                                ephemeral: true
                            })];
                    date = new Date(Date.now() + duration);
                    content = interaction.options.getString("reminder");
                    if (!/^https?:\/\//.test(content))
                        content = content.replace(/^./, function (a) { return a.toUpperCase(); });
                    return [4 /*yield*/, Util_1.default.database.query("INSERT INTO reminders (user_id, timestamp, content, repeat) VALUES ($1, $2, $3, $4)", [interaction.user.id, date, content, duration])];
                case 7:
                    _b.sent();
                    interaction.followUp(translations.data.created((0, formatTime_1.default)(duration, translations.language), content));
                    return [3 /*break*/, 11];
                case 8:
                    number = interaction.options.getInteger("reminder");
                    if (number < 1 || number > reminders.length)
                        return [2 /*return*/, interaction.followUp({
                                content: translations.data.invalid_number(reminders.length.toString()),
                                ephemeral: true
                            })];
                    return [4 /*yield*/, Util_1.default.database.query("DELETE FROM reminders WHERE id = $1", [reminders[number - 1].id])];
                case 9:
                    _b.sent();
                    interaction.followUp(translations.data.removed());
                    return [3 /*break*/, 11];
                case 10:
                    {
                        interaction.followUp({
                            embeds: [
                                {
                                    author: {
                                        name: translations.data.title(interaction.user.tag),
                                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                    },
                                    color: interaction.guild.me.displayColor,
                                    description: reminders.length ? null : translations.data.no_reminder(),
                                    fields: reminders.map(function (reminder, i) {
                                        return {
                                            name: "`" + (i + 1) + ".` " + reminder.content,
                                            value: "<t:" + Math.round(Date.parse(reminder.timestamp) / 1000) + ":R>",
                                            inline: true
                                        };
                                    }),
                                    footer: {
                                        text: "✨ Mayze ✨"
                                    }
                                }
                            ]
                        });
                        return [3 /*break*/, 11];
                    }
                    _b.label = 11;
                case 11: return [2 /*return*/];
            }
        });
    }); }
};
exports.default = command;
