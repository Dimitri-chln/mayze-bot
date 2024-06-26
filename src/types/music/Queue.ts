import {
	getVoiceConnection,
	AudioPlayer,
	createAudioPlayer,
	AudioPlayerStatus,
	joinVoiceChannel,
	createAudioResource,
	DiscordGatewayAdapterCreator,
	VoiceConnectionStatus,
	entersState,
	NoSubscriberBehavior,
} from "@discordjs/voice";
import { Collection, GuildMember, Message, Snowflake, TextChannel, VoiceChannel } from "discord.js";
import Song from "./Song";
import Util from "../../Util";
import { PlaylistOptions } from "./MusicUtil";
import PlayDl from "play-dl";
import { LanguageTranslationsData } from "../structures/Translations";

export default class Queue {
	voiceChannel: VoiceChannel;
	readonly textChannel: TextChannel;
	readonly translations: LanguageTranslationsData;
	readonly audioPlayer: AudioPlayer;
	songs: Song[];
	private _running: boolean;
	private _seek: number;
	private _stopped: boolean;
	repeatSong: boolean;
	repeatQueue: boolean;
	idleTimeout?: NodeJS.Timeout;
	emptyTimeout?: NodeJS.Timeout;
	private _volume: number;
	readonly idleTime: number;
	private readonly _songDisplays: Collection<Snowflake, Message>;
	private readonly _songDisplaysTimeout: NodeJS.Timer;

	constructor(voiceChannel: VoiceChannel, textChannel: TextChannel, translations: LanguageTranslationsData) {
		this.voiceChannel = voiceChannel;
		this.textChannel = textChannel;
		this.translations = translations;
		this.audioPlayer = createAudioPlayer({
			behaviors: {
				noSubscriber: NoSubscriberBehavior.Pause,
			},
		});
		this.songs = [];
		this._running = false;
		this._seek = null;
		this._stopped = false;
		this.repeatSong = false;
		this.repeatQueue = false;
		this._volume = 0.5;
		this.idleTime = 900_000;
		this._songDisplays = new Collection();
		this._songDisplaysTimeout = setInterval(() => this._editSongDisplays(), 10_000);

		joinVoiceChannel({
			guildId: voiceChannel.guild.id,
			channelId: voiceChannel.id,
			adapterCreator: voiceChannel.guild.voiceAdapterCreator,
			selfDeaf: true,
		});

		this.voiceConnection.subscribe(this.audioPlayer);

		this.voiceConnection.on("stateChange", async (oldState, newState) => {
			switch (newState.status) {
				case VoiceConnectionStatus.Signalling: {
					break;
				}

				case VoiceConnectionStatus.Connecting: {
					break;
				}

				case VoiceConnectionStatus.Ready: {
					break;
				}

				case VoiceConnectionStatus.Disconnected: {
					try {
						await Promise.race([entersState(this.voiceConnection, VoiceConnectionStatus.Connecting, 5_000)]);
						// Seems to be reconnecting to a new channel - ignore disconnect
						this.voiceConnection.subscribe(this.audioPlayer);
						this.voiceChannel = this.voiceChannel.client.channels.cache.get(
							this.voiceConnection.joinConfig.channelId,
						) as VoiceChannel;
					} catch (err) {
						// Seems to be a real disconnect which SHOULDN'T be recovered from
						this.stop();
					}
					break;
				}

				case VoiceConnectionStatus.Destroyed: {
					this.stop();
					break;
				}
			}
		});

		this.audioPlayer.on("stateChange", (oldState, newState) => {
			switch (newState.status) {
				case AudioPlayerStatus.Playing: {
					this._editSongDisplays();
					break;
				}

				case AudioPlayerStatus.Idle: {
					this._playSong();
					break;
				}

				case AudioPlayerStatus.Buffering: {
					break;
				}

				case AudioPlayerStatus.Paused: {
					break;
				}

				case AudioPlayerStatus.AutoPaused: {
					break;
				}
			}
		});

		this.audioPlayer.on("error", (err) => {
			console.error(err);
			this.repeatSong = false;

			this.textChannel.send(this.translations.strings.stream_error(this.nowPlaying.name, err.name, err.message));

			this._playSong();
		});
	}

