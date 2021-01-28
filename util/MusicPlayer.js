/**
 * Specific errors.
 */
const customErrors = {
	'SearchIsNull': 'No Song was found with that query.',
	'VoiceChannelTypeInvalid': 'Voice Channel must be a type of VoiceChannel.',
	'SongTypeInvalid': 'Song must be a type of String.',
	'QueueIsNull': 'The Guild Queue is NULL.',
	'OptionsTypeInvalid': 'The Search Options must be a type of Object.',
	'NotANumber': 'The provided argument is not a Number.',
	'InvalidPlaylist': 'No Playlist was found with that link.',
	'MaxSongsTypeInvalid': 'The provided argument (MaxSongsTypeInvalid) is not a Number.',
	'PlaylistTypeInvalid': 'The provided argument (PlaylistURL) was not a String.'
}

/**
 * Represents a Music Error.
 */
class MusicPlayerError {
	/**
	 * @param {string} error Error.
	 * @param {object} nullObject Object.
	 */
	constructor(error, nullObject, playlistNull) {
		/**
		 * Error type.
		 * @type {string}
		*/

		this.error = {};

		this.error.type = error;

		/**
		 * Error message.
		 * @type {string}
		 */
		this.error.message = customErrors[error];

		if (nullObject)
			this[nullObject] = null;
		if (playlistNull)
			this[playlistNull] = null;
	}
}




/**
 * Represents a song.
 */
class Song {
	/**
	 * @param {Video} video The Youtube video
	 * @param {Queue} queue The queue in which the song is
	 */
	constructor(video, queue, requestedBy) {
		/**
		 * Song name.
		 * @type {string}
		 */
		this.name = video.title;
		/**
		 * Song duration.
		 * @type {Number}
		 */
		this.duration = video.duration;
		/**
		 * Author channel of the song.
		 * @type {string}
		 */
		this.author = video.author.name || video.author;
		/**
		 * Youtube video URL.
		 * @type {string}
		 */
		this.url = video.link;
		/**
		 * Youtube video thumbnail.
		 * @type {string}
		 */
		this.thumbnail = video.thumbnail;
		/**
		 * The queue in which the song is.
		 * @type {Queue}
		 */
		this.queue = queue;
		/**
		 * The user who requested that song.
		 * @type {User}
		 */
		this.requestedBy = requestedBy;
	}
};



const { EventEmitter } = require('events');

/**
 * Represents a guild queue.
 */
class Queue extends EventEmitter {

	/**
	 * Represents a guild queue.
	 * @param {string} guildID 
	 */
	constructor(guildID){
		super();
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
		 * The start of the audio to seek
		 * @type {number}
		 */
		this.seek = 0;
		/**
		 * The stream volume.
		 * @type {Number}
		 */
		this.volume = 100;
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

	}

};

/**
 * Emitted when the queue is empty.
 * @event Queue#end
 */


/**
 * Emitted when the voice channel is empty.
 * @event Queue#channelEmpty
 */

/**
 * Emitted when the song changes.
 * @event Queue#songChanged
 * @param {Song} oldSong The old song (playing before)
 * @param {Song} newSong The new song (currently playing)
 * @param {Boolean} skipped Whether the change is due to the skip() function
 */



const scrapeYT = require('scrape-yt');
let defaultThumbnail = 'https://reactnativecode.com/wp-content/uploads/2018/02/Default_Image_Thumbnail.png';

//RegEx Definitions
let VideoRegex = /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))((?!channel)(?!user)\/(?:[\w\-]+\?v=|embed\/|v\/)?)((?!channel)(?!user)[\w\-]+)(\S+)?$/;
let VideoRegexID = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
let PlaylistRegex = /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#\&\?]*).*/;
let PlaylistRegexID = /[&?]list=([^&]+)/;

/**
 * Get ID from YouTube link.
 * @param {string} url
 * @returns {string}
 */
