import Event from "../types/structures/Event";
import Util from "../Util";

import { VoiceState } from "discord.js";
import { AudioPlayerStatus } from "@discordjs/voice";

const event: Event = {
	name: "voiceStateUpdate",
	once: false,

	run: async (oldState: VoiceState, newState: VoiceState) => {
		const queue = Util.musicPlayer.get(oldState.guild.id ?? newState.guild.id);

		if (
			queue &&
			(oldState?.channel?.id === queue.voiceChannel.id ||
				newState?.channel?.id === queue.voiceChannel.id)
		) {
			if (queue.voiceChannel.members.size === 1) {
				// Auto pause if the voice channel is empty
				if (queue.audioPlayer.state.status === AudioPlayerStatus.Playing) {
					if (queue.pause())
						queue.textChannel.send(queue.translations.strings.auto_paused());
				}

				// Create empty timeout
				if (queue.emptyTimeout) clearTimeout(queue.emptyTimeout);
				queue.emptyTimeout = setTimeout(() => queue.stop(), queue.idleTime);
			}

			if (queue.voiceChannel.members.size === 2) {
				// Resume when a user joins the voice channel
				if (queue.audioPlayer.state.status === AudioPlayerStatus.Paused) {
					if (queue.resume())
						queue.textChannel.send(queue.translations.strings.auto_resumed());
				}

				// Cancel empty timeout
				if (queue.emptyTimeout) {
					clearTimeout(queue.emptyTimeout);
					delete queue.emptyTimeout;
				}
			}
		}
	},
};

export default event;
