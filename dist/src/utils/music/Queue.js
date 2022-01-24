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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var voice_1 = require("@discordjs/voice");
var MusicUtil_1 = __importDefault(require("./MusicUtil"));
var Util_1 = __importDefault(require("../../Util"));
var ytdl_core_1 = __importDefault(require("ytdl-core"));
var Queue = /** @class */ (function () {
    function Queue(voiceChannel, textChannel) {
        var _this = this;
        this.voiceChannel = voiceChannel;
        this.textChannel = textChannel;
        this.songs = [];
        this.audioPlayer = (0, voice_1.createAudioPlayer)();
        this.resource = null;
        this.stopped = false;
        this.skipped = false;
        this.repeatSong = false;
        this.repeatQueue = false;
        this.audioPlayer.on("stateChange", function (oldState, newState) {
            if (newState.status === voice_1.AudioPlayerStatus.Idle) {
                _this._playSong();
            }
        });
    }
    Object.defineProperty(Queue.prototype, "voiceConnection", {
        get: function () {
            return (0, voice_1.getVoiceConnection)(this.voiceChannel.guild.id);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Queue.prototype, "nowPlaying", {
        get: function () {
            return this.songs[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Queue.prototype, "volume", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this.resource) === null || _a === void 0 ? void 0 : _a.volume) === null || _b === void 0 ? void 0 : _b.volumeDecibels;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Queue.prototype, "duration", {
        get: function () {
            var _a, _b;
            return this.audioPlayer
                ? this.songs.reduce(function (sum, song) { return sum + song.duration; }, 0)
                    - ((_a = this.resource) === null || _a === void 0 ? void 0 : _a.playbackDuration)
                    - ((_b = this.songs[0]) === null || _b === void 0 ? void 0 : _b.seekTime)
                : 0;
        },
        enumerable: false,
        configurable: true
    });
    Queue.prototype.play = function (search, member, options) {
        return __awaiter(this, void 0, void 0, function () {
            var song, isAlreadyPlaying, connection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, MusicUtil_1.default.best(search, this, member.user, 1, options)];
                    case 1:
                        song = _a.sent();
                        this.songs.push(song);
                        isAlreadyPlaying = !!(0, voice_1.getVoiceConnection)(member.guild.id);
                        if (!isAlreadyPlaying) {
                            connection = (0, voice_1.joinVoiceChannel)({
                                guildId: this.voiceChannel.guild.id,
                                channelId: member.voice.channel.id,
                                adapterCreator: member.voice.guild.voiceAdapterCreator,
                                selfDeaf: true
                            });
                            connection.subscribe(this.audioPlayer);
                        }
                        if (!!isAlreadyPlaying) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._playSong(true)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, song];
                }
            });
        });
    };
    Queue.prototype.playlist = function (search, member, options) {
        return __awaiter(this, void 0, void 0, function () {
            var playlist, isAlreadyPlaying, connection;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, MusicUtil_1.default.playlist(search, this, member.user, options.maxSongs, options.shuffle, options.localAddress)];
                    case 1:
                        playlist = _b.sent();
                        (_a = this.songs).push.apply(_a, __spreadArray([], __read(playlist.videos), false));
                        isAlreadyPlaying = !!(0, voice_1.getVoiceConnection)(member.guild.id);
                        if (!isAlreadyPlaying) {
                            connection = (0, voice_1.joinVoiceChannel)({
                                guildId: this.voiceChannel.guild.id,
                                channelId: member.voice.channel.id,
                                adapterCreator: member.voice.guild.voiceAdapterCreator,
                                selfDeaf: true
                            });
                            connection.subscribe(this.audioPlayer);
                        }
                        if (!!isAlreadyPlaying) return [3 /*break*/, 3];
                        return [4 /*yield*/, this._playSong(true)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3: return [2 /*return*/, playlist];
                }
            });
        });
    };
    Queue.prototype.pause = function () {
        this.audioPlayer.pause();
    };
    Queue.prototype.resume = function () {
        this.audioPlayer.unpause();
    };
    Queue.prototype.stop = function () {
        this.audioPlayer.stop();
        this.voiceConnection.destroy();
        this.songs = [];
        this.stopped = true;
    };
    Queue.prototype.setVolume = function (decibels) {
        var _a, _b;
        (_b = (_a = this.resource) === null || _a === void 0 ? void 0 : _a.volume) === null || _b === void 0 ? void 0 : _b.setVolumeDecibels(decibels);
    };
    Queue.prototype.seek = function (seek) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.songs[0].seekTime = seek;
                        return [4 /*yield*/, this._playSong(true, seek)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.songs[0]];
                }
            });
        });
    };
    Queue.prototype.clear = function () {
        this.songs.splice(1);
    };
    Queue.prototype.skip = function () {
        var currentSong = this.songs[0];
        this.skipped = true;
        this.audioPlayer.stop();
        return currentSong;
    };
    Queue.prototype.toggleRepeatSong = function () {
        this.repeatSong = !this.repeatSong;
        if (this.repeatSong)
            this.repeatQueue = false;
        return this.repeatSong;
    };
    Queue.prototype.toggleRepeatQueue = function () {
        this.repeatQueue = !this.repeatQueue;
        if (this.repeatQueue)
            this.repeatSong = false;
        return this.repeatQueue;
    };
    Queue.prototype.move = function (oldIndex, newIndex) {
        var song = this.songs[oldIndex];
        this.songs.splice(newIndex, 0, this.songs.splice(oldIndex, 1)[0]);
        return song;
    };
    Queue.prototype.remove = function (index) {
        var song = this.songs[index];
        this.songs.splice(index, 1);
        return song;
    };
    Queue.prototype.shuffle = function () {
        var currentSong = this.songs.shift();
        this.songs = MusicUtil_1.default.shuffle(this.songs);
        this.songs.unshift(currentSong);
        return this.songs;
    };
    Queue.prototype.createProgressBar = function () {
        var _a;
        var timePassed = ((_a = this.resource) === null || _a === void 0 ? void 0 : _a.playbackDuration) + this.songs[0].seekTime;
        var timeEnd = this.songs[0].duration;
        return MusicUtil_1.default.buildBar(timePassed, timeEnd);
    };
    Queue.prototype._playSong = function (startPlay, seek) {
        if (startPlay === void 0) { startPlay = false; }
        if (seek === void 0) { seek = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var song, stream;
            var _this = this;
            return __generator(this, function (_a) {
                // If there isn't any music in the queue
                if (this.stopped || (this.songs.length <= 1 && !startPlay && !this.repeatSong && !this.repeatQueue)) {
                    // Stop playing
                    Util_1.default.musicPlayer.queues.delete(this.voiceChannel.guild.id);
                    if (this.stopped) {
                        this.voiceConnection.destroy();
                        this.audioPlayer.stop();
                    }
                    else {
                        setTimeout(function () {
                            if (_this.songs.length <= 1 && !_this.repeatSong && !_this.repeatQueue) {
                                _this.voiceConnection.destroy();
                                _this.audioPlayer.stop();
                            }
                        }, 900000);
                    }
                    return [2 /*return*/];
                }
                // Add to the end if repeatQueue is enabled
                if (this.repeatQueue && !this.repeatSong && !seek) {
                    this.songs.push(this.songs[0]);
                }
                this.skipped = false;
                song = this.songs[0];
                // Live Video is unsupported
                if (song.isLive) {
                    this.repeatSong = false;
                    return [2 /*return*/, this._playSong()];
                }
                stream = (0, ytdl_core_1.default)(song.url, {
                    filter: "audioonly",
                    quality: "highestaudio",
                    begin: seek,
                    dlChunkSize: 0,
                    highWaterMark: 1 << 25,
                });
                stream
                    .on("readable", function () {
                    var resource = (0, voice_1.createAudioResource)(stream, {
                        inputType: voice_1.StreamType.WebmOpus,
                        inlineVolume: true
                    });
                    _this.resource = resource;
                    _this.audioPlayer.play(resource);
                })
                    .on("error", function (err) {
                    _this.repeatSong = false;
                    _this._playSong();
                });
                return [2 /*return*/];
            });
        });
    };
    return Queue;
}());
exports.default = Queue;
