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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = __importDefault(require("../../Util"));
var pagination_1 = __importDefault(require("../../utils/misc/pagination"));
var command = {
    name: "sql",
    description: {
        fr: "Effectuer une requête SQL sur la base de données",
        en: "Run a SQL query on the database"
    },
    userPermissions: [],
    botPermissions: ["EMBED_LINKS"],
    options: {
        fr: [
            {
                name: "query",
                description: "La requête à effectuer",
                type: "STRING",
                required: true
            }
        ],
        en: [
            {
                name: "query",
                description: "The query to run",
                type: "STRING",
                required: true
            }
        ]
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        var CHARACTERS_PER_PAGE, query, res, resString, regex, fallbackRegex, matches, pages, page, matches_1, matches_1_1, match;
        var e_1, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    CHARACTERS_PER_PAGE = 2000;
                    query = interaction.options.getString("query");
                    return [4 /*yield*/, Util_1.default.database.query(query)];
                case 1:
                    res = _c.sent();
                    switch (res.command) {
                        case "SELECT": {
                            resString = JSON.stringify(res.rows, null, 2);
                            regex = /\[?\s*\{\n.{0,2000}\},?\n\]?/ygs;
                            fallbackRegex = /.{0,2000}/ygs;
                            matches = (_b = resString.match(regex)) !== null && _b !== void 0 ? _b : resString.match(fallbackRegex);
                            pages = [];
                            page = {
                                embeds: [
                                    {
                                        author: {
                                            name: query,
                                            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                        },
                                        title: translations.data.title(res.rowCount.toString(), res.rowCount > 1),
                                        color: interaction.guild.me.displayColor,
                                        description: "```json\n\u2205\n```"
                                    }
                                ]
                            };
                            try {
                                for (matches_1 = __values(matches), matches_1_1 = matches_1.next(); !matches_1_1.done; matches_1_1 = matches_1.next()) {
                                    match = matches_1_1.value;
                                    page.embeds[0].description = "```json\n" + match + "\n```";
                                    pages.push(page);
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (matches_1_1 && !matches_1_1.done && (_a = matches_1.return)) _a.call(matches_1);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                            ;
                            (0, pagination_1.default)(interaction, pages);
                            break;
                        }
                        default:
                            interaction.reply(translations.data.completed());
                    }
                    return [2 /*return*/];
            }
        });
    }); }
};
module.exports = command;
