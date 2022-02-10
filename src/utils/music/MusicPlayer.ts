import { Client, Collection, Snowflake } from "discord.js";
import Queue from "./Queue";

export default class MusicPlayer {
	readonly client: Client;
	readonly queues: Collection<Snowflake, Queue>;

	constructor(client: Client) {
		this.client = client;
		this.queues = new Collection();
	}

	isPlaying(guildId: Snowflake) {
		return this.queues.some(
			(queue) =>
				queue.voiceChannel.guild.id === guildId && !queue.stopped,
		);
	}

	get(guildId: Snowflake) {
		return this.queues.find(
			(queue) =>
				queue.voiceChannel.guild.id === guildId && !queue.stopped,
		);
	}
}
