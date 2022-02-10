import {
	getVoiceConnection,
	AudioPlayer,
	AudioResource,
	createAudioPlayer,
	AudioPlayerStatus,
	joinVoiceChannel,
	createAudioResource,
	StreamType,
	DiscordGatewayAdapterCreator,
} from "@discordjs/voice";
import { GuildMember, TextChannel, VoiceChannel } from "discord.js";
import MusicUtil, { PlaylistOptions, PlayOptions } from "./MusicUtil";
import Song from "./Song";
import Util from "../../Util";
import ytdl from "ytdl-core";

export default class Queue {
	readonly voiceChannel: VoiceChannel;
	readonly textChannel: TextChannel;
	songs: Song[];
	readonly audioPlayer: AudioPlayer;
	resource?: AudioResource;
	stopped: boolean;
	skipped: boolean;
	repeatSong: boolean;
	repeatQueue: boolean;

	constructor(voiceChannel: VoiceChannel, textChannel: TextChannel) {
		this.voiceChannel = voiceChannel;
		this.textChannel = textChannel;
		this.songs = [];
		this.audioPlayer = createAudioPlayer();
		this.resource = null;
		this.stopped = false;
		this.skipped = false;
		this.repeatSong = false;
		this.repeatQueue = false;

		this.audioPlayer.on("stateChange", (oldState, newState) => {
			if (newState.status === AudioPlayerStatus.Idle) {
				this._playSong();
			}
		});
	}

	get voiceConnection() {
		return getVoiceConnection(this.voiceChannel.guild.id);
	}

	get nowPlaying() {
		return this.songs[0];
	}

	get volume() {
		return this.resource?.volume?.volumeDecibels;
	}

	get duration() {
		return this.audioPlayer
			? this.songs.reduce((sum, song) => sum + song.duration, 0) -
					this.resource?.playbackDuration -
					this.songs[0]?.seekTime
			: 0;
	}

	async play(
		search: string,
		member: GuildMember,
		options: Partial<PlayOptions>,
	) {
		// Search the song
		const song = await MusicUtil.best(search, this, member.user, 1, options);
		this.songs.push(song);

		const isAlreadyPlaying = Boolean(getVoiceConnection(member.guild.id));

		if (!isAlreadyPlaying) {
			const connection = joinVoiceChannel({
				guildId: this.voiceChannel.guild.id,
				channelId: member.voice.channel.id,
				adapterCreator: member.voice.guild
					.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
				selfDeaf: true,
			});

			connection.subscribe(this.audioPlayer);
		}

		// Play the song
		if (!isAlreadyPlaying) await this._playSong(true);

		return song;
	}

	async playlist(
		search: string,
		member: GuildMember,
		options: Partial<PlaylistOptions>,
	) {
		// Search the playlist
		const playlist = await MusicUtil.playlist(
			search,
			this,
			member.user,
			options.maxSongs,
			options.shuffle,
			options.localAddress,
		);
		this.songs.push(...playlist.videos);

		const isAlreadyPlaying = Boolean(getVoiceConnection(member.guild.id));

		if (!isAlreadyPlaying) {
			const connection = joinVoiceChannel({
				guildId: this.voiceChannel.guild.id,
				channelId: member.voice.channel.id,
				adapterCreator: member.guild
					.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
				selfDeaf: true,
			});

			connection.subscribe(this.audioPlayer);
		}

		// Play the first song
		if (!isAlreadyPlaying) await this._playSong(true);

		return playlist;
	}

	pause() {
		this.audioPlayer.pause();
	}

	resume() {
		this.audioPlayer.unpause();
	}

	stop() {
		this.audioPlayer.stop();
		this.voiceConnection.destroy();
		this.songs = [];
		this.stopped = true;
	}

	setVolume(decibels: number) {
		this.resource?.volume?.setVolumeDecibels(decibels);
	}

	async seek(seek: number) {
		this.songs[0].seekTime = seek;
		await this._playSong(true, seek);
		return this.songs[0];
	}

	clear() {
		this.songs.splice(1);
	}

	skip() {
		const currentSong = this.songs[0];
		this.skipped = true;
		this.audioPlayer.stop();
		return currentSong;
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

	move(oldIndex: number, newIndex: number) {
		const song = this.songs[oldIndex];

		this.songs.splice(newIndex, 0, this.songs.splice(oldIndex, 1)[0]);

		return song;
	}

	remove(index: number) {
		const song = this.songs[index];
		this.songs.splice(index, 1);
		return song;
	}

	shuffle() {
		const currentSong = this.songs.shift();
		this.songs = MusicUtil.shuffle(this.songs);
		this.songs.unshift(currentSong);
		return this.songs;
	}

	createProgressBar() {
		const timePassed = this.resource?.playbackDuration + this.songs[0].seekTime;
		const timeEnd = this.songs[0].duration;
		return MusicUtil.buildBar(timePassed, timeEnd);
	}

	private async _playSong(
		startPlay: boolean = false,
		seek: number = 0,
	): Promise<void> {
		// If there isn't any music in the queue
		if (
			this.stopped ||
			(this.songs.length <= 1 &&
				!startPlay &&
				!this.repeatSong &&
				!this.repeatQueue)
		) {
			// Stop playing
			Util.musicPlayer.queues.delete(this.voiceChannel.guild.id);

			if (this.stopped) {
				this.voiceConnection.destroy();
				this.audioPlayer.stop();
			} else {
				setTimeout(() => {
					if (this.songs.length <= 1 && !this.repeatSong && !this.repeatQueue) {
						this.voiceConnection.destroy();
						this.audioPlayer.stop();
					}
				}, 900_000);
			}
			return;
		}

		// Add to the end if repeatQueue is enabled
		if (this.repeatQueue && !this.repeatSong && !seek) {
			this.songs.push(this.songs[0]);
		}

		this.skipped = false;
		const song = this.songs[0];

		// Live Video is unsupported
		if (song.isLive) {
			this.repeatSong = false;
			return this._playSong();
		}

		// Download the song
		const stream = ytdl(song.url, {
			filter: "audioonly",
			quality: "highestaudio",
			begin: seek,
			dlChunkSize: 0,
			highWaterMark: 1 << 25,
		});

		stream
			.on("readable", () => {
				const resource = createAudioResource(stream, {
					inputType: StreamType.WebmOpus,
					inlineVolume: true,
				});

				this.resource = resource;
				this.audioPlayer.play(resource);
			})
			.on("error", (err) => {
				this.repeatSong = false;
				this._playSong();
			});
	}
}
