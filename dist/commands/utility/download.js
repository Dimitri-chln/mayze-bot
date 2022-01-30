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
var Util_1 = __importDefault(require("../../Util"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var zipDirectory_1 = __importDefault(require("../../utils/misc/zipDirectory"));
var ytdl_core_1 = __importDefault(require("ytdl-core"));
var discord_js_1 = require("discord.js");
var MusicUtil_1 = __importDefault(require("../../utils/music/MusicUtil"));
var youtubei_1 = __importDefault(require("@sushibtw/youtubei"));
var command = {
    name: "download",
    description: {
        fr: "Télécharger une musique ou une playlist depuis YouTube",
        en: "Download a song or a playlist from YouTube"
    },
    userPermissions: [],
    botPermissions: ["EMBED_LINKS", "ATTACH_FILES"],
    options: {
        fr: [
            {
                name: "url",
                description: "L'URL de la vidéo ou playlist YouTube",
                type: "STRING",
                required: true
            },
            {
                name: "type",
                description: "Le type de fichier à télécharger",
                type: "STRING",
                required: false,
                choices: [
                    {
                        name: "MP3 - Audio uniquement",
                        value: "mp3"
                    },
                    {
                        name: "MP4 - Audio et vidéo",
                        value: "mp4"
                    }
                ]
            }
        ],
        en: [
            {
                name: "url",
                description: "The URL of the YouTube video or playlist",
                type: "STRING",
                required: false
            },
            {
                name: "type",
                description: "The type of file to download",
                type: "STRING",
                required: false,
                choices: [
                    {
                        name: "MP3 - Audio only",
                        value: "mp3"
                    },
                    {
                        name: "MP4 - Video and audio",
                        value: "mp4"
                    }
                ]
            }
        ]
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        function downloadVideo(url, songIndex, totalSongs, outputDirectory) {
            var _this = this;
            if (songIndex === void 0) { songIndex = 0; }
            if (totalSongs === void 0) { totalSongs = 1; }
            if (outputDirectory === void 0) { outputDirectory = ""; }
            return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                var info, duration, filename, path;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, ytdl_core_1.default.getInfo(url)];
                        case 1:
                            info = _a.sent();
                            duration = MusicUtil_1.default.timeToMilliseconds(info.videoDetails.lengthSeconds);
                            filename = info.videoDetails.title + "." + fileType;
                            path = path_1.default.join(__dirname, "..", "..", "downloads", outputDirectory, filename);
                            embed
                                .setTitle(translations.data.title() + " " + info.videoDetails.title + " (" + (songIndex + 1) + "/" + totalSongs + ")")
                                .setDescription(MusicUtil_1.default.buildBar(0, duration))
                                .setThumbnail(info.videoDetails.thumbnails[0].url);
                            if (!(songIndex === 1 || Date.now() - lastProgressUpdate > 2000)) return [3 /*break*/, 3];
                            return [4 /*yield*/, reply.edit({
                                    embeds: [embed]
                                })];
                        case 2:
                            _a.sent();
                            lastProgressUpdate = Date.now();
                            _a.label = 3;
                        case 3:
                            (0, ytdl_core_1.default)(url, DOWNLOAD_OPTIONS[fileType])
                                .on("progress", function (chunkLength, downloadedBytes, totalBytes) {
                                if (Date.now() - lastProgressUpdate > 1200) {
                                    embed.setDescription(MusicUtil_1.default.buildBar((downloadedBytes / totalBytes) * duration, duration));
                                    reply.edit({
                                        embeds: [embed]
                                    });
                                    lastProgressUpdate = Date.now();
                                }
                            })
                                .on("finish", function () {
                                resolve({
                                    path: path,
                                    filename: filename,
                                    duration: duration
                                });
                            })
                                .pipe(fs_1.default.createWriteStream(path));
                            return [2 /*return*/];
                    }
                });
            }); });
        }
        var YouTube, REGEX_LIST, DOWNLOAD_OPTIONS, url, fileType, type, embed, reply, lastProgressUpdate, _a, result_1, buffer, playlistInfo, _b, _c, video, e_1_1, zipDir, zipName_1, buffer;
        var e_1, _d;
        var _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    YouTube = new youtubei_1.default.Client();
                    REGEX_LIST = {
                        YOUTUBE_VIDEO: /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/,
                        YOUTUBE_PLAYLIST: /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#&?]*).*/,
                    };
                    DOWNLOAD_OPTIONS = {
                        "mp3": {
                            quality: "highestaudio",
                            filter: "audioonly"
                        },
                        "mp4": {
                            quality: "highestvideo",
                            filter: "videoandaudio"
                        }
                    };
                    url = (_e = interaction.options.getString("url")) !== null && _e !== void 0 ? _e : (_g = (_f = Util_1.default.musicPlayer.get(interaction.guild.id)) === null || _f === void 0 ? void 0 : _f.nowPlaying) === null || _g === void 0 ? void 0 : _g.url;
                    if (!url)
                        return [2 /*return*/, interaction.reply({
                                content: translations.data.no_url(),
                                ephemeral: true
                            })];
                    fileType = interaction.options.getString("type");
                    type = REGEX_LIST.YOUTUBE_VIDEO.test(url) ? "video"
                        : REGEX_LIST.YOUTUBE_PLAYLIST.test(url) ? "playlist"
                            : "unknown";
                    embed = new discord_js_1.MessageEmbed({
                        author: {
                            name: interaction.user.tag,
                            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                        },
                        title: translations.data.title(),
                        color: interaction.guild.me.displayColor,
                        description: MusicUtil_1.default.buildBar(0, 100),
                        footer: {
                            text: "✨ Mayze ✨"
                        }
                    });
                    return [4 /*yield*/, interaction.reply({
                            embeds: [embed],
                            fetchReply: true
                        })];
                case 1:
                    reply = _h.sent();
                    lastProgressUpdate = Date.now();
                    _a = type;
                    switch (_a) {
                        case "video": return [3 /*break*/, 2];
                        case "playlist": return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 16];
                case 2: return [4 /*yield*/, downloadVideo(url)];
                case 3:
                    result_1 = _h.sent();
                    embed
                        .setDescription(MusicUtil_1.default.buildBar(result_1.duration, result_1.duration))
                        .setFooter({
                        text: "\u2728 Mayze \u2728 | " + translations.data.complete()
                    });
                    reply.edit({
                        embeds: [embed]
                    });
                    buffer = fs_1.default.readFileSync(result_1.path);
                    return [4 /*yield*/, interaction.channel.send({
                            files: [new discord_js_1.MessageAttachment(buffer, result_1.filename)]
                        })
                            .catch(function (err) {
                            if (err.code === 40005) {
                                embed.setDescription(translations.data.file_too_big());
                                reply.edit({
                                    embeds: [embed]
                                });
                            }
                            else
                                console.error(err);
                        })
                            .finally(function () { return fs_1.default.unlinkSync(result_1.path); })];
                case 4:
                    _h.sent();
                    return [3 /*break*/, 17];
                case 5: return [4 /*yield*/, YouTube.getPlaylist(url)];
                case 6:
                    playlistInfo = _h.sent();
                    fs_1.default.mkdirSync(path_1.default.join(__dirname, "..", "..", "downloads", playlistInfo.title));
                    _h.label = 7;
                case 7:
                    _h.trys.push([7, 12, 13, 14]);
                    _b = __values(playlistInfo.videos), _c = _b.next();
                    _h.label = 8;
                case 8:
                    if (!!_c.done) return [3 /*break*/, 11];
                    video = _c.value;
                    return [4 /*yield*/, downloadVideo("https://youtube.com/watch?v=" + video.id, playlistInfo.videos.indexOf(video), playlistInfo.videos.length, playlistInfo.title + "/")];
                case 9:
                    _h.sent();
                    _h.label = 10;
                case 10:
                    _c = _b.next();
                    return [3 /*break*/, 8];
                case 11: return [3 /*break*/, 14];
                case 12:
                    e_1_1 = _h.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 14];
                case 13:
                    try {
                        if (_c && !_c.done && (_d = _b.return)) _d.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 14:
                    embed
                        .setDescription(MusicUtil_1.default.buildBar(playlistInfo.videos.slice(-1)[0].duration * 1000, playlistInfo.videos.slice(-1)[0].duration * 1000))
                        .setFooter({
                        text: "\u2728 Mayze \u2728 | " + translations.data.complete()
                    });
                    reply.edit({
                        embeds: [embed]
                    });
                    zipDir = path_1.default.join(__dirname, "..", "..", "downloads", playlistInfo.title);
                    zipName_1 = path_1.default.join(__dirname, "..", "..", "downloads", playlistInfo.title + ".zip");
                    return [4 /*yield*/, (0, zipDirectory_1.default)(path_1.default.join(__dirname, "..", "..", "downloads", playlistInfo.title), zipName_1)];
                case 15:
                    _h.sent();
                    buffer = fs_1.default.readFileSync(zipName_1);
                    interaction.channel.send({
                        files: [new discord_js_1.MessageAttachment(buffer, playlistInfo.title + ".zip")]
                    })
                        .catch(function (err) {
                        if (err.code === 40005) {
                            embed.setDescription(translations.data.file_too_big());
                            reply.edit({
                                embeds: [embed]
                            });
                        }
                        else
                            console.error(err);
                    })
                        .finally(function () { return fs_1.default.unlinkSync(zipName_1); });
                    fs_1.default.rmSync(zipDir, { recursive: true });
                    return [3 /*break*/, 17];
                case 16:
                    interaction.channel.send(translations.data.invalid_url());
                    _h.label = 17;
                case 17: return [2 /*return*/];
            }
        });
    }); }
};
exports.default = command;
