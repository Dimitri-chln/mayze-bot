import Fs from "fs";
import archiver from "archiver";

export default function zipDirectory(
	source: string,
	out: string,
): Promise<void> {
	const archive = archiver("zip", { zlib: { level: 9 } });
	const stream = Fs.createWriteStream(out);

	return new Promise((resolve, reject) => {
		archive
			.directory(source, false)
			.on("error", (err) => reject(err))
			.pipe(stream);

		stream.on("close", () => resolve());
		archive.finalize();
	});
}
