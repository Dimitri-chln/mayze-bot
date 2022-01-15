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
    name: "custom-response",
    description: {
        fr: "Gérer les réponses personnalisées",
        en: "Manage custom responses"
    },
    userPermissions: [],
    botPermissions: ["EMBED_LINKS"],
    options: {
        fr: [
            {
                name: "add",
                description: "Ajouter une réponse personnalisée",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "trigger",
                        description: "Le texte qui déclenche la réponse",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "response",
                        description: "La réponse à envoyer",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "type",
                        description: "Le type de déclencheur",
                        type: "INTEGER",
                        required: false,
                        choices: [
                            {
                                name: "Contient",
                                value: 0
                            },
                            {
                                name: "Égal à",
                                value: 1
                            },
                            {
                                name: "Regex",
                                value: 2
                            },
                            {
                                name: "Commence par",
                                value: 3
                            },
                            {
                                name: "Finit par",
                                value: 4
                            }
                        ]
                    }
                ]
            },
            {
                name: "remove",
                description: "Supprimer une réponse personnalisée",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "response",
                        description: "Le numéro de la réponse",
                        type: "INTEGER",
                        required: true
                    }
                ]
            },
            {
                name: "get",
                description: "Obtenir la liste de toutes les réponses personnalisées",
                type: "SUB_COMMAND"
            }
        ],
        en: [
            {
                name: "add",
                description: "Add a custom response",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "trigger",
                        description: "The text that triggers the response",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "response",
                        description: "The response to send",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "type",
                        description: "The type of the trigger",
                        type: "INTEGER",
                        required: false,
                        choices: [
                            {
                                name: "Contains",
                                value: 0
                            },
                            {
                                name: "Equal to",
                                value: 1
                            },
                            {
                                name: "Regex",
                                value: 2
                            },
                            {
                                name: "Starts with",
                                value: 3
                            },
                            {
                                name: "Ends with",
                                value: 4
                            }
                        ]
                    }
                ]
            },
            {
                name: "remove",
                description: "Remove a custom response",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "response",
                        description: "The response's number",
                        type: "INTEGER",
                        required: true
                    }
                ]
            },
            {
                name: "get",
                description: "Get the list of all custom responses",
                type: "SUB_COMMAND"
            }
        ]
    },
    run: function (interaction, languageStrings) { return __awaiter(void 0, void 0, void 0, function () {
        var subCommand, responses, _a, trigger, response, triggerType, res, n, response, res;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    subCommand = interaction.options.getSubcommand();
                    return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM responses")];
                case 1:
                    responses = (_c.sent())["rows"];
                    _a = subCommand;
                    switch (_a) {
                        case "add": return [3 /*break*/, 2];
                        case "remove": return [3 /*break*/, 4];
                        case "get": return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 7];
                case 2:
                    trigger = interaction.options.getString("trigger");
                    response = interaction.options.getString("response");
                    triggerType = TriggerType[(_b = interaction.options.getNumber("type")) !== null && _b !== void 0 ? _b : 0];
                    return [4 /*yield*/, message.client.database.query("INSERT INTO responses (trigger, response, trigger_type) VALUES ('" + trigger.replace(/"/g, "") + "', '" + response.replace(/"/g, "") + "', " + triggerType + ")").catch(console.error)];
                case 3:
                    res = _c.sent();
                    if (!res)
                        return [2 /*return*/, message.channel.send(language.errors.database).catch(console.error)];
                    if (!message.isInteraction)
                        message.react("✅").catch(console.error);
                    else
                        message.reply(language.response_added).catch(console.error);
                    return [3 /*break*/, 8];
                case 4:
                    n = args
                        ? parseInt(args[1])
                        : options[0].options[0].value;
                    if (!n || n < 1 || n > responses.length)
                        return [2 /*return*/, message.reply(language.get(language.invalid_number, responses.length)).catch(console.error)];
                    response = responses[n - 1];
                    return [4 /*yield*/, message.client.database.query("DELETE FROM responses WHERE trigger='" + response.trigger + "' AND response='" + response.response + "'").catch(console.error)];
                case 5:
                    res = _c.sent();
                    if (!res)
                        return [2 /*return*/, message.channel.send(language.errors.database).catch(console.error)];
                    if (!message.isInteraction)
                        message.react("✅").catch(console.error);
                    else
                        message.reply(language.response_removed).catch(console.error);
                    return [3 /*break*/, 8];
                case 6:
                    message.channel.send({
                        embed: {
                            author: {
                                name: language.embed_title,
                                iconURL: message.client.user.displayAvatarURL()
                            },
                            color: message.guild.me.displayColor,
                            description: responses.map(function (response, i) { return "`" + (i + 1) + ".` " + language.trigger_types[response.trigger_type] + " `" + response.trigger + "`\n\t\u2192 `" + response.response + "`"; }).join("\n"),
                            footer: {
                                text: "✨ Mayze ✨"
                            }
                        }
                    }).catch(console.error);
                    return [3 /*break*/, 8];
                case 7:
                    message.reply(language.errors.invalid_args).catch(console.error);
                    _c.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    }); }
};
var TriggerType;
(function (TriggerType) {
    TriggerType[TriggerType["CONTAINS"] = 0] = "CONTAINS";
    TriggerType[TriggerType["EQUAL"] = 1] = "EQUAL";
    TriggerType[TriggerType["REGEX"] = 2] = "REGEX";
    TriggerType[TriggerType["STARTS_WITH"] = 3] = "STARTS_WITH";
    TriggerType[TriggerType["ENDS_WITH"] = 4] = "ENDS_WITH";
})(TriggerType || (TriggerType = {}));
;
console.log(TriggerType[1]);
exports.default = command;
