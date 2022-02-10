export default function escapeMarkdown(string: string) {
	return string
		?.replace(/(^>)|([*_|~`])/gm, "\\$1")
		?.replace(/(\[.+?\])(\(https?:\/\/.+?\))/gs, "$1\\$2");
}