function youtube_parser(url) {
	var match = url.match(VideoRegexID);
	return (match && match[7].length == 11) ? match[7] : false;
}

/**
 * Get ID from Playlist link.
 * @param {string} url
 * @returns {string}
 */
function playlist_parser(url) {
	var match = url.match(PlaylistRegexID);
	return (match && match[1].length == 34) ? match[1] : false;
}

/**
 * A pure function to pick specific keys from object.
 * @param {Object} obj: The object to pick the specified keys from
 * @param {Array} keys: A list of all keys to pick from obj
 */
const pick = (obj, keys) =>
	Object.keys(obj)
		.filter(i => keys.includes(i))
		.reduce((acc, key) => {
			acc[key] = obj[key];
			return acc;
		}, {})

/**
 * Default search options
 * 
 * @property {string} uploadDate Upload date [Options: 'hour', 'today', 'week', 'month', 'year'] | Default: none
 * @property {string} duration Duration [Options: 'short', 'long'] | Default: none
 * @property {string} sortBy Sort by [Options: 'relevance', 'date', 'view count', 'rating'] | Default: relevance
 */
const defaultSearchOptions = {
	uploadDate: null,
	duration: null,
	sortBy: 'relevance',
}

/**
 * Utilities.
 * @ignore
 */
class Util {

	constructor() { }

	/**
	 * Gets the first youtube results for your search.
	 * @param {string} search The name of the video or the video URL.
	 * @param {ytsr} ytsr ytsr.
	 * @param {object} options Options.
	 * @returns {Promise<Video>}
	 */
	static getVideoBySearch(search, ytsr, options = {}) {
		return new Promise(async (resolve, reject) => {

			options = { ...defaultSearchOptions, ...options };
			options = pick(options, Object.keys(defaultSearchOptions))

			let isVideoLink = VideoRegex.test(search);

			if (isVideoLink) {
				// Search is a Valid YouTube link - skip ytsr

				let VideoID = youtube_parser(search);
				if (!VideoID) return reject('SearchIsNull');

				let video = await scrapeYT.getVideo(VideoID);

				if (Object.keys(video).length === 0)
					console.warn('[DMP] YouTube returned a empty object, you are probably rate-limited (please wait some time) - The Author and Title are Unknown.');

				// Callback on invalid duration
				if (typeof video.duration != 'number') {
					video.duration = parseInt(video.duration) || 0;
				}

				let date = new Date(null);
				date.setSeconds(video.duration);
				let duration = date.toISOString().substr(11, 8);
				duration = duration.replace(/^0(?:0:0?)?/, '');

				return resolve({
					title: video.title || 'Unknown',
					duration,
					author: video.channel ? video.channel.name || 'Unknown' : 'Unknown',
					link: search,
					thumbnail: video.channel ? video.channel.thumbnail || defaultThumbnail : defaultThumbnail
				});

			} else {
				var filters;

				// Default Options - Type: Video
				let filtersType = await ytsr.getFilters(search);

				await Promise.all(filtersType);

				filters = filtersType.get('Type').get('Video');

				// Custom Options - Upload date: null
				if (options.uploadDate != null) {
					let filtersUploadDate = await ytsr.getFilters(filters.url);

					await Promise.all(filtersUploadDate);

					filters = Array.from(filtersUploadDate.get('Upload date'), ([name, value]) => ({ name, url: value.url }))
						.find(o => o.name.toLowerCase().includes(options.uploadDate)) || filters;
				}

				// Custom Options - Duration: null
				if (options.duration != null) {
					let filtersDuration = await ytsr.getFilters(filters.url);

					await Promise.all(filtersDuration);

					filters = Array.from(filtersDuration.get('Duration'), ([name, value]) => ({ name, url: value.url }))
						.find(o => o.name.toLowerCase().startsWith(options.duration)) || filters;
				}

				// Custom Options - Sort by: relevance
				if (options.sortBy != null && !options.sortBy.toLowerCase().includes('relevance')) {
					let filtersSortBy = await ytsr.getFilters(filters.url);

					await Promise.all(filtersSortBy);

					filters = Array.from(filtersSortBy.get('Sort by'), ([name, value]) => ({ name, url: value.url }))
						.find(o => o.name.toLowerCase().includes(options.sortBy)) || filters;
				}

				const searchOptions = {
					limit: 2,
					nextpageRef: filters.url,
				}

				ytsr(filters.url, searchOptions).then(searchResults => {

					let items = searchResults.items;

					if (!items || !items[0]) return reject('SearchIsNull');

					if (items[0].type.toLowerCase() != 'video')
						items.shift();

					if (!items || !items[0]) return reject('SearchIsNull');

					Promise.all(items = items.map(vid => {
						vid.link = vid.url;
						vid.thumbnail = vid.bestThumbnail.url || defaultThumbnail;
						return vid;
					}));

					resolve(items[0]);
				}).catch((error) => {
					return reject('SearchIsNull');
				});

			}
		});
	}

