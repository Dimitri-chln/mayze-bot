const { Song } = require('discord-music-player');
const Discord = require('discord.js');
const { PlayerOptions, TimeToMilliseconds, MillisecondsToTime } = require('./Util');

/**
 * Represents a guild queue.
 * @param {string} guildID
 * @param {PlayerOptions} options
 * @param {Discord.Message} message
 */
class Queue {

    /**
     * Represents a guild queue.
     * @param {string} guildID
     * @param {PlayerOptions} options
     * @param {Discord.Message} message
     */
    constructor(guildID, options, message){
        /**
         * The guild ID.
         * @type {Snowflake}
         */
        this.guildID = guildID;
        /**
         * The stream dispatcher.
         * @type {StreamDispatcher}
         */
        this.dispatcher = null;
        /**
         * The voice connection.
         * @type {VoiceConnection}
         */
        this.connection = null;
        /**
         * Songs. The first one is currently playing and the rest is going to be played.
         * @type {Song[]}
         */
        this.songs = [];
        /**
         * Whether the stream is currently stopped.
         * @type {Boolean}
         */
        this.stopped = false;
        /**
         * Whether the last song was skipped.
         * @type {Boolean}
         */
        this.skipped = false;
        /**
         * The stream volume.
         * @type {Number}
         */
        this.volume = options.volume || 100;
        /**
         * Whether the stream is currently playing.
         * @type {Boolean}
         */
        this.playing = true;
        /**
         * Whether the repeat mode is enabled.
         * @type {Boolean}
         */
        this.repeatMode = false;
        /**
         * Whether the full queue repeat mode is enabled.
         * @type {Boolean}
         */
        this.repeatQueue = false;
        /**
         * First message object.
         * @type {Discord.Message}
         */
        this.initMessage = message;
        /**
         * Queue Options copied from Default Options.
         * @type {PlayerOptions}
         */
        this.options = options;
    }

    /**
         * @returns {Number} The total duration of the queue
         */
     get duration() {
        return this.dispatcher
            ? MillisecondsToTime(this.songs.reduce((sum, song) => sum + TimeToMilliseconds(song.duration), 0)
                - this.dispatcher?.streamTime
                - (this.songs.length ? this.songs[0].seekTime : 0))
            : null;
    }
}

module.exports = Queue;