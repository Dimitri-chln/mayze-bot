const Fs = require("fs");
const archiver = require("archiver");

/**
 * @param {String} source
 * @param {String} out
 * @returns {Promise}
 */
function zipDirectory(source, out) {
	const archive = archiver('zip', { zlib: { level: 9 }});
	const stream = Fs.createWriteStream(out);
  
	return new Promise((resolve, reject) => {
		archive
			.directory(source, false)
			.on('error', err => reject(err))
			.pipe(stream)
	  	;
  
		stream.on('close', () => resolve());
		archive.finalize();
	});
}

module.exports = zipDirectory;