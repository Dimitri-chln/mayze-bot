import Event from "../types/structures/Event";
import Util from "../Util";

import { VoiceState } from "discord.js";
import { AudioPlayerStatus } from "@discordjs/voice";

const event: Event = {
	name: "voiceStateUpdate",
	once: false,

	run: async (oldState: VoiceState, newState: VoiceState) => {
		const queue = Util.musicPlayer.get(
			oldState.channelId ?? newState.channelId,
		);

		if (
			queue &&
			(oldState?.channel?.id === queue.voiceChannel.id ||
				newState?.channel?.id === queue.voiceChannel.id)
		) {
			if (queue.voiceChannel.members.size > 1) {
				// Resume when more users join the voice channel
				if (queue.audioPlayer.state.status === AudioPlayerStatus.Paused)
					queue.resume();

				if (queue.emptyTimeout) {
					clearTimeout(queue.emptyTimeout);
					delete queue.emptyTimeout;
				}
			} else {
				// Auto pause if the voice channel is empty
				if (queue.audioPlayer.state.status === AudioPlayerStatus.Playing)
					queue.pause();

				if (queue.emptyTimeout) clearTimeout(queue.emptyTimeout);
				queue.emptyTimeout = setTimeout(() => {
					if (queue.voiceChannel.members.size <= 1) queue.stop();
				}, queue.idleTime);
			}
		}
	},
};

export default event;
