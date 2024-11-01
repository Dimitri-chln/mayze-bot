import { Collection } from "discord.js";

import Color from "./Color";

export default class Palette {
	readonly id: number;
	readonly name: string;
	readonly colors: Collection<number, Color>;

	constructor(id: number, name: string, colors = []) {
		this.id = id;
		this.name = name;
		this.colors = new Collection(colors.map((c) => [c.alias, c]));
	}
}
