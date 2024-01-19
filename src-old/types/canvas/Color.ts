import { GuildEmoji, HexColorString } from "discord.js";

type ColorCode = HexColorString | number | [number, number, number];

export default class Color {
	name: string;
	alias: string;
	emoji: GuildEmoji;
	red: number;
	green: number;
	blue: number;

	constructor(name: string, alias: string, color: ColorCode, emoji: GuildEmoji) {
		this.name = name;
		this.alias = alias;
		this.emoji = emoji;

		switch (typeof color) {
			case "string":
				this.red = parseInt(color.substr(1, 2), 16);
				this.green = parseInt(color.substr(3, 2), 16);
				this.blue = parseInt(color.substr(5, 2), 16);
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
