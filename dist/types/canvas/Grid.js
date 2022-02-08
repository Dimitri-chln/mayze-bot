"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = __importDefault(require("../../Util"));
var Grid = /** @class */ (function () {
    function Grid(canvas, x, y, pixels) {
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.pixels = pixels;
    }
    Grid.prototype.format = function () {
        var blank = Util_1.default.client.guilds.cache.get(Util_1.default.config.ADMIN_GUILD_ID).emojis.cache.find(function (e) { return e.name === "blank"; });
        var content = "**" + this.canvas.name.replace(/^./, function (a) { return a.toUpperCase(); }) + " - (" + this.x + ", " + this.y + ")**\n";
        for (var i = 0; i < 7; i++) {
            content += this.pixels[i].map(function (color) { return color ? color.emoji : blank; }).join("");
            if (i === 2)
                content += " ⬆️";
            if (i === 3)
                content += " **" + this.y + "** (y)";
            if (i === 4)
                content += " ⬇️";
            content += "\n";
        }
        content += blank.toString() + " \u2B05\uFE0F **" + this.x + "** (x) \u27A1\uFE0F";
        return content;
    };
    return Grid;
}());
exports.default = Grid;
