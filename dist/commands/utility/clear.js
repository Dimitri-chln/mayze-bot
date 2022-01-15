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
var discord_js_1 = require("discord.js");
var command = {
    name: "clear",
    description: {
        fr: "Supprimer des messages du salon actuel",
        en: "Delete messages from the current channel"
    },
    userPermissions: ["MANAGE_MESSAGES"],
    botPermissions: ["MANAGE_MESSAGES"],
    options: {
        fr: [
            {
                name: "number",
                description: "Le nombre de messages à supprimer",
                type: "INTEGER",
                required: true
            },
            {
                name: "user",
                description: "Ne supprimer que les messages de l'utilisateur donné",
                type: "USER",
                required: false
            },
            {
                name: "bot",
                description: "Ne supprimer que les messages envoyés par des bots",
                type: "BOOLEAN",
                required: false
            },
            {
                name: "regex",
                description: "Ne supprimer que les messages qui correspondent au regex donné",
                type: "STRING",
                required: false
            }
        ],
        en: [
            {
                name: "number",
                description: "The number of messages to delete",
                type: "INTEGER",
                required: true
            },
            {
                name: "user",
                description: "Delete only messages from the given user",
                type: "USER",
                required: false
            },
            {
                name: "bot",
                description: "Delete only messages from bots",
                type: "BOOLEAN",
                required: false
            },
            {
                name: "regex",
                description: "Delete only messages matching the given regex",
                type: "STRING",
                required: false
            }
        ]
    },
    run: function (interaction, languageStrings) { return __awaiter(void 0, void 0, void 0, function () {
        var number, messages, user, bot, regex, reply;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    number = interaction.options.getInteger("number");
                    if (isNaN(number) || number <= 0 || number > 100)
                        return [2 /*return*/, interaction.reply({
                                content: languageStrings.data.invalid_number(),
                                ephemeral: true
                            })];
                    return [4 /*yield*/, interaction.channel.messages.fetch({ limit: 100 })];
                case 1:
                    messages = _a.sent();
                    user = interaction.options.getUser("user");
                    if (user)
                        messages = messages.filter(function (msg) { return msg.author.id === user.id; });
                    bot = interaction.options.getBoolean("bot");
                    if (bot)
                        messages = messages.filter(function (msg) { return msg.author.bot; });
                    regex = new RegExp(interaction.options.getString("regex"), "i");
                    if (regex)
                        messages = messages.filter(function (msg) { return regex.test(msg.content); });
                    messages = new discord_js_1.Collection(messages.first(number).map(function (msg) { return [msg.id, msg]; }));
                    return [4 /*yield*/, interaction.channel.bulkDelete(messages, true)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, interaction.reply({
                            content: languageStrings.data.deleted(messages.size.toString(), messages.size > 1),
                            fetchReply: true
                        })];
                case 3:
                    reply = _a.sent();
                    setTimeout(reply.delete, 5000);
                    return [2 /*return*/];
            }
        });
    }); }
};
module.exports = command;
