import { Collection } from "discord.js";
import { google as Google } from "googleapis";
import Util from "../../Util";

export type Language = "fr" | "en";

export default class Translations {
	static readonly cache: Collection<string, TranslationsData> =
		new Collection();

	readonly id: string;
	readonly data: TranslationsData;

	constructor(id: string) {
		this.id = id;
		this.data =
			Translations.cache.get(this.id) ??
			Util.config.LANGUAGES.reduce(
				(data: TranslationsData, language: Language) => {
					data[language] = { language, strings: {} };
					return data;
				},
				{},
			);
	}

	init(n: number = 0): Promise<this> {
		const sheets = Google.sheets({ version: "v4", auth: Util.googleAuth });

		return new Promise((resolve, reject) => {
			if (Translations.cache.has(this.id)) return resolve(this);

			// Retry backoff
			setTimeout(() => {
				sheets.spreadsheets.values.get(
					{
						spreadsheetId: process.env.TRANSLATIONS_SHEET_ID,
						range: `${this.id}!A1:Z100`,
					},
					(err, res) => {
						if (err) return n > 10 ? reject(err) : this.init(n + 1);

						const data = res.data.values;

						for (let column = 1; column < data[0].length; column++) {
							const language = data[0][column].toLowerCase() as Language;
							if (!Util.config.LANGUAGES.includes(language)) continue;

							for (let row = 1; row < data.length; row++) {
								this.data[language].strings[data[row][0]] = (
									...args: (string | boolean)[]
								) => {
									args = args.map((a) =>
										a
											? a
													.toString()
													.replace(/{/g, "~c")
													.replace(/}/g, "~b")
													.replace(/\[/g, "~s")
													.replace(/\]/g, "~t")
													.replace(/:/g, "~d")
													.replace(/\?/g, "~q")
											: a,
									);

									let text = data[row][column]
										.replace(/\\n/g, "\n")
										.replace(/\\t/g, "\t");

									try {
										text = JSON.parse(text);
									} catch (err) {}

									if (typeof text !== "string") return text;

									text = text.replace(
										/\{\d+?\}/g,
										(a) => args[parseInt(a.replace(/[{}]/g, "")) - 1] as string,
									);

									while (/\[\d+?\?[^\[\]]*?:[^\[\]]*?\]/gs.test(text)) {
										text = text.replace(
											/\[\d+?\?[^\[\]]*?:[^\[\]]*?\]/gs,
											(a) => {
												let m = a.match(/\[(\d+?)\?([^\[\]]*?):([^\[\]]*?)\]/s);
												if (args[parseInt(m[1]) - 1]) return m[2];
												else return m[3];
											},
										);
									}

									text = text
										.replace(/~c/g, "{")
										.replace(/~b/g, "}")
										.replace(/~s/g, "[")
										.replace(/~t/g, "]")
										.replace(/~d/g, ":")
										.replace(/~q/g, "?");

									return text;
								};
							}
						}

						Translations.cache.set(this.id, this.data);

						return resolve(this);
					},
				);
			}, 16_000);
		});
	}
}

export type TranslationsData = {
	[L in Language]?: LanguageTranslationsData;
};

export interface LanguageTranslationsData {
	readonly language: Language;
	readonly strings: {
		[K: string]: (...args: (string | boolean)[]) => string;
	};
}
