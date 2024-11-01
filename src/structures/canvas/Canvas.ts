import Util from "../../Util";

import { Client, Collection, Snowflake, User } from "discord.js";
import Jimp from "jimp";

import Palette from "./Palette";
import Color from "./Color";
import Grid from "./Grid";
import { DatabaseCanvas, CanvasOwnerType, DatabaseCanvasPalette, DatabaseUser } from "../../types/Database";

export default class Canvas {
	readonly id: number;
	private _name: string;
	private _size: number;
	private _owner: CanvasOwner;
	private _palettes: Collection<number, Palette>;
	private _users: Collection<Snowflake, User>;

	constructor(id: number) {
		this.id = id;

		Util.database
			.query("SELECT * FROM canvas WHERE id = $1", [id])
			.then(async ({ rows: [canvas] }: { rows: DatabaseCanvas[] }) => {
				this._name = canvas.name;
				this._size = canvas.size;
				this._owner = {
					type: canvas.owner_type,
					id: canvas.owner_id,
				};

				// Fetch canvas palettes
				const { rows: paletteIdsData }: { rows: Pick<DatabaseCanvasPalette, "palette_id">[] } =
					await Util.database.query("SELECT palette_id FROM canvas_palette WHERE canvas_id = $1", [canvas.id]);
				const paletteIds = paletteIdsData.map((paletteIdData) => paletteIdData.palette_id);
				this._palettes = Util.palettes.filter((palette) => paletteIds.includes(palette.id));

				// Fetch canvas users
				const { rows: userIdsData }: { rows: Pick<DatabaseUser, "id">[] } = await Util.database.query(
					'SELECT id FROM "user" WHERE canvas_id = $1',
					[canvas.id],
				);
				this._users = new Collection(
					userIdsData.map((userIdData) => [userIdData.id, Util.client.users.cache.get(userIdData.id)]),
				);
			});
	}

	static async create(
		name: string,
		size: number,
		palettes: Collection<string, Palette>,
		ownerType?: CanvasOwnerType,
		ownerId?: Snowflake,
	) {
		const data = [];

		for (let y = 0; y < size; y++) {
			let row = [];
			for (let x = 0; x < size; x++) row.push("blnk");
			data.push(row);
		}

		const {
			rows: [{ id: canvasId }],
		}: { rows: Pick<DatabaseCanvas, "id">[] } = await Util.database.query(
			"INSERT INTO canvas (name, size, owner_type, owner_id, data) VALUES ($1, $2, $3, $4, $5) RETURNING id",
			[name, size, ownerType, ownerId, JSON.stringify(data)],
		);

		palettes.forEach((palette) =>
			Util.database.query("INSERT INTO canvas_palette VALUES ($1, $2", [canvasId, palette.id]),
		);

		return new Canvas(canvasId);
	}

	get name() {
		return this._name;
	}

	get size() {
		return this._size;
	}

	get owner() {
		return this._owner;
	}

	get palettes() {
		return this._palettes;
	}

	get users() {
		return this._users;
	}

	get colors() {
		let colors: Collection<number, Color> = new Collection();
		this.palettes.forEach((palette) => (colors = colors.concat(palette.colors)));
		return colors;
	}

	get data(): Promise<Color[][]> {
		return new Promise((resolve, reject) => {
			Util.database.query("SELECT * FROM canvas WHERE id = $1", [this.id]).then((res) => {
				const data = res.rows[0].data;

				for (let i = 0; i < this.size; i++) {
					for (let j = 0; j < this.size; j++) {
						data[i][j] = this.colors.get(data[i][j]);
					}
				}

				resolve(data);
			});
		});
	}

	/**
	 * Checks if a user is bound to the canvas
	 */
	hasUser(user: User) {
		return this._users.has(user.id);
	}

	/**
	 * Add a user to the canvas
	 */
	async addUser(user: User) {
		await Util.database.query(
			`
			INSERT INTO "user" (id, canvas_id) VALUES ($1, $2)
			ON CONFLICT (id)
			DO UPDATE SET
				canvas_id = EXCLUDED.canvas_id
			WHERE "user".id = EXCLUDED.id
			`,
			[user.id, this.id],
		);

		Util.canvas.forEach((canvas) => canvas.deleteUser(user));
		this._users.set(user.id, user);
	}

	/**
	 * Delete a user from the canvas
	 */
	deleteUser(user: User) {
		this._users.delete(user.id);
	}

	/**
	 * Modify a pixel in the canvas.
	 */
	async setPixel(x: number, y: number, color: Color) {
		if (x < 0 || x >= this.size || y < 0 || y >= this.size) throw new Error("InvalidCoordinates");

		const {
			rows: [{ data }],
		} = await Util.database.query("SELECT * FROM canvas WHERE id = $1", [this.id]);

		data[y][x] = color.id;

		await Util.database.query("UPDATE canvas SET data = $1 WHERE id = $2", [JSON.stringify(data), this.id]);
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
				row.push(data[y + yShift] && data[y + yShift][x + xShift] ? data[y + yShift][x + xShift] : null);
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
		if (x < 0 || x >= this.size || y < 0 || y >= this.size) throw new Error("InvalidCoordinates");

		let data = await this.data;

		if (x !== 0 || y !== 0 || zoom !== "default") {
			if (zoom === "default") zoom = this.size;

			let newData = [];
			for (let yShift = 0; yShift < zoom; yShift++) {
				let row = [];
				for (let xShift = 0; xShift < zoom; xShift++) {
					row.push(data[y + yShift] ? data[y + yShift][x + xShift] : null);
				}
				newData.push(row);
			}

			data = newData;
		}

		const pixelSize = Math.ceil(500 / data.length);
		const imageSize = data.length * pixelSize;
		const borderSize = Math.round(imageSize / 16);
		const fullSize = imageSize + 2 * borderSize;

		console.log(data);
		console.log(fullSize);

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
				let color: number;

				if (data[yPixel] && data[yPixel][xPixel]) {
					const pixelColor = data[yPixel][xPixel];
					color = Jimp.rgbaToInt(
						pixelColor.red,
						pixelColor.green,
						pixelColor.blue,
						pixelColor.alias === "blnk" ? 128 : 255,
					);
				} else color = 0x000000;

				// Make it pixelSize large
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