	/**
	 * Gets the videos from playlist.
	 * @param {string} search Playlist URL.
	 * @param {ytsr} ytsr ytsr.
	 * @param {number} max Options.
	 * @returns {Promise<Video>}
	 */
	static getVideoFromPlaylist(search, ytsr, max) {
		return new Promise(async (resolve, reject) => {

			let isPlaylistLink = PlaylistRegex.test(search);
			if (!isPlaylistLink) return reject('InvalidPlaylist');

			let PlaylistID = playlist_parser(search);
			if (!PlaylistID) return reject('InvalidPlaylist');

			let playlist = await scrapeYT.getPlaylist(PlaylistID);
			if (Object.keys(playlist).length === 0) return reject('InvalidPlaylist');

			playlist.videos = playlist.videos.map((video, index) => {

				if (index >= max && max != -1) return null;

				// Callback on invalid duration
				if (typeof video.duration != 'number') {
					console.log(video.duration)
					video.duration = parseInt(video.duration);
				}

				if (typeof video.duration != 'number') return null;
				let duration = new Date(video.duration * 1000).toISOString().substr(11, 8);
				duration = duration.replace(/^0(?:0:0?)?/, '');

				return {
					title: video.title || 'Unknown',
					duration,
					author: video.channel ? video.channel.name || 'Unknown' : 'Unknown',
					link: `https://www.youtube.com/watch?v=${video.id}`,
					thumbnail: video.thumbnail || defaultThumbnail
				}
			});

			playlist.videos = playlist.videos.filter(function (obj) { return obj });

			resolve({
				link: search,
				videoCount: playlist.videoCount,
				title: playlist.title || 'Unknown',
				channel: playlist.channel.name || 'Unknown',
				videos: playlist.videos
			});
		});
	}

	/**
	 * Convers Milliseconds to Time (HH:MM:SS)
	 * @param {String} ms Miliseconds
	 * @returns {String}
	 */
	static MillisecondsToTime(ms) {
		let seconds = ms / 1000;
		let hours = parseInt(seconds / 3600);
		seconds = seconds % 3600;
		let minutes = parseInt(seconds / 60);
		seconds = Math.ceil(seconds % 60);

		seconds = (`0${seconds}`).slice(-2);
		minutes = (`0${minutes}`).slice(-2);
		hours = (`0${hours}`).slice(-2);

		return `${hours == 0 ? '' : `${hours}:`}${minutes}:${seconds}`;
	}

	/**
	 * Convers Time (HH:MM:SS) to Milliseconds
	 * @param {String} time Time
	 * @returns {String}
	 */
	static TimeToMilliseconds(time) {
		let items = time.split(':'),
			s = 0, m = 1;

		while (items.length > 0) {
			s += m * parseInt(items.pop());
			m *= 60;
		}

		return s * 1000;
	}

