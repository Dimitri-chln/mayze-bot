import { Client, Collection, Snowflake, TextChannel, VoiceChannel } from "discord.js";
import Translations from "../structures/Translations";
import Util from "../../Util";
import Queue from "./Queue";

export default class MusicPlayer {
	readonly client: Client;
	private readonly _queues: Collection<Snowflake, Queue>;

	constructor(client: Client) {
		this.client = client;
		this._queues = new Collection();
	}

	isPlaying(guildId: Snowflake) {
		return this._queues.some((queue) => queue.voiceChannel.guild.id === guildId && queue.songs.length > 0);
	}

	get(guildId: Snowflake) {
		return this._queues.find((queue) => queue.voiceChannel.guild.id === guildId);
	}

	delete(guildId: Snowflake) {
		this._queues.delete(guildId);
	}

	async create(voiceChannel: VoiceChannel, textChannel: TextChannel) {
		const translationsData = await new Translations("music_queue").init();
		const translations = translationsData.data[Util.guildConfigs.get(voiceChannel.guild.id).language];

		const queue = new Queue(voiceChannel, textChannel, translations);
		this._queues.set(voiceChannel.guild.id, queue);

		return queue;
	}
}
