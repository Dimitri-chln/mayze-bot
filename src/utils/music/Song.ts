import { AudioResource } from "@discordjs/voice";
import { User } from "discord.js";
import Queue from "./Queue";

export default class Song {
	readonly name: string;
	readonly duration: number;
	readonly author: string;
	readonly url: string;
	readonly thumbnail: string;
	readonly queue: Queue;
	readonly requestedBy: User;
	readonly isLive: boolean;
	seekTime: number;

	constructor(songData: SongData, queue: Queue, requestedBy: User) {
		this.name = songData.title;
		this.duration = songData.duration;
		this.author = songData.channel.name;
		this.url = songData.url;
		this.thumbnail = songData.thumbnail;
		this.queue = queue;
		this.requestedBy = requestedBy;
		this.isLive = songData.isLive;
		this.seekTime = 0;
	}
}

export interface SongData {
	title: string;
	duration: number;
	channel: {
		name: string;
	};
	url: string;
	thumbnail: string;
	isLive: boolean;
}
