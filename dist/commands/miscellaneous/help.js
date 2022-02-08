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
var command = {
    name: "help",
    description: {
        fr: "Obtenir la liste des commandes ou des informations sur une commande spécifique",
        en: "Get all commands or help on one specific command"
    },
    userPermissions: [],
    botPermissions: ["EMBED_LINKS"],
    options: {
        fr: [
            {
                name: "command",
                description: "La commande pour laquelle obtenir une aide",
                type: "STRING",
                required: false
            }
        ],
        en: [
            {
                name: "command",
                description: "The command to get help with",
                type: "STRING",
                required: false
            }
        ]
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        var publicCommands, commandName, categories, _loop_1, command_1;
        var _a, _b;
        return __generator(this, function (_c) {
            publicCommands = Util_1.default.commands.filter(function (cmd) { var _a; return !((_a = cmd.guildIds) === null || _a === void 0 ? void 0 : _a.includes(interaction.guild.id)) && cmd.category !== "admin"; });
            commandName = (_a = interaction.options.getString("command")) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            if (!commandName) {
                categories = [];
                _loop_1 = function () {
                    var category = publicCommands.first().category;
                    categories.push({ name: category, commands: publicCommands.filter(function (cmd) { return cmd.category === category; }) });
                    publicCommands.sweep(function (cmd) { return cmd.category === category; });
                };
                while (publicCommands.size) {
                    _loop_1();
                }
                interaction.followUp({
                    embeds: [
                        {
                            author: {
                                name: translations.data.command_list(),
                                iconURL: interaction.client.user.displayAvatarURL()
                            },
                            color: interaction.guild.me.displayColor,
                            fields: categories.map(function (category) {
                                return { name: category.name.replace(/^./, function (a) { return a.toUpperCase(); }), value: category.commands.map(function (cmd) { return cmd.name; }).join(", "), inline: true };
                            }),
                            footer: {
                                text: "✨ Mayze ✨"
                            }
                        }
                    ]
                });
            }
            else {
                command_1 = publicCommands.get(commandName);
                if (!command_1)
                    return [2 /*return*/, interaction.followUp(translations.data.invalid_command())];
                interaction.followUp({
                    embeds: [
                        {
                            author: {
                                name: translations.data.title(command_1.name),
                                iconURL: interaction.client.user.displayAvatarURL()
                            },
                            color: interaction.guild.me.displayColor,
                            description: translations.data.description(command_1.name, command_1.category.replace(/^./, function (a) { return a.toUpperCase(); }), command_1.description[translations.language], command_1.userPermissions.length ? command_1.userPermissions.join("`, `") : "∅", ((_b = command_1.cooldown) !== null && _b !== void 0 ? _b : 2).toString()),
                            footer: {
                                text: "✨ Mayze ✨"
                            }
                        }
                    ]
                });
            }
            return [2 /*return*/];
        });
    }); }
};
exports.default = command;