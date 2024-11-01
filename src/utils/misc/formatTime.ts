import { Locale } from "discord.js";

import { DataLocalizationManager } from "../../structures/localizations/LocalizationManager";

export default async function formatTime(milliseconds: number, locale: Locale) {
	const dataLocalization = new DataLocalizationManager();
	await dataLocalization.fetch();

	const MS_IN_SECOND = 1000;
	const MS_IN_MINUTE = 1000 * 60;
	const MS_IN_HOUR = 1000 * 60 * 60;
	const MS_IN_DAY = 1000 * 60 * 60 * 24;
	const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365;

	const years = Math.floor(milliseconds / MS_IN_YEAR);
	const days = Math.floor((milliseconds % MS_IN_YEAR) / MS_IN_DAY);
	const hours = Math.floor((milliseconds % MS_IN_DAY) / MS_IN_HOUR);
	const minutes = Math.floor((milliseconds % MS_IN_HOUR) / MS_IN_MINUTE);
	const seconds = Math.floor((milliseconds % MS_IN_MINUTE) / MS_IN_SECOND);

	return dataLocalization.strings.time_format.text
		.format(
			locale,
			years.toString(),
			days.toString(),
			hours.toString(),
			minutes.toString(),
			seconds.toString(),
			years > 1,
			days > 1,
			hours > 1,
			minutes > 1,
			seconds > 1,
		)
		.replace(/\*\*0\*\* \w+, /g, "")
		.replace(/, (\*\*\d+\*\* \w+), $/, ` ${dataLocalization.strings.time_format.and.localization.get(locale)} $1`)
		.replace(/^(\*\*\d+\*\* \w+), $/, "$1");
}
