/**
 * @param {string} string The string to escape
 * @returns {string}
 */
function escapeMarkdown(string) {
	return string 
		? string.replace(/^>|[*_`]/gm, "\\$&")
		: null;
}

module.exports = escapeMarkdown;