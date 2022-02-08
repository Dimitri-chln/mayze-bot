"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function escapeMarkdown(string) {
    var _a;
    return (_a = string === null || string === void 0 ? void 0 : string.replace(/[>*_|~`]/gm, "\\$1")) === null || _a === void 0 ? void 0 : _a.replace(/(\[.+?\])(\(https?:\/\/.+?\))/gs, "$1\\$2");
}
exports.default = escapeMarkdown;
