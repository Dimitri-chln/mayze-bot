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
var getLevel_1 = __importDefault(require("../../utils/misc/getLevel"));
var command = {
    name: "top",
    description: {
        fr: "Obtenir le classement d'xp des membres",
        en: "Get the xp leaderboard of the members "
    },
    userPermissions: [],
    botPermissions: ["EMBED_LINKS"],
    options: {
        fr: [
            {
                name: "leaderboard",
                description: "Le classement à afficher",
                type: "STRING",
                required: true,
                choices: [
                    {
                        name: "Textuel",
                        value: "chat_xp"
                    },
                    {
                        name: "Vocal",
                        value: "voice_xp"
                    }
                ]
            }
        ],
        en: [
            {
                name: "leaderboard",
                description: "The leaderboard to show",
                type: "STRING",
                required: true,
                choices: [
                    {
                        name: "Text",
                        value: "chat_xp"
                    },
                    {
                        name: "Voice",
                        value: "voice_xp"
                    }
                ]
            }
        ]
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        var leaderboard, top, pages, page, _loop_1, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    leaderboard = interaction.options.getString("leaderboard");
                    return [4 /*yield*/, Util_1.default.database.query("\n\t\t\tSELECT " + leaderboard + " FROM levels\n\t\t\tORDER BY " + leaderboard + " DESC\n\t\t\t")];
                case 1:
                    top = (_a.sent()).rows;
                    top = top.filter(function (user) { return interaction.guild.members.cache.has(user.user_id); });
                    pages = [];
                    page = {
                        embeds: [
                            {
                                author: {
                                    name: translations.data.title(interaction.guild.name, leaderboard === "chat_xp"),
                                    iconURL: interaction.guild.iconURL({ dynamic: true })
                                },
                                color: interaction.guild.me.displayColor,
                                description: translations.data.no_member()
                            }
                        ]
                    };
                    if (!top.length)
                        pages.push(page);
                    _loop_1 = function (i) {
                        page.embeds[0] = {
                            author: {
                                name: translations.data.title(interaction.guild.name, leaderboard === "chat_xp"),
                                iconURL: interaction.guild.iconURL({ dynamic: true })
                            },
                            color: interaction.guild.me.displayColor,
                            description: top
                                .slice(i, i + Util_1.default.config.ITEMS_PER_PAGE)
                                .map(function (user, j) { return translations.data.description((i + j + 1).toString(), interaction.guild.members.cache.get(user.user_id).user.username, (0, getLevel_1.default)(user[leaderboard]).level.toString()); }).join("\n")
                        };
                        pages.push(page);
                    };
                    for (i = 0; i < top.length; i += Util_1.default.config.ITEMS_PER_PAGE) {
                        _loop_1(i);
                    }
                    ;
                    (0, pagination_1.default)(interaction, pages);
                    return [2 /*return*/];
            }
        });
    }); }
};
exports.default = command;
