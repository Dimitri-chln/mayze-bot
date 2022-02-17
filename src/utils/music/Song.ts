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
	readonly live: boolean;
	seek: number;

	constructor(songData: SongData, queue: Queue, requestedBy: User) {
		this.name = songData.title;
		this.duration = songData.duration;
		this.author = songData.channel.name;
		this.url = songData.url;
		this.thumbnail = songData.thumbnail;
		this.queue = queue;
		this.requestedBy = requestedBy;
		this.live = songData.live;
		this.seek = null;
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
	live: boolean;
}
