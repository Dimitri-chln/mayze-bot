import { DatabaseLocalizations } from "../../types/Database";
import { BaseLocalization } from "../../structures/localizations/LocalizationManager";
import LocalizationItem from "../../structures/localizations/LocalizationItem";

export default function parseDataBaseLocalizations(
	localizations: DatabaseLocalizations[],
	path: string,
): BaseLocalization {
	let data: BaseLocalization = {};
	const pathParts = path === "" ? 0 : path.split(".").length;

	for (const localization of localizations) {
		const parts = localization.name.split(".").slice(pathParts);
		let temp = data;

		parts.forEach((part, i) => {
			part = part.replace(/-/g, "_");

			if (!(part in temp)) temp[part] = {};

			if (i === parts.length - 1) {
				for (const locale of Object.keys(localization)) {
					if (localization[locale] === null) localization[locale] = localization.default;
				}

				const defaultString = localization.default;
				delete localization.name;
				delete localization.default;

				temp[part] = new LocalizationItem(defaultString, localization);
			} else temp = temp[part] as BaseLocalization;
		});
	}

	return data;
}
