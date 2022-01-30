"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_json_1 = require("../../config.json");
function getLevel(xp, level) {
    if (level === void 0) { level = 0; }
    var xpForLevel = config_json_1.BASE_XP + level * config_json_1.XP_INCREMENT;
    if (xp < xpForLevel)
        return { level: level, currentXP: xp, neededXP: xpForLevel };
    return getLevel(xp - xpForLevel, level + 1);
}
exports.default = getLevel;
