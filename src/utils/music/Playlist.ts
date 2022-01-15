import { User } from "discord.js";
import Queue from "./Queue";
import Song from "./Song";



export default class Playlist {
	readonly name: string;
	readonly author: string;
	readonly url: string;
	readonly videos: Song[];

	constructor(data: PlaylistData, queue: Queue, requestedBy: User) {
		this.name = data.title;
		this.author = data.channel.name;
		this.url = data.url;
		this.videos = data.videos;
	}
}

export interface PlaylistData {
	title: string;
	channel: {
		name: string;
	}
	url: string;
	videos: Song[];
}