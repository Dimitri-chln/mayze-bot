/**
 * @param {string} string The string to escape
 * @returns {string}
 */
function escapeMarkdown(string) {
    return string ? string
        .replace(/\*/g, "\\*")
        .replace(/_/g, "\\_")
        .replace(/`/, "\\`")
        .replace(/>/g, "\\>")
    : null;
}

module.exports = escapeMarkdown;