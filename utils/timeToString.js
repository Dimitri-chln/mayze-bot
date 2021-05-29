/**
 * @param {number} time The time in seconds
 */
function timeToString(date, language = "en") {
	if (!date) return;
	
	const years = Math.floor(date / 31536000);
	const days = Math.floor((date % 31536000) / 86400);
	const hours = Math.floor((date % 86400) / 3600);
	const minutes = Math.floor((date % 3600) / 60);
	const seconds = Math.floor((date % 60) / 1);

	switch (language) {
		case "en":
			return [years, days, hours, minutes, seconds]
				.join(":")
				.replace(/(\d+):(\d+):(\d+):(\d+):(\d+)/,"**$1** years, **$2** days, **$3** hours, **$4** minutes, **$5** seconds, ")
				.replace(/\*\*0\*\* \w+, /g, "")
				.replace(/(\*\*1\*\* \w+)s/g, "$1")
				.replace(/, (\*\*\d+\*\* \w+), $/, " and $1")
				.replace(/^(\*\*\d+\*\* \w+), $/, "$1");
		default:
			return [years, days, hours, minutes, seconds]
				.join(":")
				.replace(/(\d+):(\d+):(\d+):(\d+):(\d+)/,"**$1** ans, **$2** jours, **$3** heures, **$4** minutes, **$5** secondes, ")
				.replace(/\*\*0\*\* \w+, /g, "")
				.replace(/(\*\*1\*\* \w+)s/g, "$1")
				.replace(/, (\*\*\d+\*\* \w+), $/, " et $1")
				.replace(/^(\*\*\d+\*\* \w+), $/, "$1");
	}
};

module.exports = timeToString;