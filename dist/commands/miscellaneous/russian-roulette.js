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
var command = {
    name: "russian-roulette",
    description: {
        fr: "Jouer à la roulette russe",
        en: "Play the russian roulette"
    },
    userPermissions: [],
    botPermissions: ["EMBED_LINKS"],
    options: {
        fr: [
            {
                name: "create",
                description: "Créer une nouvelle partie de roulette russe",
                type: "SUB_COMMAND"
            },
            {
                name: "join",
                description: "Rejoindre la partie de roulette russe en cours",
                type: "SUB_COMMAND"
            },
            {
                name: "delete",
                description: "Supprimer ta partie de roulette russe en cours",
                type: "SUB_COMMAND"
            },
            {
                name: "start",
                description: "Lancer la partie de roulette russe créée",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "option",
                        description: "Option pour la partie",
                        type: "STRING",
                        required: false,
                        choices: [
                            {
                                name: "Expulser le perdant du serveur",
                                value: "kick"
                            },
                            {
                                name: "Timeout le perdant pendant 5 minutes",
                                value: "timeout"
                            }
                        ]
                    }
                ]
            }
        ],
        en: [
            {
                name: "create",
                description: "Create a new russian roulette game",
                type: "SUB_COMMAND"
            },
            {
                name: "join",
                description: "Join the current russian roulette game",
                type: "SUB_COMMAND"
            },
            {
                name: "delete",
                description: "Delete your current russian roulette game",
                type: "SUB_COMMAND"
            },
            {
                name: "start",
                description: "Start the current russian roulette game",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "option",
                        description: "Game option",
                        type: "STRING",
                        required: false,
                        choices: [
                            {
                                name: "Kick the loser from the server",
                                value: "kick"
                            },
                            {
                                name: "Timeout the loser for 5 minutes",
                                value: "timeout"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        function roulette(message, embed, game, i) {
            if (i === void 0) { i = 0; }
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (game.members.size > 1 && i < 5) {
                        setTimeout(function () {
                            var savedPlayer = game.members.random();
                            game.members.delete(savedPlayer.user.id);
                            message.edit({
                                embeds: [embed.setDescription("**" + savedPlayer.user.tag + "** ...")]
                            }).catch(console.error);
                            roulette(message, embed, game, i + 1);
                        }, 2000);
                    }
                    else {
                        setTimeout(function () {
                            var deadPlayer = game.members.random();
                            message.edit({
                                embeds: [embed.setDescription(translations.data.dead(deadPlayer.user.tag))]
                            }).catch(console.error);
                            var gameOption = interaction.options.getString("options");
                            switch (gameOption) {
                                case "kick": {
                                    if (deadPlayer.roles.highest.position < interaction.guild.me.roles.highest.position &&
                                        !deadPlayer.premiumSinceTimestamp)
                                        deadPlayer.kick(translations.data.reason());
                                    break;
                                }
                                case "timeout": {
                                    deadPlayer.timeout(5 * 60 * 1000, translations.data.reason());
                                    break;
                                }
                            }
                        }, 2000);
                    }
                    return [2 /*return*/];
                });
            });
        }
        var subCommand, currentGame, _a, newGame, embed, reply;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    subCommand = interaction.options.getSubcommand();
                    currentGame = Util_1.default.russianRouletteGames.get(interaction.channel.id);
                    _a = subCommand;
                    switch (_a) {
                        case "create": return [3 /*break*/, 1];
                        case "join": return [3 /*break*/, 2];
                        case "delete": return [3 /*break*/, 3];
                        case "start": return [3 /*break*/, 4];
                    }
                    return [3 /*break*/, 7];
                case 1:
                    {
                        if (currentGame)
                            return [2 /*return*/, interaction.reply({
                                    content: translations.data.already_running(),
                                    ephemeral: true
                                })];
                        newGame = {
                            creator: interaction.member,
                            members: new discord_js_1.Collection()
                        };
                        Util_1.default.russianRouletteGames.set(interaction.channel.id, newGame);
                        interaction.reply({
                            embeds: [
                                {
                                    author: {
                                        name: translations.data.created_title(),
                                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                    },
                                    color: interaction.guild.me.displayColor,
                                    description: translations.data.created_description(),
                                    footer: {
                                        text: "✨ Mayze ✨"
                                    }
                                }
                            ]
                        });
                        return [3 /*break*/, 7];
                    }
                    _b.label = 2;
                case 2:
                    {
                        if (!currentGame)
                            return [2 /*return*/, interaction.reply({
                                    content: translations.data.no_game(),
                                    ephemeral: true
                                })];
                        if (currentGame.members.has(interaction.user.id))
                            return [2 /*return*/, interaction.reply({
                                    content: translations.data.already_joined(),
                                    ephemeral: true
                                })];
                        currentGame.members.set(interaction.user.id, interaction.member);
                        interaction.reply(translations.data.joined(interaction.user.toString()));
                        return [3 /*break*/, 7];
                    }
                    _b.label = 3;
                case 3:
                    {
                        if (!currentGame)
                            return [2 /*return*/, interaction.reply({
                                    content: translations.data.no_game(),
                                    ephemeral: true
                                })];
                        if (currentGame.creator.id !== interaction.user.id &&
                            !interaction.member.permissions.has("KICK_MEMBERS"))
                            return [2 /*return*/, interaction.reply({
                                    content: translations.data.deletion_not_allowed(),
                                    ephemeral: true
                                })];
                        Util_1.default.russianRouletteGames.delete(interaction.channel.id);
                        interaction.reply(translations.data.deleted());
                        return [3 /*break*/, 7];
                    }
                    _b.label = 4;
                case 4:
                    if (!currentGame)
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.no_game(),
                                ephemeral: true
                            })];
                    if (currentGame.creator.id !== interaction.user.id &&
                        !interaction.member.permissions.has("KICK_MEMBERS"))
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.starting_not_allowed(),
                                ephemeral: true
                            })];
                    if (currentGame.members.size < 2)
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.not_enough_players(),
                                ephemeral: true
                            })];
                    embed = new discord_js_1.MessageEmbed()
                        .setAuthor({
                        name: "La partie de roulette russe a commencé!",
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                    })
                        .setColor(interaction.guild.me.displayColor)
                        .setDescription("...")
                        .setFooter({
                        text: "✨ Mayze ✨"
                    });
                    return [4 /*yield*/, interaction.reply({
                            embeds: [embed],
                            fetchReply: true
                        })];
                case 5:
                    reply = _b.sent();
                    return [4 /*yield*/, roulette(reply, embed, currentGame)];
                case 6:
                    _b.sent();
                    Util_1.default.russianRouletteGames.delete(interaction.channel.id);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); }
};
exports.default = command;
