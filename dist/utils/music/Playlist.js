"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Playlist = /** @class */ (function () {
    function Playlist(data, queue, requestedBy) {
        this.name = data.title;
        this.author = data.channel.name;
        this.url = data.url;
        this.videos = data.videos;
    }
    return Playlist;
}());
exports.default = Playlist;
