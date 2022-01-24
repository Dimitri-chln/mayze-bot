"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var Palette = /** @class */ (function () {
    function Palette(name, colors) {
        if (colors === void 0) { colors = []; }
        this.name = name;
        this.colors = new discord_js_1.Collection(colors.map(function (c) { return [c.alias, c]; }));
    }
    Palette.prototype.get = function (alias) {
        return this.colors.get(alias);
    };
    Palette.prototype.add = function (color) {
        this.colors.set(color.alias, color);
    };
    Palette.prototype.remove = function (alias) {
        this.colors.delete(alias);
    };
    Palette.prototype.has = function (alias) {
        return this.colors.has(alias);
    };
    Palette.prototype.all = function () {
        return this.colors;
    };
    return Palette;
}());
exports.default = Palette;
