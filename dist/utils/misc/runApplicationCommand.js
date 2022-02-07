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
var discord_js_1 = require("discord.js");
var Util_1 = __importDefault(require("../../Util"));
var Translations_1 = __importDefault(require("../../types/structures/Translations"));
function runApplicationCommand(command, interaction) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var language, translations, commandTranslations, NOW, channelCooldown, userPermissions, missingUserPermissions, missingBotPermissions, cooldownReduction, _c, userUpgrades, cooldownAmount, expirationTime, timeLeft, timeLeftHumanized;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    language = Util_1.default.languages.get(interaction.guild.id);
                    return [4 /*yield*/, new Translations_1.default("run", language).init()];
                case 1:
                    translations = _d.sent();
                    commandTranslations = new Translations_1.default("cmd_" + command.name, language);
                    NOW = Date.now();
                    channelCooldown = (_a = Util_1.default.channelCooldowns.get(interaction.channel.id)) !== null && _a !== void 0 ? _a : {
                        numberOfMessages: 0,
                        lastMessageTimestamp: 0
                    };
                    if (channelCooldown.numberOfMessages === 0)
                        setTimeout(function () { return Util_1.default.channelCooldowns.delete(interaction.channel.id); }, 10000);
                    if (channelCooldown.numberOfMessages >= 5)
                        return [2 /*return*/];
                    if (NOW - channelCooldown.lastMessageTimestamp < 500)
                        return [2 /*return*/];
                    Util_1.default.channelCooldowns.set(interaction.channel.id, {
                        numberOfMessages: channelCooldown.numberOfMessages + 1,
                        lastMessageTimestamp: NOW
                    });
                    if (command.category === "admin" && interaction.user.id !== Util_1.default.owner.id)
                        return [2 /*return*/];
                    userPermissions = interaction.member instanceof discord_js_1.GuildMember
                        ? interaction.member.permissionsIn(interaction.channel.id)
                        : new discord_js_1.Permissions(BigInt(interaction.member.permissions));
                    missingUserPermissions = command.userPermissions.filter(function (permission) { return !userPermissions.has(permission); });
                    if (missingUserPermissions.length && interaction.user.id !== Util_1.default.owner.id)
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.user_missing_permissions(missingUserPermissions.join("`, `")),
                                ephemeral: true
                            }).catch(console.error)];
                    missingBotPermissions = command.botPermissions.filter(function (permission) { return !interaction.guild.me.permissionsIn(interaction.channel.id).has(permission); });
                    if (missingBotPermissions.length)
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.bot_missing_perms(missingBotPermissions.join("`, `")),
                                ephemeral: true
                            }).catch(console.error)];
                    cooldownReduction = 0;
                    if (!(command.name === "catch")) return [3 /*break*/, 3];
                    return [4 /*yield*/, Util_1.default.database.query("SELECT catch_cooldown_reduction FROM upgrades WHERE user_id = $1", [interaction.user.id])];
                case 2:
                    _c = __read.apply(void 0, [(_d.sent()).rows, 1]), userUpgrades = _c[0];
                    if (userUpgrades)
                        cooldownReduction += 30 * userUpgrades.catch_cooldown_reduction;
                    _d.label = 3;
                case 3:
                    cooldownAmount = (((_b = command.cooldown) !== null && _b !== void 0 ? _b : 2) - cooldownReduction) * 1000;
                    if (command.cooldowns.has(interaction.user.id)) {
                        expirationTime = command.cooldowns.get(interaction.user.id) + cooldownAmount;
                        if (NOW < expirationTime) {
                            timeLeft = Math.ceil((expirationTime - NOW) / 1000);
                            timeLeftHumanized = new Date((timeLeft % 86400) * 1000)
                                .toUTCString()
                                .replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, "$1h $2m $3s")
                                .replace(/00h |00m /g, "");
                            return [2 /*return*/, interaction.reply({
                                    content: translations.data.cooldown(timeLeftHumanized, command.name),
                                    ephemeral: true
                                }).catch(console.error)];
                        }
                    }
                    command.cooldowns.set(interaction.user.id, NOW);
                    setTimeout(function () { return command.cooldowns.delete(interaction.user.id); }, cooldownAmount);
                    command.run(interaction, commandTranslations)
                        .catch(function (err) {
                        console.error(err);
                        if (interaction.replied)
                            interaction.followUp(translations.data.error()).catch(console.error);
                        else
                            interaction.reply(translations.data.error()).catch(console.error);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = runApplicationCommand;
