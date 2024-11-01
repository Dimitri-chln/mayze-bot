import validator from "validator";

export default function escapeMarkdown(string: string) {
	if (!string) return;

	let escapedString = string
		.replace(/([*_|~`])/gm, "\\$1")
		.replace(/\[(.+?)\]\(<?(https?:\/\/.+?)>?\)/gs, (match, text, url) => (validator.isURL(url) ? text : match));

	return escapedString;
}
