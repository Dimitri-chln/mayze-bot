import Util from "../../Util";

import Color from "./Color";
import Canvas from "./Canvas";

export default class Grid {
	readonly canvas: Canvas;
	readonly x: number;
	readonly y: number;
	readonly pixels: Color[][];

	constructor(canvas: Canvas, x: number, y: number, pixels: Color[][]) {
		this.canvas = canvas;
		this.x = x;
		this.y = y;
		this.pixels = pixels;
	}

	display() {
		const blank = Util.client.guilds.cache.get(Util.config.ADMIN_GUILD_ID).emojis.cache.find((e) => e.name === "blank");
		let content = `**${this.canvas.name.replace(/^./, (match) => match.toUpperCase())} - (${this.x}, ${this.y})**\n`;

		for (let i = 0; i < 7; i++) {
			content += this.pixels[i].map((color) => (color ? color.emoji : blank)).join("");

			if (i === 2) content += " ⬆️";
			if (i === 3) content += ` **${this.y}** (y)`;
			if (i === 4) content += " ⬇️";

			content += "\n";
		}

		content += `${blank.toString()} ⬅️ **${this.x}** (x) ➡️`;

		return content;
	}
}
