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
var LanguageStrings_1 = __importDefault(require("../types/structures/LanguageStrings"));
var getLevel_1 = __importDefault(require("./getLevel"));
var config_json_1 = require("../config.json");
function voiceXp(database, member, givenXP, language) {
    if (language === void 0) { language = "en"; }
    return __awaiter(this, void 0, void 0, function () {
        var languageStrings, rows, xp, levelInfo, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    languageStrings = new LanguageStrings_1.default(__filename, language);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, database.query("\n\t\t\tINSERT INTO levels (user_id, voice_xp) VALUES ($1, $2)\n\t\t\tON CONFLICT (user_id)\n\t\t\tDO UPDATE SET\n\t\t\t\tvoice_xp = levels.voice_xp + $2 WHERE levels.user_id = $1\n\t\t\tRETURNING levels.voice_xp\n\t\t\t", [member.user.id, givenXP])];
                case 2:
                    rows = (_a.sent()).rows;
                    xp = rows[0].voice_xp;
                    levelInfo = (0, getLevel_1.default)(xp);
                    if (levelInfo.currentXP < givenXP && member.guild.id === config_json_1.MAIN_GUILD_ID)
                        member.user.send(languageStrings.data.level_up(language, levelInfo.level.toString())).catch(console.error);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    throw err_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.default = voiceXp;
