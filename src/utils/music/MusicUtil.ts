// Self Definitions
import Playlist, { PlaylistData } from "./Playlist";
import Song, { SongData } from "./Song";
import Queue from "./Queue";

// External Packages
import Discord, { User } from "discord.js";
import ystr from "ytsr";
import YouTubeClient from "@sushibtw/youtubei";
import Spotify from "spotify-url-info";
import Deezer from "deezer-public-api";



const youtube = new YouTubeClient.Client();
const deezer = new Deezer();

// RegExp Definitions
const REGEX_LIST = {
	YOUTUBE_VIDEO: /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))((?!channel)(?!user)\/(?:[\w\-]+\?v=|embed\/|v\/)?)((?!channel)(?!user)[\w\-]+)(\S+)?$/,
	YOUTUBE_VIDEO_ID: /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/,
	YOUTUBE_PLAYLIST: /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#&?]*).*/,
	YOUTUBE_PLAYLIST_ID: /[&?]list=([^&]+)/,
	SPOTIFY_SONG: /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:track\/|\?uri=spotify:track:)((\w|-){22})(?:(?=\?)(?:[?&]foo=(\d*)(?=[&#]|$)|(?![?&]foo=)[^#])+)?(?=#|$)/,
	SPOTIFY_PLAYLIST: /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:(album|playlist)\/|\?uri=spotify:playlist:)((\w|-){22})(?:(?=\?)(?:[?&]foo=(\d*)(?=[&#]|$)|(?![?&]foo=)[^#])+)?(?=#|$)/,
	DEEZER_SONG: /https?:\/\/(?:www\.)?deezer\.com\/(?:\w{2}\/)?track\/(\d+)/,
	DEEZER_PLAYLIST: /https?:\/\/(?:www\.)?deezer\.com\/(?:\w{2}\/)?(?:playlist|album)\/(\d+)/

}

// Helper Functions
function parseYouTubeVideo(url: string): string {
	const match = url.match(REGEX_LIST.YOUTUBE_VIDEO_ID);
	return (match && match[7].length === 11) ? match[7] : null;
}

function parseYouTubePlaylist(url: string): string {
	const match = url.match(REGEX_LIST.YOUTUBE_PLAYLIST_ID);
	return (match && match[1].length === 34) ? match[1] : null;
}

function videoDurationResolver(duration: number) {
	let date = new Date(null);
	date.setSeconds(duration);
	let durationString = date.toISOString().substring(11, 19);
	return durationString.replace(/^0(?:0:0?)?/, "");
}

export default class MusicUtil {
	static PlayOptions: PlayOptions = {
		uploadDate: null,
		duration: null,
		sortBy: "relevance",
		index: null,
		localAddress: null
	}

	static PlaylistOptions: PlaylistOptions = {
		maxSongs: -1,
		shuffle: false,
		localAddress: null
	}

	static async search(search: string, queue: Queue, requestedBy: User, limit: number = 1, searchOptions: Partial<PlayOptions> = {}) {
		searchOptions = Object.assign({}, this.PlayOptions, searchOptions);
		// Default Options - Type: Video
		const filtersTypes = await ystr.getFilters(search);
		let filters = filtersTypes.get("Type").get("Video");

		// Custom Options - Upload date: null
		if (searchOptions.uploadDate)
			filters = Array.from(
				(await ystr.getFilters(filters.url)).get("Upload date"),
				([ name, value ]) => ({ name, url: value.url, description: value.description, active: value.active })
			)
				.find(o => o.name.toLowerCase().includes(searchOptions.uploadDate))
			?? filters;

		// Custom Options - Duration: null
		if (searchOptions.duration)
			filters = Array.from(
				(await ystr.getFilters(filters.url)).get("Duration"),
				([name, value]) => ({ name, url: value.url, description: value.description, active: value.active })
			)
				.find(o => o.name.toLowerCase().startsWith(searchOptions.duration))
			?? filters;

		// Custom Options - Sort by: relevance
		if (searchOptions.sortBy)
			filters = Array.from(
				(await ystr.getFilters(filters.url)).get("Sort By"),
				([name, value]) => ({ name, url: value.url, description: value.description, active: value.active })
			)
				.find(o => o.name.toLowerCase().startsWith(searchOptions.sortBy))
			?? filters;

		try {
			const result = await ystr(
				filters.url,
				{ limit }
			);

			const { items } = result;

			const songs = items.map(item => {
				if (item.type !== "video") return;

				const data: SongData = {
					title: item.title,
					duration: this.timeToMilliseconds(item.duration),
					channel: {
						name: item.author.name,
					},
					url: item.url,
					thumbnail: item.bestThumbnail.url,
					isLive: item.isLive
				};
				
				return new Song(data, queue, requestedBy);
			}).filter(s => s && !s.isLive);

			return songs;
		
		} catch (error) {
			throw "SearchIsNull";
		}
	}

	static async link(search: string, queue: Queue, requestedBy: User, localAddress?: string) {
		const isSpotifyLink = REGEX_LIST.SPOTIFY_SONG.test(search);
		const isDeezerLink = REGEX_LIST.DEEZER_SONG.test(search);
		const isYouTubeLink = REGEX_LIST.YOUTUBE_VIDEO.test(search);

		if (isSpotifyLink) {
			try {
				const spotifyResult = await Spotify.getPreview(search);
				const searchResult = await this.search(
					`${spotifyResult.artist} - ${spotifyResult.title}`,
					queue,
					requestedBy
				);
				
				return searchResult[0];
			
			} catch(error) {
				throw "InvalidSpotify";
			}
		}
		
		if (isDeezerLink) {
			try {
				const [ , trackId ] = search.match(REGEX_LIST.DEEZER_SONG);
				const deezerResult = await deezer.track(trackId);
				const searchResult = await this.search(
					`${deezerResult.artist.name} - ${deezerResult.title}`,
					queue,
					requestedBy
				);

				return searchResult[0];
			
			} catch(error) {
				throw "InvalidDeezer";
			}
		}
		
		if (isYouTubeLink) {
			const videoId = parseYouTubeVideo(search);
			if (!videoId) throw "InvalidYoutube";

			youtube.options.localAddress = localAddress;
			const videoResult = await youtube.getVideo(videoId) as YouTubeClient.Video;
			if (videoResult.isLiveContent) throw "InvalidYoutube";

			const songData: SongData = {
				title: videoResult.title,
				duration: videoResult.duration * 1000,
				channel: {
					name: videoResult.channel.name,
				},
				url: search,
				thumbnail: videoResult.thumbnails.best,
				isLive: false
			};
			
			return new Song(songData, queue, requestedBy);
		}
	}

	static async best(search: string, queue: Queue, requestedBy: User, limit: number = 1, searchOptions: Partial<PlayOptions> = {}) {
		const song: Song = await this.link(search, queue, requestedBy, searchOptions.localAddress)
			?? await this.search(search, queue, requestedBy, limit, searchOptions)[0];
		
		return song;
	}

	static async playlist(search: string, queue: Queue, requestedBy: User, limit: number = -1, shuffle: boolean = false, localAddress?: string) {
		const isSpotifyPlaylistLink = REGEX_LIST.SPOTIFY_PLAYLIST.test(search);
		const isDeezerPlaylistLink = REGEX_LIST.DEEZER_PLAYLIST.test(search);
		const isYouTubePlaylistLink = REGEX_LIST.YOUTUBE_PLAYLIST.test(search);

		if (isSpotifyPlaylistLink) {
			const spotifyResult = await Spotify.getData(search).catch(() => null);
			if (!spotifyResult || !["playlist", "album"].includes(spotifyResult.type)) throw "InvalidPlaylist";

			const playlistData: PlaylistData = {
				title: spotifyResult.name,
				channel: spotifyResult.type === "playlist" ? { name: spotifyResult.owner.display_name } : spotifyResult.artists[0],
				url: search,
				videos: spotifyResult.tracks?.items ?? []
			};

			playlistData.videos = (await Promise.all(
				playlistData.videos.map(async (track: any, index) => {
					if (limit !== -1 && index >= limit) return;
					if (spotifyResult.type === "playlist") track = track.track;
					
					const result = await this.search(
						`${track.artists[0].name} - ${track.name}`,
						queue,
						requestedBy
					).catch(() => null);
					
					return result ? result[0] : null;
				})
			))
				.filter((v: any) => v);
			
			if (shuffle) playlistData.videos = this.shuffle(playlistData.videos);

			return new Playlist(playlistData, queue, requestedBy);
		}
		
		if (isDeezerPlaylistLink) {
			const [ , playlistId ] = search.match(REGEX_LIST.DEEZER_PLAYLIST);
			const deezerResult = await deezer.playlist(playlistId).catch(() => null);
			if(!deezerResult || !["playlist", "album"].includes(deezerResult.type)) throw "InvalidPlaylist";

			const playlistData: PlaylistData = {
				title: deezerResult.name,
				channel: deezerResult.type === "playlist" ? { name: deezerResult.owner.display_name } : deezerResult.artists[0],
				url: search,
				videos: deezerResult.tracks?.items ?? []
			};

			playlistData.videos = (await Promise.all(
				playlistData.videos.map(async (track: any, index) => {
					if (limit !== -1 && index >= limit) return;
					if (deezerResult.type === "playlist") track = track.track;

					let result = await this.search(
						`${track['artists'][0].name} - ${track['name']}`,
						queue,
						requestedBy
					).catch(() => null);
					
					return result ? result[0] : null;
				})
			))
				.filter(v => v);
			
			if (shuffle) playlistData.videos = this.shuffle(playlistData.videos);
			
			return new Playlist(playlistData, queue, requestedBy);
		}
		
		if (isYouTubePlaylistLink) {
			let playlistId = parseYouTubePlaylist(search);
			if (!playlistId) throw "InvalidPlaylist";

			youtube.options.localAddress = localAddress;
			const youtubeResult = await youtube.getPlaylist(playlistId);
			if (!youtubeResult || Object.keys(youtubeResult).length === 0) throw "InvalidPlaylist";

			const playlistData: PlaylistData = {
				title: youtubeResult.title,
				channel: { name: youtubeResult.channel.name },
				url: search,
				videos: []
			};
			
			playlistData.videos = youtubeResult.videos.map((video, index) => {
				if (limit !== -1 && index >= limit) return;
				const songData: SongData = {
					title: video.title,
					duration: video.duration,
					channel: { name: video.channel.name },
					thumbnail: video.thumbnails.best,
					url: `https://youtube.com/watch?v=${video.id}`,
					isLive: video.isLive
				};

				return new Song(songData, queue, requestedBy);
			})
				.filter(V => V);
			
			if (shuffle) playlistData.videos = this.shuffle(playlistData.videos);
			
			return new Playlist(playlistData, queue, requestedBy);
		}

		throw "InvalidPlaylist";
	}

	static millisecondsToTime(ms: number) {
		const seconds = Math.floor(ms / 1000 % 60);
		const minutes = Math.floor(ms / 60000 % 60);
		const hours = Math.floor(ms / 3600000);

		const secondsT = `${seconds}`.padStart(2,'0');
		const minutesT = `${minutes}`.padStart(2,'0');
		const hoursT = `${hours}`.padStart(2,'0');

		return `${hours ? `${hoursT}:` : ''}${minutesT}:${secondsT}`;
	}

	static timeToMilliseconds(time: string) {
		const items = time.split(':');
		return items.reduceRight(
			(prev,curr,i,arr) => prev + parseInt(curr) * 60**(arr.length-1-i),
			0
		) * 1000;
	}

	static buildBar(value: number, maxValue: number) {
		const percentage = value / maxValue > 1 ? 0 : value / maxValue;
		const progress = Math.round(20 * percentage);
		const emptyProgress = Math.round(20 * (1 - percentage));
	
		const progressText = "━".repeat(progress) + "🔘";
		const emptyProgressText = "━".repeat(emptyProgress);
	
		return `[${progressText}](https://mayze.xyz)${emptyProgressText}\n${this.millisecondsToTime(value)}/${this.millisecondsToTime(maxValue)}`;
	}

	static deserializeOptionsPlay(options: Partial<PlayOptions> | string): Partial<PlayOptions> {
		if (options && typeof options === "object")
			return Object.assign({}, this.PlayOptions, options);
		else if (typeof options === "string")
			return Object.assign({}, this.PlayOptions, { search: options });
		else return this.PlayOptions;
	}

	static deserializeOptionsPlaylist(options: Partial<PlaylistOptions> | string): Partial<PlaylistOptions> {
		if(options && typeof options === "object")
			return Object.assign({}, this.PlaylistOptions, options);
		else if(typeof options === "string")
			return Object.assign({}, this.PlaylistOptions, { search: options });
		else return this.PlaylistOptions;
	}

	static shuffle(array: Array<any>): Array<any> {
		if (!Array.isArray(array)) return [];
		
		const clone = [ ...array ];
		const shuffled = [];
		
		while (clone.length > 0)
			shuffled.push(
				clone.splice(
					Math.floor(
						Math.random() * clone.length
					), 1
				)[0]
			);
		
		return shuffled;
	}

}

export interface PlayOptions {
	uploadDate: null;
	duration: null;
	sortBy: "relevance";
	index: null;
	localAddress: null;
}

export interface PlaylistOptions {
	maxSongs: number;
	shuffle: boolean;
	localAddress: null;
}