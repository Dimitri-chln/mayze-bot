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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = __importDefault(require("../../Util"));
var pagination_1 = __importDefault(require("../../utils/misc/pagination"));
var discord_js_1 = require("discord.js");
var command = {
    name: "canvas",
    description: {
        fr: "Rejoindre un canevas",
        en: "Join a canvas"
    },
    userPermissions: [],
    botPermissions: ["EMBED_LINKS"],
    options: {
        fr: [
            {
                name: "join",
                description: "Rejoindre un canevas",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "canvas",
                        description: "Le nom du canevas",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "list",
                description: "Obtenir la liste de tous les canevas",
                type: "SUB_COMMAND"
            },
            {
                name: "palettes",
                description: "Voir les palettes de couleurs disponibles",
                type: "SUB_COMMAND"
            },
            {
                name: "place",
                description: "Placer un pixel sur le canevas",
                type: "SUB_COMMAND",
                options: [
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
                        description: "La couleur du pixel. Voir /canvas palettes",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "place-chain",
                description: "Placer plusieurs pixels sur le canevas",
                type: "SUB_COMMAND",
                options: [
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
                        description: "La couleur du pixel. Voir /canvas palettes",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "view",
                description: "Voir une image du canevas",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "x",
                        description: "L'abscisse du pixel en haut à gauche de l'image",
                        type: "INTEGER",
                        required: false,
                        minValue: 0
                    },
                    {
                        name: "y",
                        description: "L'ordonnées du pixel en haut à gauche de l'image",
                        type: "INTEGER",
                        required: false,
                        minValue: 0
                    },
                    {
                        name: "zoom",
                        description: "La taille de l'image en pixels",
                        type: "INTEGER",
                        required: false,
                        minValue: 0
                    }
                ]
            },
            {
                name: "view-nav",
                description: "Naviguer dans le canevas",
                type: "SUB_COMMAND",
                options: [
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
                    }
                ]
            }
        ],
        en: [
            {
                name: "join",
                description: "Join a canvas",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "canvas",
                        description: "The name of the canvas",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "list",
                description: "Get the list of all available canvas",
                type: "SUB_COMMAND"
            },
            {
                name: "palettes",
                description: "See the palettes of available colors",
                type: "SUB_COMMAND"
            },
            {
                name: "place",
                description: "Place a pixel on the canvas",
                type: "SUB_COMMAND",
                options: [
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
                        description: "The color of the pixel. See /canvas palettes",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "place-chain",
                description: "Place several pixels on the canvas",
                type: "SUB_COMMAND",
                options: [
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
                        description: "The color of the pixel. See /canvas palettes",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "view",
                description: "See an image of the canvas",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "x",
                        description: "The x coordinate of the pixel in the top left corner of the image",
                        type: "INTEGER",
                        required: false,
                        minValue: 0
                    },
                    {
                        name: "y",
                        description: "The y coordinate of the pixel in the top left corner of the image",
                        type: "INTEGER",
                        required: false,
                        minValue: 0
                    },
                    {
                        name: "zoom",
                        description: "The size of the image in pixels",
                        type: "INTEGER",
                        required: false,
                        minValue: 0
                    }
                ]
            },
            {
                name: "view-nav",
                description: "Navigate in the canvas",
                type: "SUB_COMMAND",
                options: [
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
                    }
                ]
            }
        ]
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        var subCommand, userCanvas, _a, canvasName_1, newCanvas, pages, _b, _c, _d, name_1, palette, page, canvas, x, y, colorName_1, color, grid, canvas_1, x_1, y_1, colorName_2, color_1, grid_1, reply_1, filter, collector_1, canvas, x, y, zoom, startLoad, image, endLoad, attachment, canvas_2, x_2, y_2, grid_2, reply_2, filter, collector_2;
        var e_1, _e;
        var _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    subCommand = interaction.options.getSubcommand();
                    userCanvas = Util_1.default.canvas.filter(function (canvas) {
                        return canvas.owner.type === "EVERYONE"
                            || canvas.owner.type === "GUILD" && canvas.owner.id === interaction.guild.id
                            || canvas.owner.type === "CHANNEL" && canvas.owner.id === interaction.channel.id
                            || canvas.owner.type === "USER" && canvas.owner.id === interaction.user.id;
                    });
                    _a = subCommand;
                    switch (_a) {
                        case "list": return [3 /*break*/, 1];
                        case "join": return [3 /*break*/, 2];
                        case "palettes": return [3 /*break*/, 3];
                        case "place": return [3 /*break*/, 4];
                        case "place-chain": return [3 /*break*/, 7];
                        case "view": return [3 /*break*/, 10];
                        case "view-nav": return [3 /*break*/, 12];
                    }
                    return [3 /*break*/, 15];
                case 1:
                    {
                        interaction.reply({
                            embeds: [
                                {
                                    author: {
                                        name: translations.data.title(),
                                        iconURL: interaction.client.user.displayAvatarURL()
                                    },
                                    color: interaction.guild.me.displayColor,
                                    description: userCanvas.map(function (canvas) { return "`" + canvas.name.replace(/-\d{18}/, "") + "` - **" + canvas.size + "x" + canvas.size + "**"; }).join("\n"),
                                    footer: {
                                        text: "✨ Mayze ✨"
                                    }
                                }
                            ]
                        });
                        return [3 /*break*/, 15];
                    }
                    _j.label = 2;
                case 2:
                    {
                        canvasName_1 = interaction.options.getString("canvas").toLowerCase();
                        newCanvas = userCanvas.find(function (canvas) { return canvas.name === canvasName_1; });
                        if (!newCanvas)
                            return [2 /*return*/, interaction.reply(translations.data.invalid_canvas())];
                        newCanvas.addUser(interaction.user);
                        interaction.reply({
                            content: translations.data.joined(canvasName_1),
                            ephemeral: true
                        });
                        return [3 /*break*/, 15];
                    }
                    _j.label = 3;
                case 3:
                    {
                        pages = [];
                        try {
                            for (_b = __values(Util_1.default.palettes), _c = _b.next(); !_c.done; _c = _b.next()) {
                                _d = __read(_c.value, 2), name_1 = _d[0], palette = _d[1];
                                page = {
                                    embeds: [
                                        {
                                            author: {
                                                name: translations.data.palette_title(),
                                                iconURL: interaction.client.user.displayAvatarURL()
                                            },
                                            title: translations.data.palette(name_1),
                                            color: interaction.guild.me.displayColor,
                                            description: palette.all().map(function (color, alias) { return color.emoji + " `" + alias + "` - **" + color.name + "** `" + color.hex + "`"; }).join("\n")
                                        }
                                    ]
                                };
                                pages.push(page);
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (_c && !_c.done && (_e = _b.return)) _e.call(_b);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        (0, pagination_1.default)(interaction, pages);
                        return [3 /*break*/, 15];
                    }
                    _j.label = 4;
                case 4:
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
                    colorName_1 = interaction.options.getString("color");
                    if (!Util_1.default.palettes.some(function (palette) { return palette.has(colorName_1); }))
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.invalid_color(),
                                ephemeral: true
                            })];
                    color = Util_1.default.palettes.find(function (palette) { return palette.has(colorName_1); }).get(colorName_1);
                    return [4 /*yield*/, canvas.setPixel(x, y, color.alias)];
                case 5:
                    _j.sent();
                    return [4 /*yield*/, canvas.viewGrid(x, y)];
                case 6:
                    grid = _j.sent();
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
                    return [3 /*break*/, 15];
                case 7:
                    canvas_1 = Util_1.default.canvas.find(function (c) { return c.users.has(interaction.user.id); });
                    if (!canvas_1)
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.not_in_canvas(),
                                ephemeral: true
                            })];
                    x_1 = interaction.options.getInteger("x");
                    y_1 = interaction.options.getInteger("y");
                    if (x_1 < 0 || y_1 < 0 || x_1 >= canvas_1.size || y_1 >= canvas_1.size)
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.invalid_coordinates(),
                                ephemeral: true
                            })];
                    colorName_2 = interaction.options.getString("color");
                    if (!Util_1.default.palettes.some(function (palette) { return palette.has(colorName_2); }))
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.invalid_color(),
                                ephemeral: true
                            })];
                    color_1 = Util_1.default.palettes.find(function (palette) { return palette.has(colorName_2); }).get(colorName_2);
                    return [4 /*yield*/, canvas_1.viewGrid(x_1, y_1)];
                case 8:
                    grid_1 = _j.sent();
                    return [4 /*yield*/, interaction.reply({
                            content: grid_1.format(),
                            embeds: [
                                {
                                    author: {
                                        name: interaction.user.tag,
                                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                    },
                                    color: interaction.guild.me.displayColor,
                                    description: translations.data.placing(color_1.emoji.toString(), color_1.alias),
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
                case 9:
                    reply_1 = _j.sent();
                    filter = function (buttonInteraction) { return buttonInteraction.user.id === interaction.user.id; };
                    collector_1 = reply_1.createMessageComponentCollector({ componentType: "BUTTON", filter: filter, idle: 120000 });
                    collector_1.on("collect", function (buttonInteraction) { return __awaiter(void 0, void 0, void 0, function () {
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
                                    if (x_1 > 0)
                                        x_1--;
                                    return [3 /*break*/, 8];
                                case 2:
                                    if (y_1 > 0)
                                        y_1--;
                                    return [3 /*break*/, 8];
                                case 3:
                                    if (y_1 < canvas_1.size - 1)
                                        y_1++;
                                    return [3 /*break*/, 8];
                                case 4:
                                    if (x_1 < canvas_1.size - 1)
                                        x_1++;
                                    return [3 /*break*/, 8];
                                case 5: return [4 /*yield*/, canvas_1.setPixel(x_1, y_1, colorName_2)];
                                case 6:
                                    _b.sent();
                                    return [3 /*break*/, 8];
                                case 7:
                                    collector_1.stop();
                                    return [3 /*break*/, 8];
                                case 8: return [4 /*yield*/, canvas_1.viewGrid(x_1, y_1)];
                                case 9:
                                    grid_1 = _b.sent();
                                    reply_1.edit({
                                        content: grid_1.format(),
                                        embeds: [
                                            {
                                                author: {
                                                    name: interaction.user.tag,
                                                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                                },
                                                color: interaction.guild.me.displayColor,
                                                description: translations.data.placing(color_1.emoji.toString(), color_1.alias),
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
                    collector_1.on("end", function () {
                        reply_1.edit({
                            content: grid_1.format(),
                            embeds: [
                                {
                                    author: {
                                        name: interaction.user.tag,
                                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                    },
                                    color: interaction.guild.me.displayColor,
                                    description: translations.data.placing(color_1.emoji.toString(), color_1.alias),
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
                    return [3 /*break*/, 15];
                case 10:
                    canvas = Util_1.default.canvas.find(function (c) { return c.users.has(interaction.user.id); });
                    if (!canvas)
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.not_in_canvas(),
                                ephemeral: true
                            })];
                    x = (_f = interaction.options.getInteger("x")) !== null && _f !== void 0 ? _f : 0;
                    y = (_g = interaction.options.getInteger("y")) !== null && _g !== void 0 ? _g : 0;
                    if (x < 0 || y < 0 || x >= canvas.size || y >= canvas.size)
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.invalid_coordinates(),
                                ephemeral: true
                            })];
                    zoom = (_h = interaction.options.getInteger("zoom")) !== null && _h !== void 0 ? _h : "default";
                    if (zoom && zoom !== "default" && (zoom < 1 || zoom > canvas.size))
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.invalid_zoom(),
                                ephemeral: true
                            })];
                    startLoad = Date.now();
                    return [4 /*yield*/, canvas.view(x, y, zoom)];
                case 11:
                    image = _j.sent();
                    endLoad = Date.now();
                    attachment = new discord_js_1.MessageAttachment(image, "canvas.png");
                    interaction.reply({
                        embeds: [
                            {
                                title: translations.data.view_title(canvas.name.replace(/^./, function (a) { return a.toUpperCase(); }), canvas.size.toString(), ((endLoad - startLoad) / 1000).toString()),
                                color: interaction.guild.me.displayColor,
                                image: {
                                    url: "attachment://canvas.png"
                                },
                                footer: {
                                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                                    text: "✨ Mayze ✨"
                                },
                            }
                        ],
                        attachments: [attachment]
                    });
                    return [3 /*break*/, 15];
                case 12:
                    canvas_2 = Util_1.default.canvas.find(function (c) { return c.users.has(interaction.user.id); });
                    if (!canvas_2)
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.not_in_canvas(),
                                ephemeral: true
                            })];
                    x_2 = interaction.options.getInteger("x");
                    y_2 = interaction.options.getInteger("y");
                    if (x_2 < 0 || y_2 < 0 || x_2 >= canvas_2.size || y_2 >= canvas_2.size)
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.invalid_coordinates(),
                                ephemeral: true
                            })];
                    return [4 /*yield*/, canvas_2.viewGrid(x_2, y_2)];
                case 13:
                    grid_2 = _j.sent();
                    return [4 /*yield*/, interaction.reply({
                            content: grid_2.format(),
                            embeds: [
                                {
                                    author: {
                                        name: interaction.user.tag,
                                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                    },
                                    color: interaction.guild.me.displayColor,
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
                                            customId: "stop",
                                            emoji: "❌",
                                            style: "DANGER"
                                        }
                                    ]
                                }
                            ],
                            fetchReply: true
                        })];
                case 14:
                    reply_2 = _j.sent();
                    filter = function (buttonInteraction) { return buttonInteraction.user.id === interaction.user.id; };
                    collector_2 = reply_2.createMessageComponentCollector({ componentType: "BUTTON", filter: filter, idle: 120000 });
                    collector_2.on("collect", function (buttonInteraction) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    switch (buttonInteraction.customId) {
                                        case "left":
                                            if (x_2 > 0)
                                                x_2--;
                                            break;
                                        case "up":
                                            if (y_2 > 0)
                                                y_2--;
                                            break;
                                        case "down":
                                            if (y_2 < canvas_2.size - 1)
                                                y_2++;
                                            break;
                                        case "right":
                                            if (x_2 < canvas_2.size - 1)
                                                x_2++;
                                            break;
                                        case "cancel":
                                            collector_2.stop();
                                            break;
                                    }
                                    return [4 /*yield*/, canvas_2.viewGrid(x_2, y_2)];
                                case 1:
                                    grid_2 = _a.sent();
                                    reply_2.edit({
                                        content: grid_2.format(),
                                        embeds: [
                                            {
                                                author: {
                                                    name: interaction.user.tag,
                                                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                                },
                                                color: interaction.guild.me.displayColor,
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
                    collector_2.on("end", function () {
                        reply_2.edit({
                            content: grid_2.format(),
                            embeds: [
                                {
                                    author: {
                                        name: interaction.user.tag,
                                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                    },
                                    color: interaction.guild.me.displayColor,
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
                    return [3 /*break*/, 15];
                case 15: return [2 /*return*/];
            }
        });
    }); }
};
exports.default = command;
