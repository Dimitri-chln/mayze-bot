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
var unb_api_1 = require("unb-api");
var command = {
    name: "unbelievaboat",
    description: {
        fr: "Intéragir avec UnbelievaBoat",
        en: "Interact with UnbelievaBoat"
    },
    userPermissions: [],
    botPermissions: ["EMBED_LINKS"],
    guildIds: ["689164798264606784"],
    options: {
        fr: [
            {
                name: "balance",
                description: "Voir ton argent sur UnbelievaBoat",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "L'utilisateur dont tu veux voir l'argent",
                        type: "USER",
                        required: false
                    }
                ]
            }
        ],
        en: [
            {
                name: "balance",
                description: "See your UnbelievaBoat balance",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "user",
                        description: "The user whose balance you want to see",
                        type: "USER",
                        required: false
                    }
                ]
            }
        ]
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        var unbClient, user, unbUser, subCommand;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    unbClient = new unb_api_1.Client(process.env.UNB_TOKEN);
                    user = (_a = interaction.options.getUser("user")) !== null && _a !== void 0 ? _a : interaction.user;
                    return [4 /*yield*/, unbClient.getUserBalance(interaction.guild.id, user.id)];
                case 1:
                    unbUser = _b.sent();
                    subCommand = interaction.options.getSubcommand();
                    switch (subCommand) {
                        case "balance": {
                            interaction.followUp({
                                embeds: [
                                    {
                                        author: {
                                            name: translations.data.balance_title(user.tag),
                                            iconURL: user.displayAvatarURL({ dynamic: true })
                                        },
                                        color: interaction.guild.me.displayColor,
                                        description: translations.data.balance_description(unbUser.rank.toLocaleString(translations.language), unbUser.cash.toLocaleString(translations.language), unbUser.bank.toLocaleString(translations.language), unbUser.total.toLocaleString(translations.language)),
                                        footer: {
                                            text: "✨ Mayze ✨"
                                        }
                                    }
                                ]
                            });
                            break;
                        }
                    }
                    return [2 /*return*/];
            }
        });
    }); }
};
exports.default = command;
