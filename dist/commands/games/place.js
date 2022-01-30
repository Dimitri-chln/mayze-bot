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
    name: "place",
    description: {
        fr: "Placer un pixel sur le canevas",
        en: "Place a pixel on the canvas"
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
        var canvas, x, y, colorName, color, grid;
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
                    return [4 /*yield*/, canvas.setPixel(x, y, color.alias)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, canvas.viewGrid(x, y)];
                case 2:
                    grid = _a.sent();
                    interaction.reply({
                        content: grid.format(),
                        embeds: [
                            {
                                author: {
                                    name: interaction.user.tag,
                                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                },
                                color: interaction.guild.me.displayColor,
                                description: translations.data.pixel_placed(color.emoji.toString(), color.alias),
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
