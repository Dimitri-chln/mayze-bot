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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var command = {
    name: "color",
    description: {
        fr: "Tester et visualiser des codes couleurs hexadécimaux",
        en: "Test and visualize hexadecimal color codes"
    },
    userPermissions: [],
    botPermissions: ["EMBED_LINKS", "ADD_REACTIONS"],
    options: {
        fr: [
            {
                name: "color",
                description: "Le code hexadécimal de la couleur",
                type: "STRING",
                required: true
            }
        ],
        en: [
            {
                name: "color",
                description: "The hexadecimal code of the color",
                type: "STRING",
                required: true
            }
        ]
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        function hexToRGB(hexColor) {
            var hexColorRegex = /#(\d|[a-f]){6}/i;
            if (!hexColorRegex.test(hexColor))
                return [0, 0, 0];
            var red = parseInt(hexColor.slice(1, 3), 16);
            var green = parseInt(hexColor.slice(3, 5), 16);
            var blue = parseInt(hexColor.slice(5), 16);
            return [red, green, blue];
        }
        function RGBToHex(RGBColor) {
            if (RGBColor.length !== 3)
                return "#000000";
            return "#"
                + RGBColor[0].toString(16).replace(/^(.)$/, "0$1")
                + RGBColor[1].toString(16).replace(/^(.)$/, "0$1")
                + RGBColor[2].toString(16).replace(/^(.)$/, "0$1");
        }
        function RGBToDec(RGBColor) {
            if (RGBColor.length !== 3)
                return 0;
            return 256 * 256 * RGBColor[0] + 256 * RGBColor[1] + RGBColor[2];
        }
        function updateReply() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    reply.edit({
                        embeds: [
                            {
                                author: {
                                    name: translations.data.title(),
                                    iconURL: interaction.client.user.displayAvatarURL()
                                },
                                color: interaction.guild.me.displayColor,
                                description: translations.data.description(RGBToHex(color), color[0].toString(), color[1].toString(), color[2].toString(), RGBToDec(color).toString()),
                                thumbnail: {
                                    url: "https://dummyimage.com/100/" + RGBToHex(color).replace("#", "") + "/00.png?text=+"
                                },
                                footer: {
                                    text: "✨ Mayze ✨"
                                }
                            }
                        ],
                    }).catch(console.error);
                    return [2 /*return*/];
                });
            });
        }
        var color, reply, emojis, reactionFilter, reactionCollector, messageFilter, messageCollector;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    color = hexToRGB(interaction.options.getString("color"));
                    return [4 /*yield*/, interaction.followUp({
                            embeds: [
                                {
                                    author: {
                                        name: translations.data.title(),
                                        iconURL: interaction.client.user.displayAvatarURL()
                                    },
                                    color: interaction.guild.me.displayColor,
                                    description: translations.data.description(RGBToHex(color), color[0].toString(), color[1].toString(), color[2].toString(), RGBToDec(color).toString()),
                                    thumbnail: {
                                        url: "https://dummyimage.com/100/" + RGBToHex(color).replace("#", "") + "/00.png?text=+"
                                    },
                                    footer: {
                                        text: "✨ Mayze ✨"
                                    }
                                }
                            ],
                            fetchReply: true
                        })];
                case 1:
                    reply = _a.sent();
                    emojis = {
                        redPlus: "🟥",
                        redMinus: "🔴",
                        greenPlus: "🟩",
                        greeenMinus: "🟢",
                        bluePlus: "🟦",
                        blueMinus: "🔵",
                        exit: "❌"
                    };
                    Object.values(emojis).forEach(function (e) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, reply.react(e).catch(console.error)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    }); }); });
                    reactionFilter = function (reaction, user) { return user.id === interaction.user.id && Object.values(emojis).includes(reaction.emoji.name); };
                    reactionCollector = reply.createReactionCollector({ filter: reactionFilter, idle: 60000 });
                    messageFilter = function (msg) { return msg.author.id === interaction.user.id && /^(\+|-)\d+(r|g|b)$/i.test(msg.content); };
                    messageCollector = interaction.channel.createMessageCollector({ filter: messageFilter, idle: 60000 });
                    reactionCollector.on("collect", function (reaction, user) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            reaction.users.remove(user).catch(console.error);
                            switch (reaction.emoji.name) {
                                case emojis.redPlus:
                                    color[0] = color[0] === 255 ? 0 : color[0] + 1;
                                    break;
                                case emojis.redMinus:
                                    color[0] = color[0] === 0 ? 255 : color[0] - 1;
                                    break;
                                case emojis.greenPlus:
                                    color[1] = color[1] === 255 ? 0 : color[1] + 1;
                                    break;
                                case emojis.greeenMinus:
                                    color[1] = color[1] === 0 ? 255 : color[1] - 1;
                                    break;
                                case emojis.bluePlus:
                                    color[2] = color[2] === 255 ? 0 : color[2] + 1;
                                    break;
                                case emojis.blueMinus:
                                    color[2] = color[2] === 0 ? 255 : color[2] - 1;
                                    break;
                                case emojis.exit:
                                    reactionCollector.stop();
                                    break;
                            }
                            updateReply();
                            return [2 /*return*/];
                        });
                    }); });
                    reactionCollector.on("end", function () {
                        messageCollector.stop();
                        reply.reactions.removeAll().catch(console.error);
                    });
                    messageCollector.on("collect", function (msg) { return __awaiter(void 0, void 0, void 0, function () {
                        var regex, _a, value, colorUpdate;
                        return __generator(this, function (_b) {
                            msg.delete().catch(console.error);
                            regex = /^((?:\+|-)\d+)(r|g|b)$/i;
                            _a = __read(msg.content.match(regex), 3), value = _a[1], colorUpdate = _a[2];
                            switch (colorUpdate.toLowerCase()) {
                                case "r":
                                    color[0] = color[0] + parseInt(value) >= 0
                                        ? color[0] + parseInt(value) <= 255
                                            ? color[0] + parseInt(value)
                                            : 255
                                        : 0;
                                    break;
                                case "g":
                                    color[1] = color[1] + parseInt(value) >= 0
                                        ? color[1] + parseInt(value) <= 255
                                            ? color[1] + parseInt(value)
                                            : 255
                                        : 0;
                                    break;
                                case "b":
                                    color[2] = color[2] + parseInt(value) >= 0
                                        ? color[2] + parseInt(value) <= 255
                                            ? color[2] + parseInt(value)
                                            : 255
                                        : 0;
                                    break;
                            }
                            updateReply();
                            return [2 /*return*/];
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    }); }
};
exports.default = command;
