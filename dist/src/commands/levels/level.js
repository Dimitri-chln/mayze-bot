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
var getLevel_1 = __importDefault(require("../../utils/misc/getLevel"));
var command = {
    name: "level",
    description: {
        fr: "Obtenir ton niveau sur Mayze",
        en: "Get your chat level with Mayze"
    },
    userPermissions: [],
    botPermissions: ["EMBED_LINKS"],
    options: {
        fr: [
            {
                name: "user",
                description: "L'utilisateur dont tu veux voir le niveau",
                type: "USER",
                required: false
            }
        ],
        en: [
            {
                name: "user",
                description: "The user whose level you want to see",
                type: "USER",
                required: false
            }
        ]
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        var barSize, xpBar, user, chatLeaderboard, voiceLeaderboard, userChatData, chatXp, chatRank, chatLevel, userVoiceData, voiceXp, voiceRank, voiceLevel;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    barSize = 20, xpBar = {
                        full: "█",
                        empty: "▁"
                    };
                    user = (_a = interaction.options.getUser("user")) !== null && _a !== void 0 ? _a : interaction.user;
                    return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM levels ORDER BY chat_xp DESC")];
                case 1:
                    chatLeaderboard = (_b.sent()).rows;
                    return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM levels ORDER BY voice_xp DESC")];
                case 2:
                    voiceLeaderboard = (_b.sent()).rows;
                    chatLeaderboard = chatLeaderboard.filter(function (u) { return interaction.guild.members.cache.has(u.user_id); });
                    voiceLeaderboard = voiceLeaderboard.filter(function (u) { return interaction.guild.members.cache.has(u.user_id); });
                    userChatData = chatLeaderboard.find(function (u) { return u.user_id === user.id; });
                    chatXp = userChatData ? userChatData.chat_xp : 0;
                    chatRank = chatLeaderboard.indexOf(userChatData) + 1;
                    chatLevel = (0, getLevel_1.default)(chatXp);
                    userVoiceData = voiceLeaderboard.find(function (u) { return u.user_id === user.id; });
                    voiceXp = userVoiceData ? userVoiceData.voice_xp : 0;
                    voiceRank = voiceLeaderboard.indexOf(userVoiceData) + 1;
                    voiceLevel = (0, getLevel_1.default)(voiceXp);
                    interaction.reply({
                        embeds: [
                            {
                                author: {
                                    name: user.tag,
                                    iconURL: user.displayAvatarURL({ dynamic: true })
                                },
                                color: interaction.guild.me.displayColor,
                                fields: [
                                    {
                                        name: translations.data.chat_title(),
                                        value: translations.data.chat_description(chatLevel.level.toString(), chatRank.toString(), xpBar.full.repeat(Math.round(chatLevel.currentXP / chatLevel.neededXP * barSize)) + xpBar.empty.repeat(barSize - Math.round(chatLevel.currentXP / chatLevel.neededXP * barSize)), chatLevel.currentXP.toString(), chatLevel.neededXP.toString()),
                                        inline: true
                                    },
                                    {
                                        name: translations.data.voice_title(),
                                        value: translations.data.voice_description(voiceLevel.level.toString(), voiceRank.toString(), xpBar.full.repeat(Math.round(voiceLevel.currentXP / voiceLevel.neededXP * barSize)) + xpBar.empty.repeat(barSize - Math.round(voiceLevel.currentXP / voiceLevel.neededXP * barSize)), voiceLevel.currentXP.toString(), voiceLevel.neededXP.toString()),
                                        inline: true
                                    }
                                ],
                                footer: {
                                    text: "✨ Mayze ✨"
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
