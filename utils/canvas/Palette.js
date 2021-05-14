const Color = require("./Color");

class Palette {
	/**@type Map<string, Color> */
	#colors;
	#name;

	/**
	 * A Palette of Colors
	 * @param {string} name The name of the Palette
	 * @param {Color[]=} colors A list of Colors
	 */
	constructor(name, colors) {
		this.#name = name;
		this.#colors = colors
			? new Map(colors.map(c => [ c.alias, c ]))
			: new Map();
	}

	get name() { return this.#name; }

	/**
	 * Get a Color from the Palette
	 * @param {string} color The Color's alias
	 */
	get(color) {
		return this.#colors.get(color);
	}

	/**
	 * Add a new Color to the Palette
	 * @param {string} name The name of the Color
	 * @param {string} alias A 4-letter alias
	 * @param {string|number|number[]} code The hexadecimal, decimal or RGB color code
	 */
	add(name, alias, code) {
		let color = new Color(name, alias, code);
		this.#colors.set(alias, color);
		return color;
	}

	/**
	 * Remove a Color from the Palette
	 * @param {string} color The Color's alias
	 */
	remove(color) {
		this.#colors.delete(color);
	}

	/**
	 * Check if the Palette has a Color
	 * @param {string} color The Color's alias
	 */
	has(color) {
		return this.#colors.has(color);
	}

	/**
	 * Get the list of all Colors
	 */
	all() {
		return this.#colors;
	}
}

module.exports = Palette;