	/**
	 * Create a text progress bar
	 * @param {Number} value - The value to fill the bar
	 * @param {Number} maxValue - The max value of the bar
	 * @param {Number} size - The bar size (in letters)
	 * @param {String} loadedIcon - Loaded Icon
	 * @param {String} arrowIcon - Arrow Icon
	 * @return {String} - Music Bar
	 */
	static buildBar(value, maxValue, size, loadedIcon, arrowIcon) {
		const percentage = value / maxValue;
		const progress = Math.round((size * percentage));
		const emptyProgress = size - progress;

		const progressText = loadedIcon.repeat(progress) + arrowIcon;
		const emptyProgressText = loadedIcon.repeat(emptyProgress);

		return `[${progressText}](https://google.com)${emptyProgressText} [${this.MillisecondsToTime(value)}/${this.MillisecondsToTime(maxValue)}]`;
	};


};



const ytdl = require('ytdl-core-discord');
const mergeOptions = require('merge-options');
const ytsr = require('ytsr');
const { VoiceChannel, version, User } = require("discord.js");
if (Number(version.split('.')[0]) < 12) throw new Error("Only the master branch of discord.js library is supported for now. Install it using 'npm install discordjs/discord.js'.");

/**
 * Player options.
 * @typedef {PlayerOptions}
 * 
 * @property {Boolean} leaveOnEnd Whether the bot should leave the current voice channel when the queue ends.
 * @property {Boolean} leaveOnStop Whether the bot should leave the current voice channel when the stop() function is used.
 * @property {Boolean} leaveOnEmpty Whether the bot should leave the voice channel if there is no more member in it.
 * @property {Milliseconds} timeout After how much time the bot should leave the voice channel after the OnEnd & OnEmpty events. | Default: 0
 * @property {string} quality Music quality ['high'/'low'] | Default: high
 */
const PlayerOptions = {
	leaveOnEnd: true,
	leaveOnStop: true,
	leaveOnEmpty: true,
	timeout: 0,
	quality: 'high'
};

class Player {

	/**
	 * @param {Client} client Your Discord Client instance.
	 * @param {PlayerOptions} options The PlayerOptions object.
	 */
	constructor(client, options = {}) {
		if (!client) throw new SyntaxError('[Discord_Client_Invalid] Invalid Discord Client');
		if (typeof options != 'object') throw new SyntaxError('[Options is not an Object] The Player constructor was updated in v5.0.2, please use: new Player(client, { options }) instead of new Player(client, token, { options })');
		if (options.timeout && (isNaN(options.timeout) || !isFinite(options.timeout))) throw new TypeError('[TimeoutInvalidType] Timeout should be a Number presenting a value in milliseconds.');

		/**
		 * Your Discord Client instance.
		 * @type {Client}
		 */
		this.client = client;
		/**
		 * The guilds data.
		 * @type {Queue[]}
		 */
		this.queues = [];
		/**
		 * Player options.
		 * @type {PlayerOptions}
		 */
		this.options = mergeOptions(PlayerOptions, options);
		/**
		 * ytsr
		 * @type {ytsr}
		 */
		this.ytsr = ytsr;

		// Listener to check if the channel is empty
		client.on('voiceStateUpdate', (oldState, newState) => {
			if (!this.options.leaveOnEmpty) return;
			// If the member leaves a voice channel
			if (!oldState.channelID || newState.channelID) return;
			// Search for a queue for this channel
			let queue = this.queues.find((g) => g.connection.channel.id === oldState.channelID);
			if (queue) {
				// If the channel is not empty
				if (queue.connection.channel.members.size > 1) return;
				// Start timeout

				setTimeout(() => {
					// If the channel is not empty
					if (queue.connection.channel.members.size > 1) return;
					// Disconnect from the voice channel
					queue.connection.channel.leave();
					// Delete the queue
					this.queues = this.queues.filter((g) => g.guildID !== queue.guildID);
					// Emit end event
					queue.emit('channelEmpty');
				}, this.options.timeout);
			}
		});
	}

