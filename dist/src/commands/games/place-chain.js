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
    name: "place-chain",
    description: {
        fr: "Placer plusieurs pixels sur le canevas",
        en: "Place multiple pixels on the canvas"
    },
    userPermissions: [],
    botPermissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
    options: {
        fr: [
            {
                name: "x",
                description: "L'abscisse du pixel",
                type: "INTEGER",
                required: true,
                minValue: 0
            },
            {
                name: "y",
                description: "L'ordonnée du pixel",
                type: "INTEGER",
                required: true,
                minValue: 0
            },
            {
                name: "color",
                description: "La couleur du pixel. Voir /palette",
                type: "STRING",
                required: true
            }
        ],
        en: [
            {
                name: "x",
                description: "The x coordinate of the pixel",
                type: "INTEGER",
                required: true,
                minValue: 0
            },
            {
                name: "y",
                description: "The y coordinate of the pixel",
                type: "INTEGER",
                required: true,
                minValue: 0
            },
            {
                name: "color",
                description: "The color of the pixel. See /palette",
                type: "STRING",
                required: true
            }
        ]
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        var canvas, x, y, colorName, color, grid, reply, filter, collector;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    canvas = Util_1.default.canvas.find(function (c) { return c.users.has(interaction.user.id); });
                    if (!canvas)
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.not_in_canvas(),
                                ephemeral: true
                            })];
                    x = interaction.options.getInteger("x");
                    y = interaction.options.getInteger("y");
                    if (x < 0 || y < 0 || x >= canvas.size || y >= canvas.size)
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.invalid_coordinates(),
                                ephemeral: true
                            })];
                    colorName = interaction.options.getString("color");
                    if (!Util_1.default.palettes.some(function (palette) { return palette.has(colorName); }))
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.invalid_color(),
                                ephemeral: true
                            })];
                    color = Util_1.default.palettes.find(function (palette) { return palette.has(colorName); }).get(colorName);
                    return [4 /*yield*/, canvas.viewGrid(x, y)];
                case 1:
                    grid = _a.sent();
                    return [4 /*yield*/, interaction.reply({
                            content: grid.format(),
                            embeds: [
                                {
                                    author: {
                                        name: interaction.user.tag,
                                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                    },
                                    color: interaction.guild.me.displayColor,
                                    description: translations.data.placing(color.emoji.toString(), color.alias),
                                    footer: {
                                        text: "✨ Mayze ✨"
                                    }
                                }
                            ],
                            components: [
                                {
                                    type: "ACTION_ROW",
                                    components: [
                                        {
                                            type: "BUTTON",
                                            customId: "left",
                                            emoji: "⬅️"
                                        },
                                        {
                                            type: "BUTTON",
                                            customId: "up",
                                            emoji: "⬆️"
                                        },
                                        {
                                            type: "BUTTON",
                                            customId: "down",
                                            emoji: "⬇️"
                                        },
                                        {
                                            type: "BUTTON",
                                            customId: "right",
                                            emoji: "➡️"
                                        },
                                        {
                                            type: "BUTTON",
                                            customId: "confirm",
                                            emoji: "✅",
                                            style: "SUCCESS"
                                        },
                                        {
                                            type: "BUTTON",
                                            customId: "stop",
                                            emoji: "❌",
                                            style: "DANGER"
                                        }
                                    ]
                                }
                            ],
                            fetchReply: true
                        })];
                case 2:
                    reply = _a.sent();
                    filter = function (buttonInteraction) { return buttonInteraction.user.id === interaction.user.id; };
                    collector = reply.createMessageComponentCollector({ componentType: "BUTTON", filter: filter, idle: 120000 });
                    collector.on("collect", function (buttonInteraction) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = buttonInteraction.customId;
                                    switch (_a) {
                                        case "left": return [3 /*break*/, 1];
                                        case "up": return [3 /*break*/, 2];
                                        case "down": return [3 /*break*/, 3];
                                        case "right": return [3 /*break*/, 4];
                                        case "confirm": return [3 /*break*/, 5];
                                        case "cancel": return [3 /*break*/, 7];
                                    }
                                    return [3 /*break*/, 8];
                                case 1:
                                    if (x > 0)
                                        x--;
                                    return [3 /*break*/, 8];
                                case 2:
                                    if (y > 0)
                                        y--;
                                    return [3 /*break*/, 8];
                                case 3:
                                    if (y < canvas.size - 1)
                                        y++;
                                    return [3 /*break*/, 8];
                                case 4:
                                    if (x < canvas.size - 1)
                                        x++;
                                    return [3 /*break*/, 8];
                                case 5: return [4 /*yield*/, canvas.setPixel(x, y, colorName)];
                                case 6:
                                    _b.sent();
                                    return [3 /*break*/, 8];
                                case 7:
                                    collector.stop();
                                    return [3 /*break*/, 8];
                                case 8: return [4 /*yield*/, canvas.viewGrid(x, y)];
                                case 9:
                                    grid = _b.sent();
                                    reply.edit({
                                        content: grid.format(),
                                        embeds: [
                                            {
                                                author: {
                                                    name: interaction.user.tag,
                                                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                                },
                                                color: interaction.guild.me.displayColor,
                                                description: translations.data.placing(color.emoji.toString(), color.alias),
                                                footer: {
                                                    text: "✨ Mayze ✨"
                                                }
                                            }
                                        ],
                                        components: [
                                            {
                                                type: "ACTION_ROW",
                                                components: [
                                                    {
                                                        type: "BUTTON",
                                                        customId: "left",
                                                        emoji: "⬅️"
                                                    },
                                                    {
                                                        type: "BUTTON",
                                                        customId: "up",
                                                        emoji: "⬆️"
                                                    },
                                                    {
                                                        type: "BUTTON",
                                                        customId: "down",
                                                        emoji: "⬇️"
                                                    },
                                                    {
                                                        type: "BUTTON",
                                                        customId: "right",
                                                        emoji: "➡️"
                                                    },
                                                    {
                                                        type: "BUTTON",
                                                        customId: "confirm",
                                                        emoji: "✅",
                                                        style: "SUCCESS"
                                                    },
                                                    {
                                                        type: "BUTTON",
                                                        customId: "stop",
                                                        emoji: "❌",
                                                        style: "DANGER"
                                                    }
                                                ]
                                            }
                                        ]
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    collector.on("end", function () {
                        reply.edit({
                            content: grid.format(),
                            embeds: [
                                {
                                    author: {
                                        name: interaction.user.tag,
                                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                    },
                                    color: interaction.guild.me.displayColor,
                                    description: translations.data.placing(color.emoji.toString(), color.alias),
                                    footer: {
                                        text: "✨ Mayze ✨"
                                    }
                                }
                            ],
                            components: [
                                {
                                    type: "ACTION_ROW",
                                    components: [
                                        {
                                            type: "BUTTON",
                                            customId: "left",
                                            emoji: "⬅️",
                                            disabled: true
                                        },
                                        {
                                            type: "BUTTON",
                                            customId: "up",
                                            emoji: "⬆️",
                                            disabled: true
                                        },
                                        {
                                            type: "BUTTON",
                                            customId: "down",
                                            emoji: "⬇️",
                                            disabled: true
                                        },
                                        {
                                            type: "BUTTON",
                                            customId: "right",
                                            emoji: "➡️",
                                            disabled: true
                                        },
                                        {
                                            type: "BUTTON",
                                            customId: "confirm",
                                            emoji: "✅",
                                            style: "SUCCESS",
                                            disabled: true
                                        },
                                        {
                                            type: "BUTTON",
                                            customId: "stop",
                                            emoji: "❌",
                                            style: "DANGER",
                                            disabled: true
                                        }
                                    ]
                                }
                            ]
                        });
                    });
                    return [2 /*return*/];
            }
        });
    }); }
};
exports.default = command;
