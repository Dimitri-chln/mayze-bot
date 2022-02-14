import Event from "../types/structures/Event";
import Util from "../Util";

import { VoiceState } from "discord.js";

const event: Event = {
	name: "voiceStateUpdate",
	once: false,

	run: async (oldState: VoiceState, newState: VoiceState) => {
		const queue = Util.musicPlayer.get(oldState.guild.id);

		if (queue && oldState.channel.id === queue.voiceChannel.id) {
			setTimeout(() => {
				if (queue.voiceChannel.members.size <= 1) queue.stop();
			}, 900_000);
		}
	},
};

export default event;
