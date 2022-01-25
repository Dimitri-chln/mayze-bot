import Path from "path";
import { Collection } from "discord.js";
import { google as Google } from "googleapis";
import Util from "../../Util";



export type Language = "fr" | "en";


export default class Translations {
	readonly id: string;
	readonly language: Language;
	private _data: Collection<string, string>;
	data: {
		[K: string]: (...args: (string | boolean)[]) => string;
	};

	constructor(id: string, language: Language) {
		this.id = id;
		this.language = language;
	}

	init(): Promise<this> {
		const sheets = Google.sheets({ version: "v4", auth: Util.googleAuth });
		
		return new Promise((resolve, reject) => {
			sheets.spreadsheets.values.get({
				spreadsheetId: process.env.TRANSLATIONS_SHEET_ID,
				range: `${this.id}!A1:E25`,
			}, (err, res) => {
				if (err) return reject("The API returned an error: " + err);
			
				const rows = res.data.values;
				const columnIndex = rows[0].indexOf(this.language.toUpperCase()) ?? 1;
			
				this._data = new Collection(
					rows.map(row => [ row[0], row[columnIndex] ])
				);
				this.data = {};

				for (const translationName of this._data.keys()) {
					this.data[translationName] = (...args: (string | boolean)[]) => {
						args = args.map(a => a
							? a.toString()
								.replace(/{/g, "~c")
								.replace(/}/g, "~b")
								.replace(/\[/g, "~s")
								.replace(/\]/g, "~t")
								.replace(/:/g, "~d")
								.replace(/\?/g, "~q")
							: a
						);
					
						let text = this._data.get(translationName);
						if (typeof text !== "string") return text;
							
						text = text.replace(/\{\d+?\}/g, a => args[parseInt(a.replace(/[\{\}]/g, "")) - 1] as string);
					
						while (/\[\d+?\?[^\[\]]*?:.*?\]/gs.test(text)) {
							text = text
								.replace(/\[\d+?\?[^\[\]]*?:.*?\]/gs, a => {
									let m = a.match(/\[(\d+?)\?([^\[\]]*?):(.*?)\]/s);
									if (args[parseInt(m[1]) - 1]) return m[2];
									else return m[3];
								});
						}
					
						text = text
							.replace(/~c/g, "{")
							.replace(/~b/g, "}")
							.replace(/~s/g, "[")
							.replace(/~t/g, "]")
							.replace(/~d/g, ":")
							.replace(/~q/g, "?");
					
						return text;
					}
				}

				resolve(this);
			});
		});
	}
}