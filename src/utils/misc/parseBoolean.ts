export default function parseBoolean(value: string) {
	const truthyValues = ["true", "t", "yes"];
	const falsyValues = ["false", "f", "no"];

	if (truthyValues.includes(value.toLowerCase())) return true;
	if (falsyValues.includes(value.toLowerCase())) return false;

	return null;
}
