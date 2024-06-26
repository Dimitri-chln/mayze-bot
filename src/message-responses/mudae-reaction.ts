import MessageResponse from "../types/structures/MessageResponse";
import Util from "../Util";

const messageResponse: MessageResponse = {
	name: "mudae-reaction",
	noDM: true,

	run: async (message, translations) => {
		return; // This functionnality is to be removed

		if (message.author.id !== "432610292342587392" /* Mudae */) return;

		const embed = message.embeds[0];
		if (!embed || embed.color !== 0xff9d2c) return;

		const imRegex = /\d+ \/ \d+/;
		if (imRegex.test(embed.footer?.text)) return;

		if (message.components.length) return;

		message.react("❤️");
	},
};

export default messageResponse;
