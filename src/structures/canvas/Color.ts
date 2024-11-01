import { GuildEmoji, HexColorString } from "discord.js";

export default class Color {
	readonly id: number;
	readonly name: string;
	readonly alias: string;
	readonly emoji: GuildEmoji;
	red: number;
	green: number;
	blue: number;

	constructor(id: number, name: string, alias: string, color: ColorCode, emoji: GuildEmoji) {
		this.id = id;
		this.name = name;
		this.alias = alias;
		this.emoji = emoji;

		switch (typeof color) {
			case "string":
				this.red = parseInt(color.substring(1, 3), 16);
				this.green = parseInt(color.substring(3, 5), 16);
				this.blue = parseInt(color.substring(5, 7), 16);
				break;

			case "number":
				if (color < 0 || color > 16777215) color = 0;
				this.red = Math.floor(color / (256 * 256));
				this.green = Math.floor((color % (256 * 256)) / 256);
				this.blue = color % 256;
				break;

			default:
				this.red = color[0] < 0 || color[0] > 255 ? 0 : color[0];
				this.green = color[1] < 0 || color[1] > 255 ? 0 : color[1];
				this.blue = color[2] < 0 || color[2] > 255 ? 0 : color[2];
		}
	}

	get decimal() {
		return 256 * 256 * this.red + 256 * this.green + this.blue;
	}

	get hex() {
		return `#${
			this.red.toString(16).padStart(2, "0") +
			this.green.toString(16).padStart(2, "0") +
			this.blue.toString(16).padStart(2, "0")
		}`;
	}

	get rgb() {
		return [this.red, this.green, this.blue];
	}
}

type ColorCode = HexColorString | number | [number, number, number];
