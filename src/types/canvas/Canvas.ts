import { Client, Collection, Snowflake, User } from "discord.js";
import Pg from "pg";
import Jimp from "jimp";

import Util from "../../Util";
import Palette from "./Palette";
import Color from "./Color";
import Grid from "./Grid";
import { DatabaseCanvas, CanvasOwnerType } from "../structures/Database";

export default class Canvas {
	name: string;
	palettes: Collection<string, Palette>;
	private _size: number;
	private _owner: CanvasOwner;
	private _users: Collection<Snowflake, User>;

	constructor(name: string, client: Client, palettes: Collection<string, Palette>) {
		this.name = name;
		this.palettes = palettes;
		Util.database
			.query("SELECT * FROM canvas WHERE name = $1", [name])
			.then(async ({ rows: [canvas] }: { rows: DatabaseCanvas[] }) => {
				this._size = canvas.size;
				this._owner = {
					type: canvas.owner_type,
					id: canvas.owner_id,
				};
				this._users = new Collection(
					await Promise.all(canvas.users.map((userId) => Promise.all([userId, client.users.fetch(userId)]))),
				);
			});
	}

	static create(
		name: string,
		client: Client,
		database: Pg.Client,
		palettes: Collection<string, Palette>,
		size: number,
	) {
		const data = [];
		for (let y = 0; y < size; y++) {
			let row = [];
			for (let x = 0; x < size; x++) row.push("blnk");
			data.push(row);
		}

		database.query("INSERT INTO canvas VALUES ($1, $2, $3)", [name, size, JSON.stringify(data)]);

		return new Canvas(name, client, palettes);
	}

	get size() {
		return this._size;
	}

	get owner() {
		return this._owner;
	}

	get users() {
		return this._users;
	}

	get data(): Promise<string[][]> {
		return new Promise((resolve, reject) => {
			Util.database
				.query("SELECT * FROM canvas WHERE name = $1", [this.name])
				.then((res) => {
					resolve(res.rows[0].data);
				})
				.catch((err) => {
					console.error(err);
					reject("DatabaseError");
				});
		});
	}

	/**
	 * Add a user to the canvas
	 */
	async addUser(user: User) {
		// Remove users from all other canvas
		await Util.database.query("UPDATE canvas SET users = array_diff(users, $1)", [[user.id]]);

		// Add user to the new canvas
		await Util.database.query("UPDATE canvas SET users = users || $1 WHERE name = $2", [[user.id], this.name]);

		for (const canvas of Util.canvas.values()) canvas._users.delete(user.id);

		this._users.set(user.id, user);
	}

	/**
	 * Modify a pixel in the canvas.
	 */
	async setPixel(x: number, y: number, color: Color) {
		if (x < 0 || x >= this.size || y < 0 || y >= this.size) throw new Error("InvalidCoordinates");

		let data = await this.data;
		data[y][x] = color.alias;

		Util.database.query("UPDATE canvas SET data = $1 WHERE name = $2", [JSON.stringify(data), this.name]);
	}

	/**
	 * Get a 7x7 grid of the canvas around the selected pixel.
	 */
	async viewGrid(x: number, y: number): Promise<Grid> {
		if (x < 0 || x >= this.size || y < 0 || y >= this.size) throw new Error("InvalidCoordinates");

		let data = await this.data;
		let grid: Color[][] = [];

		for (let yShift = -3; yShift <= 3; yShift++) {
			let row = [];

			for (let xShift = -3; xShift <= 3; xShift++) {
				row.push(
					data[y + yShift] && data[y + yShift][x + xShift]
						? this.palettes
								.find((palette) => palette.has(data[y + yShift][x + xShift]))
								.get(data[y + yShift][x + xShift])
						: null,
				);
			}

			grid.push(row);
		}

		return new Grid(this, x, y, grid);
	}

	/**
	 * Display an image of the Canvas.
	 */
	async view(x: number, y: number, zoom: number | "default") {
		if (zoom && zoom !== "default" && (zoom < 1 || zoom > this.size)) throw new Error("InvalidZoom");
		if (zoom === "default") zoom = this.size;
		if (x < 0 || x >= this.size || y < 0 || y >= this.size) throw new Error("InvalidCoordinates");

		let data = await this.data;
		let newData = [];

		for (let yShift = y; yShift < zoom; yShift++) {
			let row = [];

			for (let xShift = x; xShift < zoom; xShift++) row.push(data[y + yShift] ? data[y + yShift][x + xShift] : null);

			newData.push(row);
		}

		data = newData;

		const pixelSize = Math.ceil(500 / data.length);
		const size = data.length * pixelSize;
		const borderSize = size / 16;
		const fullSize = size + 2 * borderSize;

		const image = new Jimp(fullSize, fullSize);

		// Create the borders
		const borderColor = Jimp.rgbaToInt(114, 137, 218, 255);
		for (let yBorder = 0; yBorder < borderSize; yBorder++) {
			for (let xBorder = 0; xBorder < fullSize; xBorder++) image.setPixelColor(borderColor, xBorder, yBorder);
		}

		for (let yBorder = fullSize - borderSize; yBorder < fullSize; yBorder++) {
			for (let xBorder = 0; xBorder < fullSize; xBorder++) image.setPixelColor(borderColor, xBorder, yBorder);
		}

		for (let yBorder = borderSize; yBorder < fullSize - borderSize; yBorder++) {
			for (let xBorder = 0; xBorder < borderSize; xBorder++) image.setPixelColor(borderColor, xBorder, yBorder);
		}

		for (let yBorder = borderSize; yBorder < fullSize - borderSize; yBorder++) {
			for (let xBorder = fullSize - borderSize; xBorder < fullSize; xBorder++)
				image.setPixelColor(borderColor, xBorder, yBorder);
		}

		// Display a canvas pixel
		for (let yPixel = 0; yPixel < data.length; yPixel++) {
			for (let xPixel = 0; xPixel < data.length; xPixel++) {
				let color =
					data[yPixel] && data[yPixel][xPixel]
						? this.palettes.find((palette) => palette.has(data[yPixel][xPixel])).get(data[yPixel][xPixel])
						: 0x000000;
				if (color instanceof Color)
					color = Jimp.rgbaToInt(color.red, color.green, color.blue, color.alias === "blnk" ? 128 : 255);

				// Make it <pixelSize> large
				for (let i = 0; i < pixelSize; i++) {
					for (let j = 0; j < pixelSize; j++) {
						image.setPixelColor(color, borderSize + xPixel * pixelSize + i, borderSize + yPixel * pixelSize + j);
					}
				}
			}
		}

		let buffer = await image.getBufferAsync(Jimp.MIME_PNG);

		return buffer;
	}
}

interface CanvasOwner {
	type: CanvasOwnerType;
	id?: Snowflake;
}
