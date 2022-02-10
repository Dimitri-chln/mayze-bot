import { Language } from "../../types/structures/Translations";

export default function formatTime(
	milliseconds: number,
	language: Language = "fr",
) {
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

	switch (language) {
		case "fr":
			return [years, days, hours, minutes, seconds]
				.join(":")
				.replace(
					/(\d+):(\d+):(\d+):(\d+):(\d+)/,
					"**$1** ans, **$2** jours, **$3** heures, **$4** minutes, **$5** secondes, ",
				)
				.replace(/\*\*0\*\* \w+, /g, "")
				.replace(/(\*\*1\*\* \w+)s/g, "$1")
				.replace(/, (\*\*\d+\*\* \w+), $/, " et $1")
				.replace(/^(\*\*\d+\*\* \w+), $/, "$1");

		default:
			return [years, days, hours, minutes, seconds]
				.join(":")
				.replace(
					/(\d+):(\d+):(\d+):(\d+):(\d+)/,
					"**$1** years, **$2** days, **$3** hours, **$4** minutes, **$5** seconds, ",
				)
				.replace(/\*\*0\*\* \w+, /g, "")
				.replace(/(\*\*1\*\* \w+)s/g, "$1")
				.replace(/, (\*\*\d+\*\* \w+), $/, " and $1")
				.replace(/^(\*\*\d+\*\* \w+), $/, "$1");
	}
}