	get voiceConnection() {
		return getVoiceConnection(this.voiceChannel.guild.id);
	}

	get nowPlaying() {
		return this.songs[0];
	}

	get volume() {
		return this.audioPlayer.state.status === AudioPlayerStatus.Playing ? this._volume * 100 : null;
	}

	get duration() {
		return this.audioPlayer
			? this.repeatSong || this.repeatQueue
				? Infinity
				: this.songs.reduce((sum, song) => sum + song.duration, 0) -
				  (this.audioPlayer.state.status === AudioPlayerStatus.Playing
						? this.audioPlayer.state.resource.playbackDuration
						: 0) -
				  this.nowPlaying?.seek
			: 0;
	}

	async play(search: string, member: GuildMember) {
		const song = await Util.music.search(search, this, member.user);
		this.songs.push(song);

		if (!this._running) {
			await this._playSong();
			this._running = true;
		}

		return song;
	}

	async playlist(search: string, member: GuildMember, options?: Partial<PlaylistOptions>) {
		// Search the playlist
		const playlist = await Util.music.playlist(search, this, member.user, options?.maxSongs, options?.shuffle);
		this.songs.push(...playlist.videos);

		if (!this._running) {
			await this._playSong();
			this._running = true;
		}

		return playlist;
	}

	pause() {
		return this.audioPlayer.pause(true);
	}

	resume() {
		return this.audioPlayer.unpause();
	}

	async stop() {
		this._stopped = true;
		await this._editSongDisplays({ song: this.nowPlaying, end: true });
		this._delete();
	}

	setVolume(percentage: number) {
		this._volume = Math.max(percentage / 100, 0);

		if (this.audioPlayer.state.status === AudioPlayerStatus.Playing)
			this.audioPlayer.state.resource.volume.setVolumeLogarithmic(this._volume);
	}

	seek(seconds: number) {
		const currentSong = this.nowPlaying;
		if (currentSong.live) throw new Error("Can't use seek on live videos");

		this._seek = seconds;
		this.audioPlayer.stop();
		return currentSong;
	}

	clear() {
		this.songs.splice(1);
	}

	skip() {
		const currentSong = this.nowPlaying;
		this.repeatSong = false;
		this.audioPlayer.stop();
		return currentSong;
	}

	skipTo(songIndex: number) {
		const song = this.songs[songIndex];
		this.repeatSong = false;
		this.songs.splice(1, songIndex - 1);
		this.audioPlayer.stop();
		return song;
	}

	toggleRepeatSong() {
		this.repeatSong = !this.repeatSong;
		if (this.repeatSong) this.repeatQueue = false;
		return this.repeatSong;
	}

	toggleRepeatQueue() {
		this.repeatQueue = !this.repeatQueue;
		if (this.repeatQueue) this.repeatSong = false;
		return this.repeatQueue;
	}

	async fillQueue(number: number) {
		const relatedSongs = await Util.music.relatedSongs(this.songs, Math.max(number - this.songs.length, 0), this);

		this.songs.push(...relatedSongs);
		return relatedSongs;
	}

	move(songIndex: number, after: number) {
		const movedSong = this.songs[songIndex];
		this.songs.splice(songIndex > after ? after + 1 : after, 0, this.songs.splice(songIndex, 1)[0]);
		return movedSong;
	}

	remove(songIndexes: number[]) {
		const removedSongs: Song[] = [];
		const songs = [...this.songs];

		for (const songIndex of songIndexes) {
			const song = songs[songIndex];
			if (song) removedSongs.push(song);
			songs[songIndex] = null;
		}

		this.songs = songs.filter((s) => s);
		return removedSongs;
	}

	shuffle() {
		const currentSong = this.nowPlaying;
		this.songs = [currentSong, ...Util.music.shuffle(this.songs.slice(1))];
		return this.songs;
	}

