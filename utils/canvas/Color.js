class Color {
	name;
	alias;
	/**@type number */
	red;
	/**@type number */
	green;
	/**@type number */
	blue;

	/**
	 * A Color
	 * @param {string} name The full name of the color
	 * @param {string} alias A 4-letter alias
	 * @param {string|number|number[]} code The hexadecimal, decimal or RGB color code
	 */
	constructor(name, alias, code) {
		if (typeof name !== "string") throw new Error("InvalidColorName");
		this.name = name;

		if (typeof alias !== "string" || alias.length !== 4) throw new Error("InvalidColorAlias");
		this.alias = alias;

		if (typeof code === "string" && /#[\dabcdef]{6}/i.test(code)) {
			this.red = parseInt(code.substr(1, 2), 16);
			this.green = parseInt(code.substr(3, 2), 16);
			this.blue = parseInt(code.substr(5, 2), 16);
		} else if (typeof code === "number" && 0 <= code <= 16777215) {
			this.red = Math.floor(code / (256 * 256));
			this.green = Math.floor((code % (256 * 256)) / 256);
			this.blue = code % 256;
		} else if (code.length && code.length === 3 && code.every(v => typeof v === "number" && 0 <= v <= 255)) {
			this.red = code[0];
			this.green = code[1];
			this.blue = code[2];
		} else {
			throw new Error("InvalidColorCode");
		}
	}

	get decimal() {
		return 256 * 256 * this.red + 256 * this.green + this.blue;
	}

	get hexadecimal() {
		return `#${this.red.toString(16) + this.green.toString(16) + this.blue.toString(16)}`;
	}

	get rgb() {
		return [ this.red, this.green, this.blue ];
	}
}

module.exports = Color;