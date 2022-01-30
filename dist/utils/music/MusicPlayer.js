"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var MusicPlayer = /** @class */ (function () {
    function MusicPlayer(client) {
        this.client = client;
        this.queues = new discord_js_1.Collection();
    }
    MusicPlayer.prototype.isPlaying = function (guildId) {
        return this.queues.some(function (queue) { return queue.voiceChannel.guild.id === guildId && !queue.stopped; });
    };
    MusicPlayer.prototype.get = function (guildId) {
        return this.queues.find(function (queue) { return queue.voiceChannel.guild.id === guildId && !queue.stopped; });
    };
    return MusicPlayer;
}());
exports.default = MusicPlayer;
