import Util from "../../Util";

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
	Spotify,
	SpotifyAlbum,
	SpotifyPlaylist,
	SpotifyTrack,
} from "play-dl";

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

export default class MusicUtil {
	static async search(
		search: string,
		queue: Queue,
		requestedBy: User,
	): Promise<Song> {
		switch (await PlayDl.validate(search)) {
			case "yt_video": {
				const youtubeResult = (await PlayDl.video_info(search)).video_details;
				if (!youtubeResult || youtubeResult.type !== "video")
					throw "InvalidYoutube";

				const songData: SongData = {
					title: youtubeResult.title,
					duration: youtubeResult.durationInSec * 1000,
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
				if (!spotifyResult || !isSpotifyTrack(spotifyResult))
					throw "InvalidSpotify";

				const searchResult = await this.search(
					`${spotifyResult.artists[0].name} - ${spotifyResult.name}`,
					queue,
					requestedBy,
				);

				return searchResult;
			}

			case "dz_track": {
				const deezerResult = await PlayDl.deezer(search);
				if (!deezerResult || !isDeezerTrack(deezerResult))
					throw "InvalidDeezer";

				const searchResult = await this.search(
					`${deezerResult.artist.name} - ${deezerResult.title}`,
					queue,
					requestedBy,
				);

				return searchResult;
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
				if (
					!spotifyResult ||
					(!isSpotifyPlaylist(spotifyResult) && !isSpotifyAlbum(spotifyResult))
				)
					throw "InvalidPlaylist";

				const playlistData: PlaylistData = {
					title: spotifyResult.name,
					channel: {
						name: isSpotifyPlaylist(spotifyResult)
							? spotifyResult.owner.name
							: spotifyResult.artists[0].name,
					},
					url,
					videos: (
						await Promise.all(
							(
								await spotifyResult.all_tracks()
							).map(async (track, index) => {
								if (limit !== -1 && index >= limit) return;

								try {
									const result = await this.search(
										`${track.artists[0].name} - ${track.name}`,
										queue,
										requestedBy,
									);

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
				if (
					!deezerResult ||
					(!isDeezerPlaylist(deezerResult) && !isDeezerAlbum(deezerResult))
				)
					throw "InvalidPlaylist";

				const playlistData: PlaylistData = {
					title: deezerResult.title,
					channel: {
						name: isDeezerPlaylist(deezerResult)
							? deezerResult.creator.name
							: deezerResult.artist.name,
					},
					url,
					videos: (
						await Promise.all(
							(
								await deezerResult.all_tracks()
							).map(async (track, index) => {
								if (limit !== -1 && index >= limit) return;

								try {
									const result = await this.search(
										`${track.artist.name} - ${track.title}`,
										queue,
										requestedBy,
									);

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

	static millisecondsToTime(ms: number) {
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

		return (
			items.reduceRight(
				(prev, curr, i, arr) =>
					prev + parseInt(curr) * 60 ** (arr.length - 1 - i),
				0,
			) * 1000
		);
	}

	static buildBar(value: number, maxValue: number) {
		const percentage = value / maxValue > 1 ? 0 : value / maxValue;
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

		while (clone.length > 0)
			shuffled.push(
				clone.splice(Math.floor(Math.random() * clone.length), 1)[0],
			);

		return shuffled;
	}
}

export interface PlaylistOptions {
	maxSongs: number;
	shuffle: boolean;
}
