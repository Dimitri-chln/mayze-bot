"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var archiver_1 = __importDefault(require("archiver"));
function zipDirectory(source, out) {
    var archive = (0, archiver_1.default)("zip", { zlib: { level: 9 } });
    var stream = fs_1.default.createWriteStream(out);
    return new Promise(function (resolve, reject) {
        archive
            .directory(source, false)
            .on("error", function (err) { return reject(err); })
            .pipe(stream);
        stream.on("close", function () { return resolve(); });
        archive.finalize();
    });
}
exports.default = zipDirectory;
