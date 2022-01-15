"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function formatContent(board, grid, x, y, blank) {
    var content = "**" + board.name.replace(/^./, function (a) { return a.toUpperCase(); }) + " - (" + x + ", " + y + ")**\n";
    for (var i = 0; i < 7; i++) {
        content += grid[i].map(function (color) { return color ? color.emoji : blank; }).join("");
        if (i === 2)
            content += " ⬆️";
        if (i === 3)
            content += " **" + y + "** (y)";
        if (i === 4)
            content += " ⬇️";
        content += "\n";
    }
    content += blank + " \u2B05\uFE0F **" + x + "** (x) \u27A1\uFE0F";
    return content;
}
exports.default = formatContent;
