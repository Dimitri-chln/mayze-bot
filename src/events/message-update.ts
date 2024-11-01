import Event from "../types/Event";
import Util from "../Util";

import { Message, PartialMessage } from "discord.js";

const event: Event = {
	name: "messageUpdate",
	once: false,

	run: async (oldMessage: Message | PartialMessage, newMessage: Message) => {
		if (oldMessage.partial) return;
		if (oldMessage.author.bot) return;

		Util.sniping.editedMessages.set(oldMessage.channel.id, oldMessage as Message);

		setTimeout(() => {
			Util.sniping.editedMessages.delete(oldMessage.channel.id);
		}, 60_000);
	},
};

export default event;
