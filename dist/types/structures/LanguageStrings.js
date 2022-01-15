"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
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
var path_1 = __importDefault(require("path"));
var discord_js_1 = require("discord.js");
var LanguageStrings = /** @class */ (function () {
    function LanguageStrings(pathOrFilename, language) {
        var e_1, _a;
        var _this = this;
        var filename = path_1.default.basename(pathOrFilename, path_1.default.extname(pathOrFilename));
        this.filename = filename;
        this.language = language;
        var rawData = require("../../language_strings/" + filename + ".json");
        this._data = new discord_js_1.Collection(Object.entries(rawData).map(function (_a) {
            var _b = __read(_a, 2), key = _b[0], value = _b[1];
            return [key, value[language]];
        }));
        this.data = {};
        var _loop_1 = function (languageStringName) {
            this_1.data[languageStringName] = function () {
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
                var text = _this._data.get(languageStringName);
                if (typeof text !== "string")
                    return text;
                text = text.replace(/\{\d+?\}/g, function (a) { return args[parseInt(a.replace(/[\{\}]/g, "")) - 1]; });
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
        var this_1 = this;
        try {
            for (var _b = __values(this._data.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var languageStringName = _c.value;
                _loop_1(languageStringName);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    return LanguageStrings;
}());
exports.default = LanguageStrings;
