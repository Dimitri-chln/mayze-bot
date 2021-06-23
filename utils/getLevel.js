const { BASE_XP, XP_INCREMENT } = require("../config.json");

/**
 * @param {number} xp 
 * @param {number} lvl 
 * @returns {{ level: number, currentXP: number, neededXP: number }}
 */
function getLevel(xp, lvl = 0) {
    const xpForLevel = BASE_XP + lvl * XP_INCREMENT;
    if (xp < xpForLevel) return { level: lvl, currentXP: xp, neededXP: xpForLevel };
    return getLevel(xp - xpForLevel, lvl + 1);
}

module.exports = getLevel;