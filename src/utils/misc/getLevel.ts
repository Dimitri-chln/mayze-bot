import Util from "../../Util";

interface LevelInfo {
	xp: number;
	level: number;
	nextLevel: number;
	xpForCurrentLevel: number;
	xpForNextLevel: number;
	currentXp: number;
	neededXp: number;
	decimalLevel: number;
}

export default function getLevel(xp: number): LevelInfo {
	const base = Util.config.BASE_XP;
	const increment = Util.config.XP_INCREMENT;

	const decimalLevel =
		Math.sqrt((2 * xp * increment + base ** 2 - base * increment) / increment ** 2 + 0.25) - base / increment + 0.5;

	const level = Math.floor(decimalLevel);
	const nextLevel = level + 1;

	const xpForCurrentLevel = level * base + (increment * level * (level - 1)) / 2;
	const xpForNextLevel = nextLevel * base + (increment * nextLevel * (nextLevel - 1)) / 2;

	const currentXp = xp - xpForCurrentLevel;
	const neededXp = xpForNextLevel - xp;

	return { xp, level, nextLevel, xpForCurrentLevel, xpForNextLevel, currentXp, neededXp, decimalLevel };
}
