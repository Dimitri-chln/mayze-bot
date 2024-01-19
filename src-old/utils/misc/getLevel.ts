import Util from "../../Util";

interface LevelInfo {
	level: number;
	currentXP: number;
	neededXP: number;
}

export default function getLevel(xp: number, level: number = 0): LevelInfo {
	const xpForLevel = Util.config.BASE_XP + level * Util.config.XP_INCREMENT;

	if (xp < xpForLevel) return { level, currentXP: xp, neededXP: xpForLevel };

	return getLevel(xp - xpForLevel, level + 1);
}
