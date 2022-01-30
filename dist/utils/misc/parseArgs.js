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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
function parseArgs(input) {
    var regex = /(?:(?<!\\)").*?(?:(?<!\\)")|\S*/g;
    var args = input.match(regex);
    args.forEach(function (a, i) {
        if (!/^".*"$/.test(a))
            args.splice.apply(args, __spreadArray([i, 1], __read(a.split(/ +/g)), false));
    });
    args = args
        .map(function (a) { return a
        .replace(/(?<!\\)"/g, '')
        .replace(/\\"/g, '"'); })
        .filter(function (a) { return a; });
    return __spreadArray([], __read(args), false);
}
exports.default = parseArgs;
