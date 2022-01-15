import { GuildEmoji } from "discord.js";
import Color from "../../types/canvas/Color";
import Canvas from "../../types/canvas/Canvas";



export default function formatContent(board: Canvas, grid: Color[][], x: number, y: number, blank: GuildEmoji) {
    let content = `**${board.name.replace(/^./, a => a.toUpperCase())} - (${x}, ${y})**\n`;
    
    for (let i = 0; i < 7; i ++) {
        content += grid[i].map(color => color ? color.emoji : blank).join("");
        
        if (i === 2) content += " ⬆️";
        if (i === 3) content += ` **${y}** (y)`;
        if (i === 4) content += " ⬇️";
        
        content += "\n";
    }
    
    content += `${blank} ⬅️ **${x}** (x) ➡️`;

    return content;
}