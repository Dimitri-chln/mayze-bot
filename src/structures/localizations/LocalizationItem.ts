import { Locale, LocalizationMap } from "discord.js";

export default class LocalizationItem {
	readonly default: string;
	readonly localization: Localization;

	constructor(defaultString: string, localization: LocalizationMap) {
		this.default = defaultString;
		this.localization = new Localization(localization);
	}

	format(locale: Locale, ...args: (string | boolean)[]): string {
		args = args.map((a) => (typeof a === "string" ? a.replace(/([\{\}\[\]:])/g, "\\$1") : a));

		let data = this.localization.get(locale).replace(/\\n/g, "\n").replace(/\\t/g, "\t");

		// Placeholders
		data = data.replace(/(?<!\\)\{\d+?\}/g, (a) => args[parseInt(a.replace(/[{}]/g, "")) - 1] as string);

		// Selectors
		while (/(?<!\\)\[(\d+?)\?((?:[^\[\]]|\\[\[\]])*?)(?<!\\):((?:[^\[\]]|\\[\[\]])*?)\]/gs.test(data)) {
			data = data.replace(/(?<!\\)\[(\d+?)\?((?:[^\[\]]|\\[\[\]])*?)(?<!\\):((?:[^\[\]]|\\[\[\]])*?)\]/gs, (a) => {
				let m = a.match(/\[(\d+?)\?((?:[^\[\]]|\\[\[\]])*?)(?<!\\):((?:[^\[\]]|\\[\[\]])*?)\]/s);
				if (args[parseInt(m[1]) - 1]) return m[2].replace(/\\:/g, ":"); // If the argument is true
				else return m[3].replace(/\\:/g, ":"); // If the argument is false
			});
		}

		data = data.replace(/\\([\{\}\[\]:])/g, "$1");

		return data;
	}
}

export class Localization {
	private readonly _map: LocalizationMap;

	constructor(localization: LocalizationMap) {
		this._map = localization;
	}

	get(locale: Locale): string {
		return this._map[locale];
	}

	find(string: string, caseSensitive: boolean = false): Locale {
		if (caseSensitive) return Object.keys(this._map).find((locale: Locale) => this._map[locale] === string) as Locale;
		else
			Object.keys(this._map).find(
				(locale: Locale) => this._map[locale].toLowerCase() === string.toLowerCase(),
			) as Locale;
	}

	all() {
		return this._map;
	}
}
