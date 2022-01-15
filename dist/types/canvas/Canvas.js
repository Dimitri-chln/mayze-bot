"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var discord_js_1 = require("discord.js");
var jimp_1 = __importDefault(require("jimp"));
var Util_1 = __importDefault(require("../../Util"));
var Color_1 = __importDefault(require("./Color"));
var ownerTypes = {
    0: "EVERYONE",
    1: "GUILD",
    2: "CHANNEL",
    3: "USER"
};
var Canvas = /** @class */ (function () {
    function Canvas(name, client, database, palettes) {
        var _this = this;
        this.name = name;
        this.database = database;
        this.palettes = palettes;
        database.query("SELECT * FROM canvas WHERE name = $1", [name]).then(function (res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this._size = res.rows[0].size;
                        this._owner = {
                            type: ownerTypes[res.rows[0].owner_type],
                            id: res.rows[0].owner_id
                        };
                        _a = this;
                        _b = discord_js_1.Collection.bind;
                        return [4 /*yield*/, Promise.all(res.rows[0].users.map(function (userId) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = [userId];
                                        return [4 /*yield*/, client.users.fetch(userId)];
                                    case 1: return [2 /*return*/, _a.concat([_b.sent()])];
                                }
                            }); }); }))];
                    case 1:
                        _a._users = new (_b.apply(discord_js_1.Collection, [void 0, _c.sent()]))();
                        return [2 /*return*/];
                }
            });
        }); });
    }
    Canvas.create = function (name, client, database, palettes, size) {
        var data = [];
        for (var y = 0; y < size; y++) {
            var row = [];
            for (var x = 0; x < size; x++)
                row.push("blnk");
            data.push(row);
        }
        try {
            database.query("INSERT INTO canvas VALUES ($1, $2, $3)", [name, size, JSON.stringify(data)]);
            return new Canvas(name, client, database, palettes);
        }
        catch (err) {
            throw err;
        }
    };
    Object.defineProperty(Canvas.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "owner", {
        get: function () {
            return this._owner;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "users", {
        get: function () {
            return this._users;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "data", {
        get: function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.database.query("SELECT * FROM canvas WHERE name = $1", [_this.name]).then(function (res) {
                    resolve(res.rows[0].data);
                }).catch(function (err) {
                    console.error(err);
                    reject('DatabaseError');
                });
            });
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Add a user to the canvas
     */
    Canvas.prototype.addUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, canvas;
            var e_1, _c;
            return __generator(this, function (_d) {
                // Remove users from all other canvas
                this.database.query("UPDATE canvas SET users = array_diff(users, $1)", [[user.id], this.name]);
                // Add user to the new canvas
                this.database.query("UPDATE canvas SET users = users || $1 WHERE name = $2", [user.id, this.name]);
                try {
                    for (_a = __values(Util_1.default.canvas.values()), _b = _a.next(); !_b.done; _b = _a.next()) {
                        canvas = _b.value;
                        canvas._users.delete(user.id);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                this._users.set(user.id, user);
                return [2 /*return*/];
            });
        });
    };
    /**
     * Modify a pixel in the canvas.
     */
    Canvas.prototype.setPixel = function (x, y, color) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.palettes.every(function (palette) { return !palette.has(color); }))
                            throw new Error("InvalidColor");
                        if (x < 0 || x >= this.size || y < 0 || y >= this.size)
                            throw new Error("InvalidCoordinates");
                        return [4 /*yield*/, this.data];
                    case 1:
                        data = _a.sent();
                        data[y][x] = color;
                        this.database.query("UPDATE canvas SET data = $1 WHERE name = $2", [JSON.stringify(data), this.name]);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get a 7x7 grid of the canvas around the selected pixel.
     */
    Canvas.prototype.viewGrid = function (x, y) {
        return __awaiter(this, void 0, void 0, function () {
            var data, grid, _loop_1, this_1, yShift;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (x < 0 || x >= this.size || y < 0 || y >= this.size)
                            throw new Error("InvalidCoordinates");
                        return [4 /*yield*/, this.data];
                    case 1:
                        data = _a.sent();
                        grid = [];
                        _loop_1 = function (yShift) {
                            var row = [];
                            var _loop_2 = function (xShift) {
                                row.push(data[y + yShift] && data[y + yShift][x + xShift]
                                    ? this_1.palettes.find(function (palette) { return palette.has(data[y + yShift][x + xShift]); }).get(data[y + yShift][x + xShift])
                                    : null);
                            };
                            for (var xShift = -3; xShift <= 3; xShift++) {
                                _loop_2(xShift);
                            }
                            grid.push(row);
                        };
                        this_1 = this;
                        for (yShift = -3; yShift <= 3; yShift++) {
                            _loop_1(yShift);
                        }
                        return [2 /*return*/, grid];
                }
            });
        });
    };
    /**
     * Display an image of the Canvas.
     */
    Canvas.prototype.view = function (x, y, zoom) {
        return __awaiter(this, void 0, void 0, function () {
            var data, newData, yShift, row, xShift, pixelSize, size, borderSize, fullSize, image, borderColor, yBorder, xBorder, yBorder, xBorder, yBorder, xBorder, yBorder, xBorder, _loop_3, this_2, yPixel, buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (zoom && zoom !== "default" && (zoom < 1 || zoom > this.size / 2))
                            throw new Error("InvalidZoom");
                        if (zoom === "default")
                            zoom = Math.round(this.size / 10);
                        if (x < 0 || x >= this.size || y < 0 || y >= this.size)
                            throw new Error("InvalidCoordinates");
                        return [4 /*yield*/, this.data];
                    case 1:
                        data = _a.sent();
                        newData = [];
                        for (yShift = -zoom; yShift <= zoom; yShift++) {
                            row = [];
                            for (xShift = -zoom; xShift <= zoom; xShift++)
                                row.push(data[y + yShift]
                                    ? data[y + yShift][x + xShift]
                                    : null);
                            newData.push(row);
                        }
                        data = newData;
                        pixelSize = Math.ceil(500 / data.length);
                        size = data.length * pixelSize;
                        borderSize = size / 17;
                        fullSize = size + 2 * borderSize;
                        image = new jimp_1.default(fullSize, fullSize);
                        borderColor = jimp_1.default.rgbaToInt(114, 137, 218, 255);
                        for (yBorder = 0; yBorder < borderSize; yBorder++) {
                            for (xBorder = 0; xBorder < fullSize; xBorder++)
                                image.setPixelColor(borderColor, xBorder, yBorder);
                        }
                        for (yBorder = fullSize - borderSize; yBorder < fullSize; yBorder++) {
                            for (xBorder = 0; xBorder < fullSize; xBorder++)
                                image.setPixelColor(borderColor, xBorder, yBorder);
                        }
                        for (yBorder = borderSize; yBorder < fullSize - borderSize; yBorder++) {
                            for (xBorder = 0; xBorder < borderSize; xBorder++)
                                image.setPixelColor(borderColor, xBorder, yBorder);
                        }
                        for (yBorder = borderSize; yBorder < fullSize - borderSize; yBorder++) {
                            for (xBorder = fullSize - borderSize; xBorder < fullSize; xBorder++)
                                image.setPixelColor(borderColor, xBorder, yBorder);
                        }
                        _loop_3 = function (yPixel) {
                            var _loop_4 = function (xPixel) {
                                var color = data[yPixel] && data[yPixel][xPixel]
                                    ? this_2.palettes.find(function (palette) { return palette.has(data[yPixel][xPixel]); }).get(data[yPixel][xPixel])
                                    : 0x000000;
                                if (color instanceof Color_1.default)
                                    color = jimp_1.default.rgbaToInt(color.red, color.green, color.blue, color.alias === "blnk" ? 128 : 255);
                                // Make it <pixelSize> large
                                for (var i = 0; i < pixelSize; i++) {
                                    for (var j = 0; j < pixelSize; j++) {
                                        image.setPixelColor(color, borderSize + xPixel * pixelSize + i, borderSize + yPixel * pixelSize + j);
                                    }
                                }
                            };
                            for (var xPixel = 0; xPixel < data.length; xPixel++) {
                                _loop_4(xPixel);
                            }
                        };
                        this_2 = this;
                        // Display a canvas pixel
                        for (yPixel = 0; yPixel < data.length; yPixel++) {
                            _loop_3(yPixel);
                        }
                        return [4 /*yield*/, image.getBufferAsync(jimp_1.default.MIME_PNG)];
                    case 2:
                        buffer = _a.sent();
                        return [2 /*return*/, buffer];
                }
            });
        });
    };
    return Canvas;
}());
exports.default = Canvas;
