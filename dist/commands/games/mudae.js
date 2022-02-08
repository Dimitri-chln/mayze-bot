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
    name: "mudae",
    description: {
        fr: "Utiliser une liste de commandes utilitaires pour Mudae",
        en: "Use a list of utility commands for Mudae"
    },
    userPermissions: [],
    botPermissions: ["EMBED_LINKS"],
    options: {
        fr: [
            {
                name: "wish",
                description: "Gérer tes wish Mudae",
                type: "SUB_COMMAND_GROUP",
                options: [
                    {
                        name: "list",
                        description: "Voir la liste de tes wish Mudae",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "user",
                                description: "L'utilisateur dont tu veux voir la liste de wish",
                                type: "USER",
                                required: false
                            },
                            {
                                name: "regex",
                                description: "Une option pour afficher le regex à côté du nom des séries",
                                type: "BOOLEAN",
                                required: false
                            }
                        ]
                    },
                    {
                        name: "add",
                        description: "Ajouter un wish à ta liste de wish Mudae",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "series",
                                description: "Le nom de la série",
                                type: "STRING",
                                required: true
                            },
                            {
                                name: "regex",
                                description: "Un regex pour faire aussi correspondre les noms alternatifs",
                                type: "STRING",
                                required: false
                            }
                        ]
                    },
                    {
                        name: "remove",
                        description: "Retirer un wish de ta liste de wish Mudae",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "series",
                                description: "Le numéro de la série à retirer",
                                type: "INTEGER",
                                required: true
                            }
                        ]
                    }
                ]
            }
        ],
        en: [
            {
                name: "wish",
                description: "Manage your Mudae wishes",
                type: "SUB_COMMAND_GROUP",
                options: [
                    {
                        name: "list",
                        description: "See the list of your Mudae wishes",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "user",
                                description: "The user whose wishlist you want to see",
                                type: "USER",
                                required: false
                            },
                            {
                                name: "regex",
                                description: "An option to display the regex next to the series' name",
                                type: "BOOLEAN",
                                required: false
                            }
                        ]
                    },
                    {
                        name: "add",
                        description: "Add a wish to your Mudae wishlist",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "series",
                                description: "The name of the series",
                                type: "STRING",
                                required: true
                            },
                            {
                                name: "regex",
                                description: "A regex to match alternative names as well",
                                type: "STRING",
                                required: false
                            }
                        ]
                    },
                    {
                        name: "remove",
                        description: "Remove a wish from your Mudae wishlist",
                        type: "SUB_COMMAND",
                        options: [
                            {
                                name: "series",
                                description: "The number of the series to remove",
                                type: "INTEGER",
                                required: true
                            }
                        ]
                    }
                ]
            }
        ]
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        var subCommandGroup, _a, subCommand, _b, user, displayRegex_1, wishlist, series, regex, series, wishlist;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!interaction.guild.members.cache.has("432610292342587392"))
                        return [2 /*return*/, interaction.followUp({
                                content: translations.data.mudae_missing(),
                                ephemeral: true
                            })];
                    subCommandGroup = interaction.options.getSubcommandGroup();
                    _a = subCommandGroup;
                    switch (_a) {
                        case "wish": return [3 /*break*/, 1];
                    }
                    return [3 /*break*/, 10];
                case 1:
                    subCommand = interaction.options.getSubcommand();
                    _b = subCommand;
                    switch (_b) {
                        case "list": return [3 /*break*/, 2];
                        case "add": return [3 /*break*/, 4];
                        case "remove": return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 9];
                case 2:
                    user = (_c = interaction.options.getUser("user")) !== null && _c !== void 0 ? _c : interaction.user;
                    displayRegex_1 = Boolean(interaction.options.getBoolean("regex"));
                    return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM wishes WHERE user_id = $1 ORDER BY id", [interaction.user.id])];
                case 3:
                    wishlist = (_e.sent()).rows;
                    interaction.followUp({
                        embeds: [
                            {
                                author: {
                                    name: translations.data.title(user.tag),
                                    iconURL: user.displayAvatarURL({ dynamic: true })
                                },
                                color: interaction.guild.me.displayColor,
                                description: (_d = wishlist.map(function (w, i) { return "`" + (i + 1) + ".` " + w.series + (displayRegex_1 ? " - *" + (w.regex ? w.regex : w.series.toLowerCase()) + "*" : ""); }).join("\n")) !== null && _d !== void 0 ? _d : translations.data.no_wish(),
                                footer: {
                                    text: "✨ Mayze ✨"
                                }
                            }
                        ]
                    });
                    return [3 /*break*/, 9];
                case 4:
                    series = interaction.options.getString("series");
                    regex = interaction.options.getString("regex");
                    return [4 /*yield*/, Util_1.default.database.query("INSERT INTO wishes (user_id, series, regex) VALUES ($1, $2, $3)", [interaction.user.id, series, regex])];
                case 5:
                    _e.sent();
                    interaction.followUp(translations.data.added());
                    return [3 /*break*/, 9];
                case 6:
                    series = interaction.options.getInteger("series");
                    return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM wishes WHERE user_id = $1 ORDER BY id", [interaction.user.id])];
                case 7:
                    wishlist = (_e.sent()).rows;
                    return [4 /*yield*/, Util_1.default.database.query("DELETE FROM wishes WHERE id = $1", [wishlist[series - 1].id])];
                case 8:
                    _e.sent();
                    interaction.followUp(translations.data.removed());
                    return [3 /*break*/, 9];
                case 9: return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    }); }
};
exports.default = command;
