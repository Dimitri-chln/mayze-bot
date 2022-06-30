import MessageResponse from "../types/structures/MessageResponse";
import Util from "../Util";

const messageResponse: MessageResponse = {
	name: "color-channel",

	run: async (message, translations) => {
		if (message.channel.id !== Util.config.COLOR_CHANNEL_ID) return;
		if (message.embeds.length && message.embeds[0]?.author?.name === "Couleurs disponibles") return;

		if (message.deletable) message.delete();
	},
};

export default messageResponse;