	/**
	 * Whether a guild is currently playing songs
	 * @param {string} guildID The guild ID to check
	 * @returns {Boolean} Whether the guild is currently playing songs
	 */
	isPlaying(guildID) {
		return this.queues.some((g) => g.guildID === guildID);
	}

	/**
	 * Plays a song in a voice channel.
	 * @param {VoiceChannel} voiceChannel The voice channel in which the song will be played.
	 * @param {string} songName The name of the song to play.
	 * @param {object} options Search options.
	 * @param {User} requestedBy The user who requested the song.
	 * @returns {Promise<Song>}
	 */
	async play(voiceChannel, songName, options = {}, requestedBy) {
		this.queues = this.queues.filter((g) => g.guildID !== voiceChannel.id);
		if ((voiceChannel || {}).type !== 'voice') return new MusicPlayerError('VoiceChannelTypeInvalid', 'song');
		if (typeof songName !== 'string' || songName.length == 0) return new MusicPlayerError('SongTypeInvalid', 'song');
		if (typeof options !== 'object') return new MusicPlayerError('OptionsTypeInvalid', 'song');
		try {
			// Searches the song
			let video = await Util.getVideoBySearch(songName, ytsr, options);

			// Joins the voice channel
			let connection = await voiceChannel.join();
			// Creates a new guild with data
			let queue = new Queue(voiceChannel.guild.id);
			queue.connection = connection;
			let song = new Song(video, queue, requestedBy);
			queue.songs.push(song);
			// Add the queue to the list
			this.queues.push(queue);
			// Plays the song
			this._playSong(queue.guildID, true);

			return { error: null, song: song };
		}
		catch (err) {
			return new MusicPlayerError('SearchIsNull', 'song');
		}
	}


	/**
	 * Plays or adds the Playlist songs to the queue.
	 * @param {string} guildID
	 * @param {string} playlistLink The name of the song to play.
	 * @param {VoiceChannel} voiceChannel The voice channel in which the song will be played.
	 * @param {number} maxSongs Max songs to add to the queue.
	 * @param {User} requestedBy The user who requested the song.
	 * @returns {Promise<Playlist>}
	 */
	async playlist(guildID, playlistLink, voiceChannel, maxSongs, requestedBy) {
		let queue = this.queues.find((g) => g.guildID === guildID);
		if (!queue) if ((voiceChannel || {}).type !== 'voice') return new MusicPlayerError('VoiceChannelTypeInvalid', 'song', 'playlist');
		if (typeof playlistLink !== 'string' || playlistLink.length == 0) return new MusicPlayerError('PlaylistTypeInvalid', 'song', 'playlist');
		if (typeof maxSongs !== 'number') return new MusicPlayerError('MaxSongsTypeInvalid', 'song', 'playlist');

		try {
			// Searches the playlist
			let playlist = await Util.getVideoFromPlaylist(playlistLink, ytsr, maxSongs);
			let connection = (queue || {}).connection;
			let isFirstPlay = queue ? false : true;
			let playlistSongs = [];

			if (!queue) {
                // Joins the voice channel if needed
                connection = await voiceChannel.join();
                // Creates a new guild with data if needed
                queue = new Queue(voiceChannel.guild.id);
				queue.connection = connection;
				// Add the queue to the list
				this.queues.push(queue);
				queue = this.queues.find((g) => g.guildID === guildID);
            }
            // Add all songs to the GuildQueue
            playlist.videos.forEach(video => {
                let song = new Song(video, queue, requestedBy);
                playlistSongs.push(song);
                queue.songs.push(song);
            });
			
			// Plays the songs
			if (isFirstPlay) this._playSong(queue.guildID, true);

			return {
				error: null, song: isFirstPlay ? queue.songs[0] : null, playlist: {
					link: playlist.link,
					playlistSongs,
					videoCount: playlist.videoCount,
					channel: playlist.channel
				}
			};
		}
		catch (err) {
			return new MusicPlayerError('InvalidPlaylist', 'song', 'playlist');
		}
	}


