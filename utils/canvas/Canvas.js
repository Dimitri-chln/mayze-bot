const { Client, Collection } = require("discord.js");
const Jimp = require("jimp");
const Palette = require("./Palette");

class Canvas {
	#name;
	#client;
	/**@type number */
	#size;
	#palettes;

	/**
	 * A canvas
	 * @param {string} name The name of the canvas
	 * @param {Client} client The Discord client
	 * @param {Collection<string, Palette>} palettes The color Palette of the Canvas
	 * @param {number} size If creating a new Canvas, the size of the Canvas
	 */
	constructor(name, client, palettes, size) {
		this.#name = name;
		this.#client = client;
		this.#palettes = palettes;
		client.pg.query(`SELECT * FROM canvas WHERE name = '${name}'`)
			.then(res => {
				if (res.rows.length) {
					this.#size = res.rows[0].size;
				} else {
					this.#size = size;

					const data = [];
					for (let y = 0; y < size; y ++) {
						let row = [];
						for (let x = 0; x < size; x ++) row.push("blnk");
						data.push(row);
					}
					
					client.pg.query(`INSERT INTO canvas VALUES ('${this.#name}', ${size}, '${JSON.stringify(data)}')`);
				}
			});
	}

	get name() { return this.#name; }
	get size() { return this.#size; }
	get palettes() { return this.#palettes; }
	/**
	 * @returns {Promise<string[][]>}
	 */
	get data() {
		return new Promise((resolve, reject) => {
			this.#client.pg.query(`SELECT * FROM canvas WHERE name = '${this.#name}'`)
				.then(res => {
					resolve(res.rows[0].data);
				})
				.catch(err => {
					console.error(err);
					reject('DatabaseError');
				});
		});
	}

	/**
	 * Change a pixel's color
	 * @param {number} x The x coordinate of the pixel
	 * @param {number} y The y coordinate of the pixel
	 * @param {string} color The Color's alias
	 */
	async setPixel(x, y, color) {
		if (this.#palettes.every(palette => !palette.has(color))) throw new Error("InvalidColor");
		if (x < 0 || x >= this.#size || y < 0 || y >= this.#size) throw new Error("InvalidCoordinates");

		let data = await this.data;
		data[y][x] = color;
		await this.#client.pg.query(`UPDATE canvas SET data = '${JSON.stringify(data)}' WHERE name = '${this.#name}'`);
	}

	/**
	 * Get a 7x7 grid of the canvas around the selected pixel
	 * @param {number} x The x coordinate of the pixel
	 * @param {number} y The y coordinate of the pixel
	 */
	async viewNav(x, y) {
		if (x < 0 || x >= this.#size || y < 0 || y >= this.#size) throw new Error("InvalidCoordinates");

		let data = await this.data;
		let grid = [];
		for (let yShift = -3; yShift <= 3; yShift ++) {
			let row = [];
			for (let xShift = -3; xShift <= 3; xShift ++) row.push(data[y + yShift] && data[y + yShift][x + xShift] ? this.#palettes.find(palette => palette.has(data[y + yShift][x + xShift])).get(data[y + yShift][x + xShift]) : undefined);
			grid.push(row);
		}

		return grid;
	}

	/**
	 * Display an image of the Canvas
	 * @param {number=} x The center x coordinate of the image
	 * @param {number=} y The center y coordinate of the image
	 * @param {number=} zoom The number of pixels to show on the image
	 */
	async view(x, y, zoom) {
		if (zoom && zoom !== "default" && (zoom < 1 || zoom > this.#size / 2)) throw new Error("ZoomTooBig");
		if (zoom === "default") zoom = Math.round(this.#size / 10);

		let data = await this.data;

		if (typeof x === "number" && typeof y === "number" && !isNaN(x) && !isNaN(y)) {
			if (x < 0 || x >= this.#size || y < 0 || y >= this.#size) throw new Error("InvalidCoordinates");
			let newData = [];
			for (let yShift = -zoom; yShift <= zoom; yShift ++) {
				let row = [];
				for (let xShift = -zoom; xShift <= zoom; xShift ++)
					row.push(data[y + yShift] ? data[y + yShift][x + xShift] : undefined);
				newData.push(row);
			}
			data = newData;
		}

		const pixelSize = Math.ceil(500 / data.length);
		const size = data.length * pixelSize;
		const borderSize = size / 17;
		const fullSize = size + 2 * borderSize;

		let image = new Jimp(fullSize, fullSize);

		// Create the borders
		const borderColor = Jimp.rgbaToInt(114, 137, 218, 255);
		for (let yBorder = 0; yBorder < borderSize; yBorder ++) {
			for (let xBorder = 0; xBorder < fullSize; xBorder ++)
				image.setPixelColor(borderColor, xBorder, yBorder);
		}
		for (let yBorder = fullSize - borderSize; yBorder < fullSize; yBorder ++) {
			for (let xBorder = 0; xBorder < fullSize; xBorder ++)
				image.setPixelColor(borderColor, xBorder, yBorder);
		}
		for (let yBorder = borderSize; yBorder < fullSize - borderSize; yBorder ++) {
			for (let xBorder = 0; xBorder < borderSize; xBorder ++)
				image.setPixelColor(borderColor, xBorder, yBorder);
		}
		for (let yBorder = borderSize; yBorder < fullSize - borderSize; yBorder ++) {
			for (let xBorder = fullSize - borderSize; xBorder < fullSize; xBorder ++)
				image.setPixelColor(borderColor, xBorder, yBorder);
		}
		
		// Display a canvas pixel
		for (let yPixel = 0; yPixel < data.length; yPixel ++) {
			for (let xPixel = 0; xPixel < data.length; xPixel ++) {
				let color = data[yPixel] && data[yPixel][xPixel]
					? this.#palettes.find(palette => palette.has(data[yPixel][xPixel])).get(data[yPixel][xPixel])
					: 0x000000;
				if (color) color = Jimp.rgbaToInt(color.red, color.green, color.blue, 255);

				// Make it <pixelSize> large
				for (let i = 0; i < pixelSize; i ++) {
					for (let j = 0; j < pixelSize; j ++) {
						image.setPixelColor(color, borderSize + xPixel * pixelSize + i, borderSize + yPixel * pixelSize + j);
					}
				}
			}
		}

		let buffer = await image.getBufferAsync(Jimp.MIME_PNG);

		return buffer;
	}
}

module.exports = Canvas;