import Event from "../types/structures/Event";
import Util from "../Util";

import { Message, PartialMessage } from "discord.js";

const event: Event = {
	name: "messageDelete",
	once: false,

	run: async (message: Message | PartialMessage) => {
		if (message.partial) return;
		if (message.author.bot) return;

		Util.sniping.deletedMessages.set(message.channel.id, message as Message);

		setTimeout(() => {
			Util.sniping.deletedMessages.delete(message.channel.id);
		}, 600_000);
	},
};

export default event;
