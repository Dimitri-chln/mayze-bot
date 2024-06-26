import Discord from "discord.js";
import PlayDl from "play-dl";
import {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	getVoiceConnection,
	NoSubscriberBehavior,
	AudioPlayerStatus,
	AudioResource,
} from "@discordjs/voice";
import Axios from "axios";

export default async function startRadio() {
	const CHANNEL_ID = "gamechops";

	// Audio player creation
	const audioPlayer = createAudioPlayer({
		behaviors: {
			noSubscriber: NoSubscriberBehavior.Play,
		},
	});

	// Start playing the live video
	playLive(CHANNEL_ID);

	// Restart playing the live video if in idle state
	audioPlayer.on("stateChange", (oldState, newState) => {
		if (newState.status === AudioPlayerStatus.Idle) playLive(CHANNEL_ID);
	});

	// Radio client creation
	const intents = new Discord.Intents([
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Discord.Intents.FLAGS.GUILD_MEMBERS,
		Discord.Intents.FLAGS.GUILD_MESSAGES,
		Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Discord.Intents.FLAGS.GUILD_VOICE_STATES,
	]);

	const radioClient = new Discord.Client({
		intents,
	});

	radioClient.once("ready", async () => {
		console.log("Radio connected to Discord");
	});

	radioClient.on("voiceStateUpdate", (oldState, newState) => {
		const connection = getVoiceConnection(newState.guild.id);

		// Destroy the connection if the channel is empty
		if (connection) {
			if (oldState.channelId !== connection.joinConfig.channelId) return;
			if (oldState.channel.members.size > 1) return;

			connection.destroy();
		}

		// Create a new connection if someone joins the radio channel
		if (!connection) {
			if (!newState.channelId) return;
			if (!newState.channel.name.toLowerCase().includes("radio")) return;
			if (newState.channel.members.size > 1) return;

			const connection = joinVoiceChannel({
				guildId: newState.channel.guildId,
				channelId: newState.channel.id,
				adapterCreator: newState.channel.guild.voiceAdapterCreator,
				selfDeaf: true,
			});

			connection.subscribe(audioPlayer);
		}
	});

	radioClient.login(process.env.RADIO_TOKEN);

	async function playLive(channelId: string): Promise<AudioResource | NodeJS.Timeout> {
		const res = await Axios.get(`https://www.youtube.com/c/${channelId}/live`);
		const [, liveURL] =
			res.data.match(/<link rel="canonical" href="(https:\/\/www.youtube.com\/watch\?v=[\w-_]+)">/) ?? [];

		if (!liveURL) {
			// If the channel isn't live at the moment try again after 15min
			console.log(`${channelId} is not live`);
			return setTimeout(() => playLive(channelId), 900_000);
		}

		const source = await PlayDl.stream(liveURL);
		const resource = createAudioResource(source.stream, {
			inputType: source.type,
			inlineVolume: true,
		});

		resource.volume.setVolumeLogarithmic(0.5);
		audioPlayer.play(resource);

		console.log("Radio started playing");

		return resource;
	}
}
