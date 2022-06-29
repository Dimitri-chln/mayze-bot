import MessageResponse from "../types/structures/MessageResponse";
import Util from "../Util";

const messageResponse: MessageResponse = {
	name: "colors-channel",

	run: async (message, translations) => {
		if (message.channel.id !== Util.config.COLORS_CHANNEL_ID) return;
		if (message.embeds.length && message.embeds[0].title === "Couleurs disponibles") return;

		if (message.deletable) message.delete();
	},
};

export default messageResponse;
