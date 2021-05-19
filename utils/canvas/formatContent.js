const { GuildEmoji } = require("discord.js");
const Canvas = require("./Canvas");

/**
 * Generate a formatted view of a 7x7 canvas grid
 * @param {Canvas} board The canvas
 * @param {string[][]} grid The 7x7 grid
 * @param {number} x The x coordinate of the center
 * @param {number} y The y coordinate of the center
 * @param {GuildEmoji} blank The blank emoji
 * @returns 
 */
function formatContent(board, grid, x, y, blank) {
    let content = `**${board.name.replace(/^./, a => a.toUpperCase())} - (${x}, ${y})**\n`;
    for (let i = 0; i < 7; i ++) {
        content += grid[i].map(c => c ? c.emote : blank).join("");
        if (i === 2) content += " ⬆️";
        if (i === 3) content += ` **${y}** (y)`;
        if (i === 4) content += " ⬇️";
        content += "\n";
    }
    content += `${blank} ⬅️ **${x}** (x) ➡️`;

    return content;
}

module.exports = formatContent;