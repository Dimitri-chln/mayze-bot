import { Collection } from "discord.js";
import Color from "./Color";

export default class Palette {
	private colors: Collection<string, Color>;
	name: string;

	constructor(name: string, colors = []) {
		this.name = name;
		this.colors = new Collection(colors.map((c) => [c.alias, c]));
	}

	get(alias: string) {
		return this.colors.get(alias);
	}

	add(color: Color) {
		this.colors.set(color.alias, color);
	}

	remove(alias: string) {
		this.colors.delete(alias);
	}

	has(alias: string) {
		return this.colors.has(alias);
	}

	all() {
		return this.colors;
	}
}
