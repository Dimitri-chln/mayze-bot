import { Client, Snowflake, Message, Collection, StreamDispatcher, VoiceConnection, VoiceState } from "discord.js";
import { Video, Playlist as YoutubePlaylist } from "youtubei";
import ytsr from "ytsr";

interface PlayerEvents {
    channelEmpty: [message: Message, queue: Queue];
    songAdd: [message: Message, queue: Queue, song: Song];
    playlistAdd: [message: Message, queue: Queue, playlist: Playlist];
    queueEnd: [message: Message, queue: Queue];
    songChanged: [message: Message, newSong: Song, oldSong: Song];
    songFirst: [message: Message, song: Song];
    error: [error: String, message: Message];
    clientDisconnect: [message: Message, queue: Queue];
    clientUndeafen: [message: Message, queue: Queue]
}
type PlayOptions = {
    search: String;
    uploadDate: 'hour' | 'today' | 'week' | 'month' | 'year';
    duration: 'short' | 'long';
    sortBy: 'relevance' | 'date' | 'view count' | 'rating';
    requestedBy: String;
    index: Number;
}

type PlaylistOptions = {
    search: String;
    maxSongs: Number;
    requestedBy: String;
    shuffle: Boolean;
}
type ProgressOptions = {
    size: Number;
    arrow: String;
    block: String;
}
type PlayerOptions = {
    leaveOnEnd: Boolean;
    leaveOnStop: Boolean;
    leaveOnEmpty: Boolean;
    deafenOnJoin: Boolean;
    timeout: Number;
    volume: Number;
    quality: 'high' | 'low';
}

export class Player {
    constructor(client: Client, options: PlayerOptions);
    client: Client;
    options: PlayerOptions;
    queues: Map<String, Queue>;
    ytsr: any;
    nowPlayings: Collection<Snowflake, Message>;

    public on<K extends keyof PlayerEvents>(event: K, listener: (...args: PlayerEvents[K]) => void): this;
    isPlaying(message: Message): Boolean;
    play(message: Message, options: PlayOptions | String): Promise<Song>;
    addToQueue(message: Message, options: PlayOptions | String): Promise<Song>;
    seek(message: Message, seek: Number):Promise<Song>;
    playlist(message: Message, options: PlaylistOptions | String): Promise<Playlist>;
    pause(message: Message): Song;
    resume(message: Message): Song;
    stop(message: Message): Song;
    setVolume(message: Message, percentage: Number): Song;
    getVolume(message: Message): Number;
    getQueue(message: Message): Queue;
    setQueue(message: Message, songs: Song[]): Queue;
    clearQueue(message: Message): Queue;
    skip(message: Message): Song;
    skipTo(message: Message, index: Number): Song;
    nowPlaying(message: Message): Song;
    setQueueRepeatMode(message: Message, enabled: Boolean): Boolean;
    setRepeatMode(message: Message, enabled: Boolean): Boolean;
    toggleLoop(message: Message): Boolean;
    toggleQueueLoop(message: Message): Boolean;
    move(message: Message, index: Number, position: Number): Song;
    remove(message: Message, songs: String[]): Song[];
    shuffle(message: Message): Song[];
    createProgressBar(message: Message, options?: ProgressOptions): String;
    updateQueueOptions(message: Message, options?: PlayerOptions): void;
    _playSong(guildID: String, firstPlay: Boolean, seek?: Number): void;
}

export class Queue {
    constructor(guildID: Snowflake, options: Object, message: Message);
    guildID: Snowflake;
    dispatcher: StreamDispatcher;
    connection: VoiceConnection;
    songs: Song[];
    stopped: Boolean;
    skipped: Boolean;
    volume: Number;
    playing: Boolean;
    repeatMode: Boolean;
    repeatQueue: Boolean;
    initMessage: Message;
    options: PlayerOptions;
    duration: Number;
}

export class Song {
    constructor(video: Video, queue: Queue, requestedBy: String);
    name: String;
    duration: String | Number;
    author: String;
    url: String;
    thumbnail: String;
    queue: Queue;
    isLive: Boolean;
    requestedBy: String;
    seekTime: Number;
}

export class Playlist {
    constructor(playlist: YoutubePlaylist, queue: Queue, requestedBy: String);
    name: String;
    author: String;
    url: String;
    videos: Song[];
    videoCount: Number;
}

export class MusicPlayerError {
    constructor(error: String);
    type: String;
    message: String;
}

export class Util {
    PlayerOptions: PlayOptions;
    PlayOptions: PlayOptions;
    PlaylistOptions: PlaylistOptions;
    ProgessOptions: ProgressOptions;
    getVideoBySearch(search: String, options: object, queue: Queue, requestedBy: String): Promise<Song>;
    getVideoFromPlaylist(search: String, max: Number, queue: Queue, requestedBy: String): Promise<Playlist>;
    songFromSpotify(query: String): Promise<String>;
    MillisecondsToTime(ms: Number): String;
    TimeToMilliseconds(time: String): Number;
    buildBar(value: Number, maxValue: Number, size: Number, loadedIcon: String, arrowIcon: String): String;
    deserializeOptionsPlayer(options: Partial<PlayerOptions>): PlayerOptions | Partial<PlayerOptions>;
    deserializeOptionsPlay(options: Partial<PlayOptions> | String): Partial<PlayOptions>;
    deserializeOptionsPlaylist(options: Partial<PlaylistOptions> | String): Partial<PlaylistOptions>;
    deserializeOptionsProgress(options: Partial<ProgressOptions>): Partial<ProgressOptions>;
    isVoice(voice: VoiceState): Boolean;
    shuffle(array: []): [];
}

export const Utils: Util;