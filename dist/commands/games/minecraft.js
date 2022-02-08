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
var pagination_1 = __importDefault(require("../../utils/misc/pagination"));
var minecraft_server_ping_1 = __importDefault(require("minecraft-server-ping"));
var discord_js_1 = require("discord.js");
var command = {
    name: "minecraft",
    description: {
        fr: "Obtenir des informations sur les serveurs Minecraft de Mayze",
        en: "Get information about Mayze's Minecraft servers"
    },
    userPermissions: [],
    botPermissions: ["EMBED_LINKS"],
    guildIds: [Util_1.default.config.MAIN_GUILD_ID],
    options: {
        fr: [],
        en: []
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        var serverIPs, pages;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    serverIPs = process.env.MINECRAFT_SERVER_IPS.split(",");
                    pages = [];
                    return [4 /*yield*/, Promise.all(serverIPs.map(function (serverIP) { return __awaiter(void 0, void 0, void 0, function () {
                            var page, res_1, isOnline, err_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        page = {
                                            embeds: [],
                                            attachments: []
                                        };
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, minecraft_server_ping_1.default.ping(serverIP)];
                                    case 2:
                                        res_1 = _a.sent();
                                        isOnline = function (pingResult) { var _a; return /^Bienvenue sur le serveur de .+!$/.test((_a = pingResult.description) === null || _a === void 0 ? void 0 : _a.text); };
                                        page.embeds.push({
                                            author: {
                                                name: translations.data.title(),
                                                iconURL: interaction.client.user.displayAvatarURL()
                                            },
                                            thumbnail: {
                                                url: "attachment://favicon.png"
                                            },
                                            color: interaction.guild.me.displayColor,
                                            description: translations.data.description(serverIP, isOnline(res_1), res_1.version.name, res_1.players.online.toString(), res_1.players.max.toString(), res_1.ping.toString()),
                                            footer: {
                                                text: "✨ Mayze ✨"
                                            }
                                        });
                                        page.attachments.push(new discord_js_1.MessageAttachment(Buffer.from(res_1.favicon.slice(22), "base64"), "favicon.png"));
                                        return [3 /*break*/, 4];
                                    case 3:
                                        err_1 = _a.sent();
                                        page.embeds.push({
                                            author: {
                                                name: translations.data.title(),
                                            },
                                            color: interaction.guild.me.displayColor,
                                            description: translations.data.failed_description(serverIP),
                                            footer: {
                                                text: "✨ Mayze ✨"
                                            }
                                        });
                                        return [3 /*break*/, 4];
                                    case 4:
                                        pages.push(page);
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 1:
                    _a.sent();
                    // Sort online servers first
                    pages.sort(function (a, b) {
                        if (a.embeds[0].thumbnail)
                            return -1;
                        if (b.embeds[0].thumbnail)
                            return 1;
                        return 0;
                    });
                    (0, pagination_1.default)(interaction, pages);
                    return [2 /*return*/];
            }
        });
    }); }
};
exports.default = command;