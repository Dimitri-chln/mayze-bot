function escapeMarkdown(string) {
    return string
        .replace(/\*/g, "\\*")
        .replace(/_/g, "\\_")
        .replace(/`/, "\\`")
        .replace(/>/g, "\\>");
}

module.exports = escapeMarkdown;