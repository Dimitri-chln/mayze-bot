// Self Definitions
import Playlist, { PlaylistData } from "./Playlist";
import Song, { SongData } from "./Song";
import Queue from "./Queue";

// External Packages
import { User } from "discord.js";
import PlayDl, {
	Deezer,
	DeezerAlbum,
	DeezerPlaylist,
	DeezerTrack,
	SoundCloud,
	SoundCloudPlaylist,
	SoundCloudTrack,
	Spotify,
	SpotifyAlbum,
	SpotifyPlaylist,
	SpotifyTrack,
} from "play-dl";
import Util from "../../Util";

function isSpotifyTrack(result: Spotify): result is SpotifyTrack {
	return result.type === "track";
}

function isSpotifyPlaylist(result: Spotify): result is SpotifyPlaylist {
	return result.type === "playlist";
}

function isSpotifyAlbum(result: Spotify): result is SpotifyAlbum {
	return result.type === "album";
}

function isDeezerTrack(result: Deezer): result is DeezerTrack {
	return result.type === "track";
}

function isDeezerPlaylist(result: Deezer): result is DeezerPlaylist {
	return result.type === "playlist";
}

function isDeezerAlbum(result: Deezer): result is DeezerAlbum {
	return result.type === "album";
}

function isSoundCloudTrack(result: SoundCloud): result is SoundCloudTrack {
	return result.type === "track";
}

function isSoundCloudPlaylist(result: SoundCloud): result is SoundCloudPlaylist {
	return result.type === "playlist";
}

export default class MusicUtil {
	static async search(search: string, queue: Queue, requestedBy: User): Promise<Song> {
		switch (await PlayDl.validate(search)) {
			case "yt_video": {
				const youtubeResult = (await PlayDl.video_info(search)).video_details;
				if (!youtubeResult || youtubeResult.type !== "video") throw "InvalidYoutube";

				const songData: SongData = {
					title: youtubeResult.title,
					duration: youtubeResult.live ? Infinity : youtubeResult.durationInSec * 1000,
					channel: {
						name: youtubeResult.channel.name,
					},
					url: youtubeResult.url,
					thumbnail: youtubeResult.thumbnails[0].url,
					live: youtubeResult.live,
				};

				return new Song(songData, queue, requestedBy);
			}

			case "sp_track": {
				const spotifyResult = await PlayDl.spotify(search);
				if (!spotifyResult || !isSpotifyTrack(spotifyResult)) throw "InvalidSpotify";

				return this.search(`${spotifyResult.artists[0].name} - ${spotifyResult.name}`, queue, requestedBy);
			}

			case "dz_track": {
				const deezerResult = await PlayDl.deezer(search);
				if (!deezerResult || !isDeezerTrack(deezerResult)) throw "InvalidDeezer";

				return this.search(`${deezerResult.artist.name} - ${deezerResult.title}`, queue, requestedBy);
			}

			case "so_track": {
				const soundcloudResult = await PlayDl.soundcloud(search);
				if (!soundcloudResult || !isSoundCloudTrack(soundcloudResult)) throw "InvalidSoundCloud";

				const songData: SongData = {
					title: soundcloudResult.name,
					duration: soundcloudResult.durationInMs,
					channel: {
						name: soundcloudResult.user.name,
					},
					url: soundcloudResult.url,
					thumbnail: soundcloudResult.thumbnail,
					live: false,
				};

				return new Song(songData, queue, requestedBy);
			}

			case "search": {
				try {
					const searched = await PlayDl.search(search, {
						source: { youtube: "video" },
						limit: 1,
					});

					const songData: SongData = {
						title: searched[0].title,
						duration: searched[0].durationInSec * 1000,
						channel: {
							name: searched[0].channel.name,
						},
						url: searched[0].url,
						thumbnail: searched[0].thumbnails[0].url,
						live: searched[0].live,
					};

					return new Song(songData, queue, requestedBy);
				} catch (error) {
					throw "SearchIsNull";
				}
			}

			default:
				throw "InvalidSong";
		}
	}

