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
var axios_1 = __importDefault(require("axios"));
var command = {
    name: "define",
    description: {
        fr: "Obtenir la définition d'un mot",
        en: "Get the definition of a word"
    },
    userPermissions: [],
    botPermissions: [],
    options: {
        fr: [
            {
                name: "word",
                description: "Le mot à rechercher",
                type: "STRING",
                required: true
            },
            {
                name: "language",
                description: "La langue dans laquelle chercher le mot",
                type: "STRING",
                required: false,
                choices: [
                    {
                        name: "Français",
                        value: "fr"
                    },
                    {
                        name: "Anglais",
                        value: "en"
                    }
                ]
            }
        ],
        en: [
            {
                name: "word",
                description: "The word to search",
                type: "STRING",
                required: true
            },
            {
                name: "language",
                description: "The language to search the word in",
                type: "STRING",
                required: false,
                choices: [
                    {
                        name: "Français",
                        value: "fr"
                    },
                    {
                        name: "Anglais",
                        value: "en"
                    }
                ]
            }
        ]
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        var apiURL, word, searchLanguage;
        var _a;
        return __generator(this, function (_b) {
            apiURL = "https://api.dictionaryapi.dev/api/v2/entries";
            word = interaction.options.getString("word").toLowerCase();
            searchLanguage = (_a = interaction.options.getString("language")) !== null && _a !== void 0 ? _a : translations.language;
            axios_1.default.get(apiURL + "/" + searchLanguage + "/" + encodeURIComponent(word))
                .then(function (_a) {
                var data = _a.data;
                return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_b) {
                        interaction.followUp("__**" + data[0].word.replace(/^./, function (a) { return a.toUpperCase(); }) + "**__: " + (data[0].phonetics[0].text ? "(" + data[0].phonetics[0].text + ")" : "") + "\n" + data[0].meanings.map(function (meaning) { return "> __" + meaning.partOfSpeech.replace(/^./, function (a) { return a.toUpperCase(); }) + ":__ " + meaning.definitions[0].definition + (meaning.definitions[0].synonyms && meaning.definitions[0].synonyms.length ? "\n*" + translations.data.synonyms() + ": " + meaning.definitions[0].synonyms.join(", ") + "*" : ""); }).join("\n\n"));
                        return [2 /*return*/];
                    });
                });
            })
                .catch(function (err) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (err.response.data.title && err.response.data.title === "No Definitions Found")
                        return [2 /*return*/, interaction.followUp(translations.data.invalid_word())];
                    console.error(err);
                    return [2 /*return*/];
                });
            }); });
            return [2 /*return*/];
        });
    }); }
};
exports.default = command;
