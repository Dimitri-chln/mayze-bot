"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var googleapis_1 = require("googleapis");
var Util_1 = __importDefault(require("../../Util"));
var Translations = /** @class */ (function () {
    function Translations(id, language) {
        this.id = id;
        this.language = language;
    }
    Translations.prototype.init = function () {
        var _this = this;
        var sheets = googleapis_1.google.sheets({ version: "v4", auth: Util_1.default.googleAuth });
        return new Promise(function (resolve, reject) {
            sheets.spreadsheets.values.get({
                spreadsheetId: process.env.TRANSLATIONS_SHEET_ID,
                range: _this.id + "!A1:E25",
            }, function (err, res) {
                var e_1, _a;
                var _b;
                if (err)
                    return reject("The API returned an error: " + err);
                var rows = res.data.values;
                var columnIndex = (_b = rows[0].indexOf(_this.language.toUpperCase())) !== null && _b !== void 0 ? _b : 1;
                _this._data = new discord_js_1.Collection(rows.map(function (row) { return [row[0], row[columnIndex]]; }));
                _this.data = {};
                var _loop_1 = function (translationName) {
                    _this.data[translationName] = function () {
                        var args = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            args[_i] = arguments[_i];
                        }
                        args = args.map(function (a) { return a
                            ? a.toString()
                                .replace(/{/g, "~c")
                                .replace(/}/g, "~b")
                                .replace(/\[/g, "~s")
                                .replace(/\]/g, "~t")
                                .replace(/:/g, "~d")
                                .replace(/\?/g, "~q")
                            : a; });
                        var text = _this._data.get(translationName);
                        try {
                            text = JSON.parse(text);
                        }
                        catch (err) { }
                        if (typeof text !== "string")
                            return text;
                        text = text.replace(/\{\d+?\}/g, function (a) { return args[parseInt(a.replace(/[{}]/g, "")) - 1]; });
                        while (/\[\d+?\?[^\[\]]*?:.*?\]/gs.test(text)) {
                            text = text
                                .replace(/\[\d+?\?[^\[\]]*?:.*?\]/gs, function (a) {
                                var m = a.match(/\[(\d+?)\?([^\[\]]*?):(.*?)\]/s);
                                if (args[parseInt(m[1]) - 1])
                                    return m[2];
                                else
                                    return m[3];
                            });
                        }
                        text = text
                            .replace(/~c/g, "{")
                            .replace(/~b/g, "}")
                            .replace(/~s/g, "[")
                            .replace(/~t/g, "]")
                            .replace(/~d/g, ":")
                            .replace(/~q/g, "?");
                        return text;
                    };
                };
                try {
                    for (var _c = __values(_this._data.keys()), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var translationName = _d.value;
                        _loop_1(translationName);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                resolve(_this);
            });
        });
    };
    return Translations;
}());
exports.default = Translations;