	/**
	 * Pauses the current song.
	 * @param {string} guildID
	 * @returns {Song}
	 */
	pause(guildID) {
		// Gets guild queue
		let queue = this.queues.find((g) => g.guildID === guildID);
		if (!queue) return new MusicPlayerError('QueueIsNull');
		// Pauses the dispatcher
		queue.dispatcher.pause();
		queue.playing = false;
		// Resolves the guild queue
		return queue.songs[0];
	}

	/**
	 * Resumes the current song.
	 * @param {string} guildID
	 * @returns {Song}
	 */
	resume(guildID) {
		// Gets guild queue
		let queue = this.queues.find((g) => g.guildID === guildID);
		if (!queue) return new MusicPlayerError('QueueIsNull');
		// Resumes the dispatcher
		queue.dispatcher.resume();
		queue.playing = true;
		// Resolves the guild queue
		return queue.songs[0];
	}

	/**
	 * Stops playing music.
	 * @param {string} guildID
	 * @returns {Void}
	 */
	stop(guildID) {
		// Gets guild queue
		let queue = this.queues.find((g) => g.guildID === guildID);
		if (!queue) return new MusicPlayerError('QueueIsNull');
		// Stops the dispatcher
		queue.stopped = true;
		queue.songs = [];
		queue.dispatcher.end();
		// Resolves
		return;
	}

	/**
	 * Updates the volume.
	 * @param {string} guildID 
	 * @param {number} percent 
	 * @returns {Void}
	 */
	setVolume(guildID, percent) {
		// Gets guild queue
		let queue = this.queues.find((g) => g.guildID === guildID);
		if (!queue) return new MusicPlayerError('QueueIsNull');
		// Updates volume
		queue.volume = percent;
		queue.dispatcher.setVolumeLogarithmic(percent / 200);
		// Resolves guild queue
		return;
	}

	/**
	 * Gets the guild queue.
	 * @param {string} guildID
	 * @returns {?Queue}
	 */
	getQueue(guildID) {
		// Gets guild queue
		let queue = this.queues.find((g) => g.guildID === guildID);
		return queue;
	}

	/**
	 * Adds a song to the guild queue.
	 * @param {string} guildID
	 * @param {string} songName The name of the song to add to the queue.
	 * @param {User} requestedBy The user who requested the song.
	 * @returns {Promise<Song>}
	 */
	async addToQueue(guildID, songName, options = {}, requestedBy) {
		// Gets guild queue
		let queue = this.queues.find((g) => g.guildID === guildID);
		if (!queue) return new MusicPlayerError('QueueIsNull', 'song');
		if (typeof songName !== 'string' || songName.length == 0) return new MusicPlayerError('SongTypeInvalid', 'song');
		if (typeof options !== 'object') return new MusicPlayerError('OptionsTypeInvalid', 'song');
		try {
			// Searches the song
			let video = await Util.getVideoBySearch(songName, ytsr, options);
			// Define the song
			let song = new Song(video, queue, requestedBy);
			// Updates queue
			queue.songs.push(song);
			// Resolves the song
			return { error: null, song: song };
		}
		catch (err) {

			return new MusicPlayerError('SearchIsNull', 'song');
		};
	}

	/**
	 * Sets the queue for a guild.
	 * @param {string} guildID
	 * @param {Array<Song>} songs The songs list
	 * @returns {Queue}
	 */
	setQueue(guildID, songs) {
		// Gets guild queue
		let queue = this.queues.find((g) => g.guildID === guildID);
		if (!queue) return new MusicPlayerError('QueueIsNull');
		// Updates queue
		queue.songs = songs;
		// Resolves the queue
		return queue.songs;
	}