	static async playlist(
		url: string,
		queue: Queue,
		requestedBy: User,
		limit: number = Infinity,
		shuffle: boolean = false,
	) {
		switch (await PlayDl.validate(url)) {
			case "yt_playlist": {
				const youtubeResult = await PlayDl.playlist_info(url, {
					incomplete: true,
				});
				if (!youtubeResult) throw "InvalidPlaylist";

				const playlistData: PlaylistData = {
					title: youtubeResult.title,
					channel: {
						name: youtubeResult.channel.name,
					},
					url,
					videos: (await youtubeResult.all_videos())
						.filter((video) => !video.live)
						.map((video, index) => {
							if (index >= limit) return;

							const songData: SongData = {
								title: video.title,
								duration: video.durationInSec * 1000,
								channel: {
									name: video.channel.name,
								},
								thumbnail: video.thumbnails[0].url,
								url: video.url,
								live: video.live,
							};

							return new Song(songData, queue, requestedBy);
						})
						.filter((v) => v),
				};

				if (shuffle) playlistData.videos = this.shuffle(playlistData.videos);

				return new Playlist(playlistData, queue, requestedBy);
			}

			case "sp_playlist":
			case "sp_album": {
				const spotifyResult = await PlayDl.spotify(url);
				if (!spotifyResult || (!isSpotifyPlaylist(spotifyResult) && !isSpotifyAlbum(spotifyResult)))
					throw "InvalidPlaylist";

				const playlistData: PlaylistData = {
					title: spotifyResult.name,
					channel: {
						name: isSpotifyPlaylist(spotifyResult) ? spotifyResult.owner.name : spotifyResult.artists[0].name,
					},
					url,
					videos: (
						await Promise.all(
							(
								await spotifyResult.all_tracks()
							).map(async (track, index) => {
								if (limit !== -1 && index >= limit) return;

								try {
									const result = await this.search(`${track.artists[0].name} - ${track.name}`, queue, requestedBy);

									return result;
								} catch (err) {
									return;
								}
							}),
						)
					).filter((v) => v),
				};

				if (shuffle) playlistData.videos = this.shuffle(playlistData.videos);

				return new Playlist(playlistData, queue, requestedBy);
			}

			case "dz_playlist":
			case "dz_album": {
				const deezerResult = await PlayDl.deezer(url);
				if (!deezerResult || (!isDeezerPlaylist(deezerResult) && !isDeezerAlbum(deezerResult))) throw "InvalidPlaylist";

				const playlistData: PlaylistData = {
					title: deezerResult.title,
					channel: {
						name: isDeezerPlaylist(deezerResult) ? deezerResult.creator.name : deezerResult.artist.name,
					},
					url,
					videos: (
						await Promise.all(
							(
								await deezerResult.all_tracks()
							).map(async (track, index) => {
								if (limit !== -1 && index >= limit) return;

								try {
									const result = await this.search(`${track.artist.name} - ${track.title}`, queue, requestedBy);

									return result;
								} catch (err) {
									return;
								}
							}),
						)
					).filter((v) => v),
				};

				if (shuffle) playlistData.videos = this.shuffle(playlistData.videos);

				return new Playlist(playlistData, queue, requestedBy);
			}

			case "so_playlist": {
				const soundcloudResult = await PlayDl.soundcloud(url);
				if (!soundcloudResult || !isSoundCloudPlaylist(soundcloudResult)) throw "InvalidPlaylist";

				const playlistData: PlaylistData = {
					title: soundcloudResult.name,
					channel: {
						name: soundcloudResult.user.name,
					},
					url,
					videos: (
						await Promise.all(
							(
								await soundcloudResult.all_tracks()
							).map(async (track, index) => {
								if (limit !== -1 && index >= limit) return;

								try {
									const result = await this.search(track.url, queue, requestedBy);

									return result;
								} catch (err) {
									return;
								}
							}),
						)
					).filter((v) => v),
				};

				if (shuffle) playlistData.videos = this.shuffle(playlistData.videos);

				return new Playlist(playlistData, queue, requestedBy);
			}

			default:
				throw "InvalidPlaylist";
		}
	}

	static async relatedSongs(songs: Song[], number: number = 1, queue: Queue) {
		const relatedSongs: Song[] = [];

		const breakIntoParts = (num: number, parts: number) =>
			[...Array(parts)].map((_, i) => 0 | (num / parts + Number(i < num % parts)));

		const numberOfRelatedVideos = breakIntoParts(number, songs.length);

		for (let i = 0; i < songs.length; i++) {
			const videoInfo = await PlayDl.video_info(songs[i].url);

			const newSongs = (
				await Promise.all(
					videoInfo.related_videos
						.slice(0, numberOfRelatedVideos[i])
						.map(async (relatedVideo) => (await PlayDl.video_info(relatedVideo)).video_details),
				)
			).map(
				(relatedVideo) =>
					new Song(
						{
							title: relatedVideo.title,
							duration: relatedVideo.durationInSec * 1000,
							channel: {
								name: relatedVideo.channel.name,
							},
							thumbnail: relatedVideo.thumbnails[0].url,
							url: relatedVideo.url,
							live: relatedVideo.live,
						},
						queue,
						Util.client.user,
					),
			);

			relatedSongs.push(...newSongs);
		}

		return relatedSongs;
	}

	static millisecondsToTime(ms: number) {
		if (ms === Infinity) return "♾️";

		const seconds = Math.floor((ms / 1_000) % 60);
		const minutes = Math.floor((ms / 60_000) % 60);
		const hours = Math.floor(ms / 3_600_000);

		const secondsT = `${seconds}`.padStart(2, "0");
		const minutesT = `${minutes}`.padStart(2, "0");
		const hoursT = `${hours}`.padStart(2, "0");

		return `${hours ? `${hoursT}:` : ""}${minutesT}:${secondsT}`;
	}

	static timeToMilliseconds(time: string) {
		const items = time.split(":");
		if (items.length > 3) throw "InvalidTime";

		return items.reduceRight((prev, curr, i, arr) => prev + parseInt(curr) * 60 ** (arr.length - 1 - i), 0) * 1000;
	}

	static buildBar(value: number, maxValue: number) {
		const percentage = Math.min(value / maxValue, 1);
		const progress = Math.round(20 * percentage);
		const emptyProgress = Math.round(20 * (1 - percentage));

		const progressText = "━".repeat(progress) + "🔘";
		const emptyProgressText = "━".repeat(emptyProgress);

		return `[${progressText}](https://mayze.xyz)${emptyProgressText}\n${this.millisecondsToTime(
			value,
		)}/${this.millisecondsToTime(maxValue)}`;
	}

	static shuffle(array: Array<any>): Array<any> {
		if (!Array.isArray(array)) return [];

		const clone = [...array];
		const shuffled = [];

		while (clone.length > 0) shuffled.push(clone.splice(Math.floor(Math.random() * clone.length), 1)[0]);

		return shuffled;
	}
}

export interface PlaylistOptions {
	maxSongs: number;
	shuffle: boolean;
}
