import { BASE_XP, XP_INCREMENT } from "../../config.json";



interface LevelInfo {
	level: number;
	currentXP: number;
	neededXP: number;
}

export default function getLevel(xp: number, level: number = 0): LevelInfo {
	const xpForLevel = BASE_XP + level * XP_INCREMENT;
	
	if (xp < xpForLevel)
		return { level, currentXP: xp, neededXP: xpForLevel };
	
	return getLevel(xp - xpForLevel, level + 1);
}