export default function parseArgs(input: string) {
	const regex = /(?:(?<!\\)").*?(?:(?<!\\)")|\S*/g;

	let args = input.match(regex);

	args.forEach((a, i) => {
		if (!/^".*"$/.test(a)) args.splice(i, 1, ...a.split(/ +/g));
	});

	args = args
		.map((a) => a.replace(/(?<!\\)"/g, "").replace(/\\"/g, '"'))
		.filter((a) => a);

	return [...args];
}
