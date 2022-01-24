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
var discord_js_1 = require("discord.js");
var formatTime_1 = __importDefault(require("../../utils/formatTime"));
var command = {
    name: "among-us",
    description: {
        fr: "Obtiens et gère les parties d'Among Us",
        en: "Get and manage Among Us games"
    },
    userPermissions: [],
    botPermissions: ["EMBED_LINKS", "ADD_REACTIONS"],
    options: {
        fr: [
            {
                name: "games",
                description: "Obtenir la liste des parties d'Among Us en cours",
                type: "SUB_COMMAND"
            },
            {
                name: "add",
                description: "Ajouter une partie d'Among Us",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "code",
                        description: "Le code de la partie",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "description",
                        description: "Une courte description de la partie",
                        type: "STRING",
                        required: false
                    }
                ]
            },
            {
                name: "delete",
                description: "Supprimer ta partie d'Among Us",
                type: "SUB_COMMAND"
            }
        ],
        en: [
            {
                name: "games",
                description: "Get the list of all ongoing games",
                type: "SUB_COMMAND"
            },
            {
                name: "add",
                description: "Add an Among Us game",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "code",
                        description: "The game's code",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "description",
                        description: "A short description of the game",
                        type: "STRING",
                        required: false
                    }
                ]
            },
            {
                name: "delete",
                description: "Delete your game code",
                type: "SUB_COMMAND"
            }
        ]
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        var subCommand, games, _a, _b, _c, code, description;
        var _d, _e;
        var _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    subCommand = interaction.options.getSubcommand();
                    games = (_f = Util_1.default.amongUsGames) !== null && _f !== void 0 ? _f : new discord_js_1.Collection();
                    _a = subCommand;
                    switch (_a) {
                        case "games": return [3 /*break*/, 1];
                        case "add": return [3 /*break*/, 3];
                        case "delete": return [3 /*break*/, 4];
                    }
                    return [3 /*break*/, 5];
                case 1:
                    _c = (_b = interaction).reply;
                    _d = {};
                    _e = {
                        author: {
                            name: translations.data.ongoing_games(),
                            iconURL: interaction.client.user.displayAvatarURL()
                        },
                        color: interaction.guild.me.displayColor
                    };
                    return [4 /*yield*/, Promise.all(games.map(function (game, userId) { return __awaiter(void 0, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = {};
                                        return [4 /*yield*/, interaction.client.users.fetch(userId)];
                                    case 1: return [2 /*return*/, (_a.name = (_b.sent()).tag,
                                            _a.value = "**" + game.code + "**\n*" + game.description + "*\n(" + translations.data.time_ago((0, formatTime_1.default)(Date.now() - game.time, translations.language)) + ")",
                                            _a.inline = false,
                                            _a)];
                                }
                            });
                        }); }))];
                case 2:
                    _c.apply(_b, [(_d.embeds = [
                            (_e.fields = (_g = _j.sent()) !== null && _g !== void 0 ? _g : [{
                                    name: translations.data.no_ongoing_game(),
                                    value: "\u200b",
                                    inline: false
                                }],
                                _e.footer = {
                                    text: "✨ Mayze ✨"
                                },
                                _e)
                        ],
                            _d)]);
                    return [3 /*break*/, 5];
                case 3:
                    {
                        code = interaction.options.getString("code").toUpperCase();
                        description = (_h = interaction.options.getString("description")) !== null && _h !== void 0 ? _h : translations.data.default_description();
                        if (!/^\w{6}$/.test(code))
                            return [2 /*return*/, interaction.reply({
                                    content: translations.data.invalid_code(),
                                    ephemeral: true
                                }).catch(console.error)];
                        games.set(interaction.user.id, {
                            code: code,
                            description: description,
                            time: Date.now(),
                        });
                        interaction.reply({
                            content: translations.data.game_added(),
                            ephemeral: true
                        }).catch(console.error);
                        return [3 /*break*/, 5];
                    }
                    _j.label = 4;
                case 4:
                    {
                        if (!games.has(interaction.user.id))
                            return [2 /*return*/, interaction.reply({
                                    content: translations.data.user_has_no_game(),
                                    ephemeral: true
                                }).catch(console.error)];
                        games.delete(interaction.user.id);
                        interaction.reply({
                            content: translations.data.game_deleted(),
                            ephemeral: true
                        }).catch(console.error);
                        return [3 /*break*/, 5];
                    }
                    _j.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    }); }
};
exports.default = command;
