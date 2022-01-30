"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function escapeMarkdown(string) {
    return string
        .replace(/[>*_|~`]/gm, "\\$1")
        .replace(/(\[.+?\])(\(https?:\/\/.+?\))/gs, "$1\\$2");
}
exports.default = escapeMarkdown;
