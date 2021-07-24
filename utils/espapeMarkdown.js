/**
 * @param {string} string The string to escape
 * @returns {string}
 */
function escapeMarkdown(string) {
	return string 
		? string
			.replace(/^>|\|\||[*_`]/gm, "\\$&")
			.replace(/(\[.*\])(\(https?:\/\/.+\))/gs, "$1\\$2")
		: null;
}

module.exports = escapeMarkdown;