import Path from "path";
import { Collection } from "discord.js";



export type Language = "fr" | "en";

type Dynamic<T> = {
	[x: string]: T;
}

export default class LanguageStrings {
	filename: string;
	language: Language;
	private _data: Collection<string, string>;
	data: Dynamic<(...args: (string | boolean)[]) => string>;

	constructor(pathOrFilename: string, language: Language) {
		const filename = Path.basename(pathOrFilename, Path.extname(pathOrFilename));
		this.filename = filename;
		this.language = language;

		const rawData = require(`../../assets/language_strings/${filename}.json`);
		this._data = new Collection(
			Object.entries(rawData).map(([ key, value ]) => [ key, value[language] ])
		);
		this.data = {};

		for (const languageStringName of this._data.keys()) {
			this.data[languageStringName] = (...args: (string | boolean)[]) => {
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
			
				let text = this._data.get(languageStringName);
				
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
	}
}