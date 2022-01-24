"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Song = /** @class */ (function () {
    function Song(songData, queue, requestedBy) {
        this.name = songData.title;
        this.duration = songData.duration;
        this.author = songData.channel.name;
        this.url = songData.url;
        this.thumbnail = songData.thumbnail;
        this.queue = queue;
        this.requestedBy = requestedBy;
        this.isLive = songData.isLive;
        this.seekTime = 0;
    }
    return Song;
}());
exports.default = Song;
