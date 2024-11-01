import Util from "../../Util";

import { GuildEmoji } from "discord.js";

import { DatabaseCanvas, DatabaseColor, DatabasePalette } from "../../types/Database";
import Palette from "../../structures/canvas/Palette";
import Color from "../../structures/canvas/Color";
import Canvas from "../../structures/canvas/Canvas";

export default async function initializeCanvas() {
	// Palettes
	const { rows: palettes }: { rows: DatabasePalette[] } = await Util.database.query("SELECT * FROM palette");

	for (const palette of palettes) {
		Util.palettes.set(palette.id, new Palette(palette.id, palette.name));
	}

	// Colors
	const { rows: colors }: { rows: DatabaseColor[] } = await Util.database.query("SELECT * FROM color");

	const emojiGuilds = Util.config.CANVAS_GUILD_IDS.map((guildId) => Util.client.guilds.cache.get(guildId));

	for (const color of colors) {
		const emojiGuild = emojiGuilds.find((g) => g.emojis.cache.some((e) => e.name === `pl_${color.alias}`));
		let emoji: GuildEmoji;

		if (emojiGuild) {
			// If the emoji is already in a guild
			emoji = emojiGuild.emojis.cache.find((e) => e.name === `pl_${color.alias}`);
		} else {
			// Otherwise, create a new one in an available emoji guild
			const newGuild = emojiGuilds.find((g) => g.emojis.cache.size < 50);

			const red = Math.floor(color.value / (256 * 256));
			const green = Math.floor((color.value % (256 * 256)) / 256);
			const blue = color.value % 256;
			const hex =
				red.toString(16).padStart(2, "0") + green.toString(16).padStart(2, "0") + blue.toString(16).padStart(2, "0");

			emoji = await newGuild.emojis.create({
				name: `pl_${color.alias}`,
				attachment: `https://dummyimage.com/256/${hex}?text=%20`,
			});
		}

		Util.palettes
			.get(color.palette)
			.colors.set(color.id, new Color(color.id, color.name, color.alias, color.value, emoji));
	}

	// Canvases
	const { rows: canvases }: { rows: DatabaseCanvas[] } = await Util.database.query(
		"SELECT id FROM canvas WHERE NOT archived",
	);

	for (const canvas of canvases) {
		Util.canvas.set(canvas.id, new Canvas(canvas.id));
	}
}
