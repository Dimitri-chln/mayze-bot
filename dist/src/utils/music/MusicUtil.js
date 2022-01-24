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
// Self Definitions
var Playlist_1 = __importDefault(require("./Playlist"));
var Song_1 = __importDefault(require("./Song"));
var ytsr_1 = __importDefault(require("ytsr"));
var youtubei_1 = __importDefault(require("@sushibtw/youtubei"));
var spotify_url_info_1 = __importDefault(require("spotify-url-info"));
var deezer_public_api_1 = __importDefault(require("deezer-public-api"));
var youtube = new youtubei_1.default.Client();
var deezer = new deezer_public_api_1.default();
// RegExp Definitions
var REGEX_LIST = {
    YOUTUBE_VIDEO: /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))((?!channel)(?!user)\/(?:[\w\-]+\?v=|embed\/|v\/)?)((?!channel)(?!user)[\w\-]+)(\S+)?$/,
    YOUTUBE_VIDEO_ID: /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/,
    YOUTUBE_PLAYLIST: /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#&?]*).*/,
    YOUTUBE_PLAYLIST_ID: /[&?]list=([^&]+)/,
    SPOTIFY_SONG: /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:track\/|\?uri=spotify:track:)((\w|-){22})(?:(?=\?)(?:[?&]foo=(\d*)(?=[&#]|$)|(?![?&]foo=)[^#])+)?(?=#|$)/,
    SPOTIFY_PLAYLIST: /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:(album|playlist)\/|\?uri=spotify:playlist:)((\w|-){22})(?:(?=\?)(?:[?&]foo=(\d*)(?=[&#]|$)|(?![?&]foo=)[^#])+)?(?=#|$)/,
    DEEZER_SONG: /https?:\/\/(?:www\.)?deezer\.com\/(?:\w{2}\/)?track\/(\d+)/,
    DEEZER_PLAYLIST: /https?:\/\/(?:www\.)?deezer\.com\/(?:\w{2}\/)?(?:playlist|album)\/(\d+)/
};
// Helper Functions
function parseYouTubeVideo(url) {
    var match = url.match(REGEX_LIST.YOUTUBE_VIDEO_ID);
    return (match && match[7].length === 11) ? match[7] : null;
}
function parseYouTubePlaylist(url) {
    var match = url.match(REGEX_LIST.YOUTUBE_PLAYLIST_ID);
    return (match && match[1].length === 34) ? match[1] : null;
}
function videoDurationResolver(duration) {
    var date = new Date(null);
    date.setSeconds(duration);
    var durationString = date.toISOString().substring(11, 19);
    return durationString.replace(/^0(?:0:0?)?/, "");
}
var MusicUtil = /** @class */ (function () {
    function MusicUtil() {
    }
    MusicUtil.search = function (search, queue, requestedBy, limit, searchOptions) {
        var _a, _b, _c;
        if (limit === void 0) { limit = 1; }
        if (searchOptions === void 0) { searchOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var filtersTypes, filters, _d, _e, _f, _g, _h, _j, result, items, songs, error_1;
            var _this = this;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        searchOptions = Object.assign({}, this.PlayOptions, searchOptions);
                        return [4 /*yield*/, ytsr_1.default.getFilters(search)];
                    case 1:
                        filtersTypes = _k.sent();
                        filters = filtersTypes.get("Type").get("Video");
                        if (!searchOptions.uploadDate) return [3 /*break*/, 3];
                        _e = (_d = Array).from;
                        return [4 /*yield*/, ytsr_1.default.getFilters(filters.url)];
                    case 2:
                        filters = (_a = _e.apply(_d, [(_k.sent()).get("Upload date"),
                            function (_a) {
                                var _b = __read(_a, 2), name = _b[0], value = _b[1];
                                return ({ name: name, url: value.url, description: value.description, active: value.active });
                            }])
                            .find(function (o) { return o.name.toLowerCase().includes(searchOptions.uploadDate); })) !== null && _a !== void 0 ? _a : filters;
                        _k.label = 3;
                    case 3:
                        if (!searchOptions.duration) return [3 /*break*/, 5];
                        _g = (_f = Array).from;
                        return [4 /*yield*/, ytsr_1.default.getFilters(filters.url)];
                    case 4:
                        filters = (_b = _g.apply(_f, [(_k.sent()).get("Duration"),
                            function (_a) {
                                var _b = __read(_a, 2), name = _b[0], value = _b[1];
                                return ({ name: name, url: value.url, description: value.description, active: value.active });
                            }])
                            .find(function (o) { return o.name.toLowerCase().startsWith(searchOptions.duration); })) !== null && _b !== void 0 ? _b : filters;
                        _k.label = 5;
                    case 5:
                        if (!searchOptions.sortBy) return [3 /*break*/, 7];
                        _j = (_h = Array).from;
                        return [4 /*yield*/, ytsr_1.default.getFilters(filters.url)];
                    case 6:
                        filters = (_c = _j.apply(_h, [(_k.sent()).get("Sort By"),
                            function (_a) {
                                var _b = __read(_a, 2), name = _b[0], value = _b[1];
                                return ({ name: name, url: value.url, description: value.description, active: value.active });
                            }])
                            .find(function (o) { return o.name.toLowerCase().startsWith(searchOptions.sortBy); })) !== null && _c !== void 0 ? _c : filters;
                        _k.label = 7;
                    case 7:
                        _k.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, (0, ytsr_1.default)(filters.url, { limit: limit })];
                    case 8:
                        result = _k.sent();
                        items = result.items;
                        songs = items.map(function (item) {
                            if (item.type !== "video")
                                return;
                            var data = {
                                title: item.title,
                                duration: _this.timeToMilliseconds(item.duration),
                                channel: {
                                    name: item.author.name,
                                },
                                url: item.url,
                                thumbnail: item.bestThumbnail.url,
                                isLive: item.isLive
                            };
                            return new Song_1.default(data, queue, requestedBy);
                        }).filter(function (s) { return s && !s.isLive; });
                        return [2 /*return*/, songs];
                    case 9:
                        error_1 = _k.sent();
                        throw "SearchIsNull";
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    MusicUtil.link = function (search, queue, requestedBy, localAddress) {
        return __awaiter(this, void 0, void 0, function () {
            var isSpotifyLink, isDeezerLink, isYouTubeLink, spotifyResult, searchResult, error_2, _a, trackId, deezerResult, searchResult, error_3, videoId, videoResult, songData;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        isSpotifyLink = REGEX_LIST.SPOTIFY_SONG.test(search);
                        isDeezerLink = REGEX_LIST.DEEZER_SONG.test(search);
                        isYouTubeLink = REGEX_LIST.YOUTUBE_VIDEO.test(search);
                        if (!isSpotifyLink) return [3 /*break*/, 5];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, spotify_url_info_1.default.getPreview(search)];
                    case 2:
                        spotifyResult = _b.sent();
                        return [4 /*yield*/, this.search(spotifyResult.artist + " - " + spotifyResult.title, queue, requestedBy)];
                    case 3:
                        searchResult = _b.sent();
                        return [2 /*return*/, searchResult[0]];
                    case 4:
                        error_2 = _b.sent();
                        throw "InvalidSpotify";
                    case 5:
                        if (!isDeezerLink) return [3 /*break*/, 10];
                        _b.label = 6;
                    case 6:
                        _b.trys.push([6, 9, , 10]);
                        _a = __read(search.match(REGEX_LIST.DEEZER_SONG), 2), trackId = _a[1];
                        return [4 /*yield*/, deezer.track(trackId)];
                    case 7:
                        deezerResult = _b.sent();
                        return [4 /*yield*/, this.search(deezerResult.artist.name + " - " + deezerResult.title, queue, requestedBy)];
                    case 8:
                        searchResult = _b.sent();
                        return [2 /*return*/, searchResult[0]];
                    case 9:
                        error_3 = _b.sent();
                        throw "InvalidDeezer";
                    case 10:
                        if (!isYouTubeLink) return [3 /*break*/, 12];
                        videoId = parseYouTubeVideo(search);
                        if (!videoId)
                            throw "InvalidYoutube";
                        youtube.options.localAddress = localAddress;
                        return [4 /*yield*/, youtube.getVideo(videoId)];
                    case 11:
                        videoResult = _b.sent();
                        if (videoResult.isLiveContent)
                            throw "InvalidYoutube";
                        songData = {
                            title: videoResult.title,
                            duration: videoResult.duration * 1000,
                            channel: {
                                name: videoResult.channel.name,
                            },
                            url: search,
                            thumbnail: videoResult.thumbnails.best,
                            isLive: false
                        };
                        return [2 /*return*/, new Song_1.default(songData, queue, requestedBy)];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    MusicUtil.best = function (search, queue, requestedBy, limit, searchOptions) {
        var _a;
        if (limit === void 0) { limit = 1; }
        if (searchOptions === void 0) { searchOptions = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var song, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.link(search, queue, requestedBy, searchOptions.localAddress)];
                    case 1:
                        if (!((_a = _c.sent()) !== null && _a !== void 0)) return [3 /*break*/, 2];
                        _b = _a;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.search(search, queue, requestedBy, limit, searchOptions)[0]];
                    case 3:
                        _b = _c.sent();
                        _c.label = 4;
                    case 4:
                        song = _b;
                        return [2 /*return*/, song];
                }
            });
        });
    };
    MusicUtil.playlist = function (search, queue, requestedBy, limit, shuffle, localAddress) {
        var _a, _b, _c, _d;
        if (limit === void 0) { limit = -1; }
        if (shuffle === void 0) { shuffle = false; }
        return __awaiter(this, void 0, void 0, function () {
            var isSpotifyPlaylistLink, isDeezerPlaylistLink, isYouTubePlaylistLink, spotifyResult_1, playlistData, _e, _f, playlistId, deezerResult_1, playlistData, _g, playlistId, youtubeResult, playlistData;
            var _this = this;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        isSpotifyPlaylistLink = REGEX_LIST.SPOTIFY_PLAYLIST.test(search);
                        isDeezerPlaylistLink = REGEX_LIST.DEEZER_PLAYLIST.test(search);
                        isYouTubePlaylistLink = REGEX_LIST.YOUTUBE_PLAYLIST.test(search);
                        if (!isSpotifyPlaylistLink) return [3 /*break*/, 3];
                        return [4 /*yield*/, spotify_url_info_1.default.getData(search).catch(function () { return null; })];
                    case 1:
                        spotifyResult_1 = _h.sent();
                        if (!spotifyResult_1 || !["playlist", "album"].includes(spotifyResult_1.type))
                            throw "InvalidPlaylist";
                        playlistData = {
                            title: spotifyResult_1.name,
                            channel: spotifyResult_1.type === "playlist" ? { name: spotifyResult_1.owner.display_name } : spotifyResult_1.artists[0],
                            url: search,
                            videos: (_b = (_a = spotifyResult_1.tracks) === null || _a === void 0 ? void 0 : _a.items) !== null && _b !== void 0 ? _b : []
                        };
                        _e = playlistData;
                        return [4 /*yield*/, Promise.all(playlistData.videos.map(function (track, index) { return __awaiter(_this, void 0, void 0, function () {
                                var result;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (limit !== -1 && index >= limit)
                                                return [2 /*return*/];
                                            if (spotifyResult_1.type === "playlist")
                                                track = track.track;
                                            return [4 /*yield*/, this.search(track.artists[0].name + " - " + track.name, queue, requestedBy).catch(function () { return null; })];
                                        case 1:
                                            result = _a.sent();
                                            return [2 /*return*/, result ? result[0] : null];
                                    }
                                });
                            }); }))];
                    case 2:
                        _e.videos = (_h.sent())
                            .filter(function (v) { return v; });
                        if (shuffle)
                            playlistData.videos = this.shuffle(playlistData.videos);
                        return [2 /*return*/, new Playlist_1.default(playlistData, queue, requestedBy)];
                    case 3:
                        if (!isDeezerPlaylistLink) return [3 /*break*/, 6];
                        _f = __read(search.match(REGEX_LIST.DEEZER_PLAYLIST), 2), playlistId = _f[1];
                        return [4 /*yield*/, deezer.playlist(playlistId).catch(function () { return null; })];
                    case 4:
                        deezerResult_1 = _h.sent();
                        if (!deezerResult_1 || !["playlist", "album"].includes(deezerResult_1.type))
                            throw "InvalidPlaylist";
                        playlistData = {
                            title: deezerResult_1.name,
                            channel: deezerResult_1.type === "playlist" ? { name: deezerResult_1.owner.display_name } : deezerResult_1.artists[0],
                            url: search,
                            videos: (_d = (_c = deezerResult_1.tracks) === null || _c === void 0 ? void 0 : _c.items) !== null && _d !== void 0 ? _d : []
                        };
                        _g = playlistData;
                        return [4 /*yield*/, Promise.all(playlistData.videos.map(function (track, index) { return __awaiter(_this, void 0, void 0, function () {
                                var result;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (limit !== -1 && index >= limit)
                                                return [2 /*return*/];
                                            if (deezerResult_1.type === "playlist")
                                                track = track.track;
                                            return [4 /*yield*/, this.search(track['artists'][0].name + " - " + track['name'], queue, requestedBy).catch(function () { return null; })];
                                        case 1:
                                            result = _a.sent();
                                            return [2 /*return*/, result ? result[0] : null];
                                    }
                                });
                            }); }))];
                    case 5:
                        _g.videos = (_h.sent())
                            .filter(function (v) { return v; });
                        if (shuffle)
                            playlistData.videos = this.shuffle(playlistData.videos);
                        return [2 /*return*/, new Playlist_1.default(playlistData, queue, requestedBy)];
                    case 6:
                        if (!isYouTubePlaylistLink) return [3 /*break*/, 8];
                        playlistId = parseYouTubePlaylist(search);
                        if (!playlistId)
                            throw "InvalidPlaylist";
                        youtube.options.localAddress = localAddress;
                        return [4 /*yield*/, youtube.getPlaylist(playlistId)];
                    case 7:
                        youtubeResult = _h.sent();
                        if (!youtubeResult || Object.keys(youtubeResult).length === 0)
                            throw "InvalidPlaylist";
                        playlistData = {
                            title: youtubeResult.title,
                            channel: { name: youtubeResult.channel.name },
                            url: search,
                            videos: []
                        };
                        playlistData.videos = youtubeResult.videos.map(function (video, index) {
                            if (limit !== -1 && index >= limit)
                                return;
                            var songData = {
                                title: video.title,
                                duration: video.duration,
                                channel: { name: video.channel.name },
                                thumbnail: video.thumbnails.best,
                                url: "https://youtube.com/watch?v=" + video.id,
                                isLive: video.isLive
                            };
                            return new Song_1.default(songData, queue, requestedBy);
                        })
                            .filter(function (V) { return V; });
                        if (shuffle)
                            playlistData.videos = this.shuffle(playlistData.videos);
                        return [2 /*return*/, new Playlist_1.default(playlistData, queue, requestedBy)];
                    case 8: throw "InvalidPlaylist";
                }
            });
        });
    };
    MusicUtil.millisecondsToTime = function (ms) {
        var seconds = Math.floor(ms / 1000 % 60);
        var minutes = Math.floor(ms / 60000 % 60);
        var hours = Math.floor(ms / 3600000);
        var secondsT = ("" + seconds).padStart(2, '0');
        var minutesT = ("" + minutes).padStart(2, '0');
        var hoursT = ("" + hours).padStart(2, '0');
        return "" + (hours ? hoursT + ":" : '') + minutesT + ":" + secondsT;
    };
    MusicUtil.timeToMilliseconds = function (time) {
        var items = time.split(':');
        return items.reduceRight(function (prev, curr, i, arr) { return prev + parseInt(curr) * Math.pow(60, (arr.length - 1 - i)); }, 0) * 1000;
    };
    MusicUtil.buildBar = function (value, maxValue) {
        var percentage = value / maxValue > 1 ? 0 : value / maxValue;
        var progress = Math.round(20 * percentage);
        var emptyProgress = Math.round(20 * (1 - percentage));
        var progressText = "━".repeat(progress) + "🔘";
        var emptyProgressText = "━".repeat(emptyProgress);
        return "[" + progressText + "](https://mayze.xyz)" + emptyProgressText + "\n" + this.millisecondsToTime(value) + "/" + this.millisecondsToTime(maxValue);
    };
    MusicUtil.deserializeOptionsPlay = function (options) {
        if (options && typeof options === "object")
            return Object.assign({}, this.PlayOptions, options);
        else if (typeof options === "string")
            return Object.assign({}, this.PlayOptions, { search: options });
        else
            return this.PlayOptions;
    };
    MusicUtil.deserializeOptionsPlaylist = function (options) {
        if (options && typeof options === "object")
            return Object.assign({}, this.PlaylistOptions, options);
        else if (typeof options === "string")
            return Object.assign({}, this.PlaylistOptions, { search: options });
        else
            return this.PlaylistOptions;
    };
    MusicUtil.shuffle = function (array) {
        if (!Array.isArray(array))
            return [];
        var clone = __spreadArray([], __read(array), false);
        var shuffled = [];
        while (clone.length > 0)
            shuffled.push(clone.splice(Math.floor(Math.random() * clone.length), 1)[0]);
        return shuffled;
    };
    MusicUtil.PlayOptions = {
        uploadDate: null,
        duration: null,
        sortBy: "relevance",
        index: null,
        localAddress: null
    };
    MusicUtil.PlaylistOptions = {
        maxSongs: -1,
        shuffle: false,
        localAddress: null
    };
    return MusicUtil;
}());
exports.default = MusicUtil;
