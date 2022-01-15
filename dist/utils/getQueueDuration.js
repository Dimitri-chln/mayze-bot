"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_music_player_1 = require("discord-music-player");
function getQueueDuration(queue) {
    var _a;
    return queue.dispatcher
        ? discord_music_player_1.Utils.MillisecondsToTime(queue.songs.reduce(function (sum, song) { return sum + discord_music_player_1.Utils.TimeToMilliseconds(song.duration); }, 0)
            - ((_a = queue.dispatcher) === null || _a === void 0 ? void 0 : _a.streamTime)
            - (queue.songs.length ? queue.songs[0].seekTime : 0))
        : 0;
}
exports.default = getQueueDuration;