	cleanDuplicates() {
		const removedSongs: Song[] = [];
		const songs = [...this.songs];

		songs.forEach((song, i) => {
			if (songs.findIndex((s) => s.url === song.url) !== i) {
				removedSongs.push(song);
				songs[i] = null;
			}
		});

		this.songs = songs.filter((s) => s);
		return removedSongs;
	}

	createProgressBar() {
		const timePassed =
			this.audioPlayer.state.status === AudioPlayerStatus.Playing ||
			this.audioPlayer.state.status === AudioPlayerStatus.Paused ||
			this.audioPlayer.state.status === AudioPlayerStatus.Buffering
				? this.audioPlayer.state.resource.playbackDuration + (this.nowPlaying.seek ?? 0) * 1000
				: 0;
		const timeEnd = this.nowPlaying.duration;

		return Util.music.buildBar(timePassed, timeEnd);
	}

	createSongDisplay(message: Message) {
		this._songDisplays.set(message.channel.id, message);
		this._editSongDisplays();
	}

	private async _editSongDisplays(options: { song?: Song; end?: boolean } = {}) {
		const song = options.song ?? this.nowPlaying;
		if (!song) return;

		await Promise.all(
			this._songDisplays.map(async (message) => {
				await message
					.edit({
						content: null,
						embeds: [
							{
								author: {
									name: this.translations.strings.author(),
									iconURL: this.voiceChannel.guild.iconURL({ dynamic: true }),
								},
								thumbnail: {
									url: song.thumbnail,
								},
								color: this.voiceChannel.guild.me.displayColor,
								description: this.translations.strings.description(
									song.name,
									song.url,
									options.end ? Util.music.buildBar(song.duration, song.duration) : this.createProgressBar(),
									song.requestedBy.tag,
									this.repeatSong ? song.name : this.songs[1] ? this.songs[1].name : this.repeatQueue ? song.name : "Ø",
									options.end ? Util.music.millisecondsToTime(0) : Util.music.millisecondsToTime(this.duration),
								),
								footer: {
									text:
										"✨ Mayze ✨" +
										(options.end
											? this.translations.strings.footer_end()
											: this.translations.strings.footer(this.repeatSong, this.repeatQueue)),
								},
							},
						],
					})
					.catch((err) => {
						// Unknown message
						if (err.code === 10008) this._songDisplays.delete(message.channel.id);
						else console.error(err);
					});
			}),
		);
	}

	private _delete() {
		if (this.emptyTimeout) clearTimeout(this.emptyTimeout);
		if (this.voiceConnection) this.voiceConnection.destroy();
		if (this._songDisplaysTimeout) clearInterval(this._songDisplaysTimeout);
		if (this.audioPlayer) this.audioPlayer.stop();
		Util.musicPlayer.delete(this.voiceChannel.guild.id);
	}

	private async _playSong(): Promise<void> {
		if (this._stopped) return;

		// Clear the previous idle timeout
		if (this.idleTimeout) {
			clearTimeout(this.idleTimeout);
			delete this.idleTimeout;
		}

		let previousSong: Song;
		// Clear the previous song
		if (this._running && this._seek === null && !this.repeatSong) {
			previousSong = this.songs.shift();
			if (this.repeatQueue) this.songs.push(previousSong);
		}

		// If there isn't any song in the queue
		if (this.songs.length === 0) {
			this._running = false;
			await this._editSongDisplays({ song: previousSong, end: true });
			this.idleTimeout = setTimeout(() => this._delete(), this.idleTime);
			return;
		}

		this.nowPlaying.seek = this._seek;
		this._seek = null;

		try {
			// Stream the song
			const source = await PlayDl.stream(this.nowPlaying.url, {
				quality: 2,
				seek: this.nowPlaying.seek,
			});

			const resource = createAudioResource(source.stream, {
				inputType: source.type,
				inlineVolume: true,
			});

			resource.volume.setVolumeLogarithmic(this._volume);

			this.audioPlayer.play(resource);
		} catch (err) {
			console.error(err);
			this._running = true;
			this.repeatSong = false;

			this.textChannel.send(this.translations.strings.stream_error(this.nowPlaying.name, err.name, err.message));

			this._playSong();
		}
	}
}
