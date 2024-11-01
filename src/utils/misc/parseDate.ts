export default function parseDate(date: string) {
	const parsedDate = new Date(date);
	if (parsedDate.valueOf()) return parsedDate;

	const match = date.match(/^(\d{1,2})([-/])(\d{1,2})\2(\d+)(?:\s(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
	if (!match) return new Date("Invalid");

	const dateString = `${match[4]}-${match[3]}-${match[1]}T${match[5] ?? "00"}:${match[6] ?? "00"}:${match[7] ?? "00"}Z`;

	return new Date(dateString);
}