	/**
	 * Clears the guild queue, but not the current song.
	 * @param {string} guildID
	 * @returns {Queue}
	 */
	clearQueue(guildID) {
		// Gets guild queue
		let queue = this.queues.find((g) => g.guildID === guildID);
		if (!queue) return new MusicPlayerError('QueueIsNull');
		// Clears queue
		let currentlyPlaying = queue.songs.shift();
		queue.songs = [currentlyPlaying];
		// Resolves guild queue
		return queue.songs;
	}

	/**
	 * Skips a song.
	 * @param {string} guildID
	 * @returns {Song}
	 */
	skip(guildID) {
		// Gets guild queue
		let queue = this.queues.find((g) => g.guildID === guildID);
		if (!queue) return new MusicPlayerError('QueueIsNull');
		let currentSong = queue.songs[0];
		queue.skipped = true;
		// Ends the dispatcher
		queue.dispatcher.end();
		// Resolves the current song
		return currentSong;
	}

	/**
	 * Gets the currently playing song.
	 * @param {string} guildID
	 * @returns {Song}
	 */
	nowPlaying(guildID) {
		// Gets guild queue
		let queue = this.queues.find((g) => g.guildID === guildID);
		if (!queue) return new MusicPlayerError('QueueIsNull');
		let currentSong = queue.songs[0];
		// Resolves the current song

		return currentSong;
	}

	/**
	 * Enable or disable the repeat mode
	 * @param {string} guildID
	 * @param {boolean} enabled Whether the repeat mode should be enabled
	 * @returns {Void}
	 */
	setRepeatMode(guildID, enabled) {
		// Gets guild queue
		let queue = this.queues.find((g) => g.guildID === guildID);
		if (!queue) return new MusicPlayerError('QueueIsNull');
		// Enable/Disable repeat mode
		queue.repeatMode = enabled;
		// Resolve
		return;
	}

	/**
	 * Toggle the repeat mode
	 * @param {string} guildID
	 * @returns {boolean} Returns the current set state
	 */
	toggleLoop(guildID) {
		// Gets guild queue
		let queue = this.queues.find((g) => g.guildID === guildID);
		if (!queue) return new MusicPlayerError('QueueIsNull');
		// Enable/Disable repeat mode
		queue.repeatMode = !queue.repeatMode;
		// Resolve
		return queue.repeatMode;
	}

	/**
	 * Moves a song to another position in the queue
	 * @param {string} guildID 
	 * @param {number} songID 
	 * @param {number} position 
	 */
	move(guildID, songID, position) {
		// Gets guild queue
		let queue = this.queues.find((g) => g.guildID === guildID);
		if (!queue) return new MusicPlayerError('QueueIsNull');

		let songFound = null;
		if (typeof songID == 'number') {
			songFound = queue.songs[songID];
			queue.songs.splice(position, 0, queue.songs.splice(songID, 1)[0]);
		} else return new MusicPlayerError('NotANumber');

		return songFound;
		
	}

	/**
	 * Removes a song from the queue
	 * @param {string} guildID 
	 * @param {number} song The index of the song to remove or the song to remove object.
	 * @returns {Song|MusicPlayerError}
	 */
	remove(guildID, song) {
		// Gets guild queue
		let queue = this.queues.find((g) => g.guildID === guildID);
		if (!queue) return new MusicPlayerError('QueueIsNull');
		// Remove the song from the queue
		let songFound = null;
		if (typeof song === "number") {
			songFound = queue.songs[song];
			if (songFound) {
				queue.songs = queue.songs.filter((s) => s !== songFound);
			}
		} else return new MusicPlayerError('NotANumber');
		// Resolve
		return songFound;
	}

