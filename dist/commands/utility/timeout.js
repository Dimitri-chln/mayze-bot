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
var dhms_1 = __importDefault(require("dhms"));
var formatTime_1 = __importDefault(require("../../utils/misc/formatTime"));
var command = {
    name: "timeout",
    description: {
        fr: "Timeout un utilisateur sur le serveur",
        en: "Timeout a user on this server"
    },
    userPermissions: ["MODERATE_MEMBERS"],
    botPermissions: ["MODERATE_MEMBERS"],
    options: {
        fr: [
            {
                name: "user",
                description: "L'utilisateur à timeout",
                type: "USER",
                required: true
            },
            {
                name: "duration",
                description: "La durée du timeout",
                type: "STRING",
                required: false
            }
        ],
        en: [
            {
                name: "user",
                description: "The user to timeout",
                type: "USER",
                required: true
            },
            {
                name: "duration",
                description: "The timeout's duration",
                type: "STRING",
                required: false
            }
        ]
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        var member, duration;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    member = interaction.guild.members.cache.get(interaction.options.getUser("user").id);
                    if (member.roles.highest.position >= interaction.member.roles.highest.position
                        && interaction.user.id !== Util_1.default.owner.id)
                        return [2 /*return*/, interaction.followUp({
                                content: translations.data.not_allowed(),
                                ephemeral: true
                            })];
                    duration = (0, dhms_1.default)(interaction.options.getString("duration"));
                    return [4 /*yield*/, member.timeout(duration !== null && duration !== void 0 ? duration : 365 * 24 * 60 * 60 * 1000, translations.data.reason(interaction.user.tag))];
                case 1:
                    _a.sent();
                    interaction.followUp(translations.data.timed_out(member.user.tag, Boolean(duration), (0, formatTime_1.default)(duration, translations.language)));
                    return [2 /*return*/];
            }
        });
    }); }
};
exports.default = command;