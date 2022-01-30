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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = __importDefault(require("../../Util"));
var command = {
    name: "daily",
    description: {
        fr: "Récupérer tes récompenses quotidiennes",
        en: "Claim your daily rewards"
    },
    userPermissions: [],
    botPermissions: ["EMBED_LINKS"],
    options: {
        fr: [],
        en: []
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        var DAY_IN_MS, NOW, MIDNIGHT, _a, userCurrency, lastDaily, timeLeft, timeLeftHumanized, _b, money;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    DAY_IN_MS = 1000 * 60 * 60 * 24;
                    NOW = new Date();
                    MIDNIGHT = new Date();
                    MIDNIGHT.setHours(0, 0, 0, 0);
                    return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM currency WHERE user_id = $1", [interaction.user.id])];
                case 1:
                    _a = __read.apply(void 0, [(_c.sent()).rows, 1]), userCurrency = _a[0];
                    lastDaily = userCurrency
                        ? new Date(userCurrency.last_daily)
                        : new Date(0);
                    if (lastDaily.valueOf() > MIDNIGHT.valueOf()) {
                        timeLeft = Math.ceil((MIDNIGHT.valueOf() + DAY_IN_MS.valueOf() - NOW.valueOf()) / 1000);
                        timeLeftHumanized = new Date((timeLeft % 86400) * 1000)
                            .toUTCString()
                            .replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, "$1h $2m $3s")
                            .replace(/00h |00m /g, "");
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.cooldown(timeLeftHumanized),
                                ephemeral: true
                            })];
                    }
                    return [4 /*yield*/, Util_1.default.database.query("\n\t\t\tINSERT INTO currency VALUES ($1, $2, $3)\n\t\t\tON CONFLICT (user_id)\n\t\t\tDO UPDATE SET\n\t\t\t\tmoney = currency.money + $2,\n\t\t\t\tlast_daily = $3\n\t\t\tWHERE currency.user_id = EXCLUDED.user_id\n\t\t\tRETURNING money\n\t\t\t", [interaction.user.id, Util_1.default.config.DAILY_REWARD, new Date(NOW).toISOString()])];
                case 2:
                    _b = __read.apply(void 0, [(_c.sent()).rows, 1]), money = _b[0].money;
                    interaction.reply({
                        embeds: [
                            {
                                author: {
                                    name: translations.data.title(),
                                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                },
                                color: interaction.guild.me.displayColor,
                                description: translations.data.description(Util_1.default.config.DAILY_REWARD.toString(), money.toString()),
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