	/**
	 * Shuffles the guild queue.
	 * @param {string} guildID 
	 * @returns {Songs}
	 */
	shuffle(guildID) {
		// Gets guild queue
		let queue = this.queues.find((g) => g.guildID === guildID);
		if (!queue) return new MusicPlayerError('QueueIsNull');

		let currentSong = queue.songs.shift();
		queue.songs = queue.songs.sort(() => Math.random() - 0.5);
		queue.songs.unshift(currentSong);

		return queue.songs;
	}

	/**
	 * Seeks timestamp in the playing song
	 * @param {string} guildID
	 * @param {number} time The time in milliseconds
	 */
	seek(guildID, time) {
		// Gets guild queue
		let queue = this.queues.find((g) => g.guildID === guildID);
		if (!queue) return new MusicPlayerError('QueueIsNull');

		queue.seek = time;
		queue.dispatcher.end();

		return queue.songs[0];
	}


	/**
	* Creates a progress bar per current playing song.
	* @param {String} guildID Guild ID
	* @param {String} barSize Bar Size
	* @param {String} arrowIcon Arrow Icon
	* @param {String} loadedIcon Loaded Icon
	* @returns {String}
	*/
	createProgressBar(guildID, barSize = 20, arrowIcon = '🔘', loadedIcon = '━') {
		let queue = this.queues.find((g) => g.guildID === guildID);
		if (!queue) return new MusicPlayerError('QueueIsNull');

		let timePassed = queue.dispatcher.streamTime;
		let timeEnd = Util.TimeToMilliseconds(queue.songs[0].duration);

		return `${Util.buildBar(timePassed, timeEnd, barSize, loadedIcon, arrowIcon)}`;
	}

	/**
	 * Start playing songs in a guild.
	 * @ignore
	 * @param {string} guildID
	 * @param {Boolean} firstPlay Whether the function was called from the play() one
	 */
	async _playSong(guildID, firstPlay) {
		// Gets guild queue
		let queue = this.queues.find((g) => g.guildID === guildID);
		if (!queue) return;
		// If there isn't any music in the queue
		if (queue.songs.length < 2 && !firstPlay && !queue.repeatMode && queue.seek == 0) {
			// Removes the guild from the guilds list
			this.queues = this.queues.filter((g) => g.guildID !== guildID);

			// Emit stop event
			if (queue.stopped) {
				if (this.options.leaveOnStop)
					queue.connection.channel.leave();
				// Emits the stop event
				return queue.emit('stop');
			}

			// Emit end event
			if (this.options.leaveOnEnd) {
				// Emits the end event
				queue.emit('end');
				// Timeout
				let connectionChannel = queue.connection.channel;
				setTimeout(() => {
					queue = this.queues.find((g) => g.guildID === guildID);
					if (!queue || queue.songs.length < 1) {
						return connectionChannel.leave();
					}
				}, this.options.timeout);
				return;
			}
		} else {
			// Emit songChanged event
			if (!firstPlay) queue.emit('songChanged', (!queue.repeatMode ? queue.songs.shift() : queue.songs[0]), queue.songs[0], queue.skipped, queue.repeatMode);
			queue.skipped = false;
			let song = queue.songs[0];
			// Download the song
			let Quality = this.options.quality;
			Quality = Quality.toLowerCase() == 'low' ? 'lowestaudio' : 'highestaudio';

			let stream = await ytdl(song.url, { filter: 'audioonly', quality: Quality, highWaterMark: 1 << 25, begin: queue.seek }).catch(console.error);
			if (!stream) return this._playSong(guildID, false);

			let dispatcher = queue.connection.play(stream, { type: "opus", bitrate: 96000, higWaterMark: 50, volume: false });
			queue.dispatcher = dispatcher;
			queue.seek = 0;
			// Set volume
			// dispatcher.setVolumeLogarithmic(queue.volume / 200);

			// When the song ends
			dispatcher.on('finish', () => {
				// Play the next song
				return this._playSong(guildID, false);
			});
		}
	}

};

module.exports = { Player, Util };