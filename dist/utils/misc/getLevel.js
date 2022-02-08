"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = __importDefault(require("../../Util"));
function getLevel(xp, level) {
    if (level === void 0) { level = 0; }
    var xpForLevel = Util_1.default.config.BASE_XP + level * Util_1.default.config.XP_INCREMENT;
    if (xp < xpForLevel)
        return { level: level, currentXP: xp, neededXP: xpForLevel };
    return getLevel(xp - xpForLevel, level + 1);
}
exports.default = getLevel;
