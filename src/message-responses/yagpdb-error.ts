import MessageResponse from "../types/structures/MessageResponse";
import Util from "../Util";

const messageResponse: MessageResponse = {
	name: "yagpdb-error",
	noDM: true,

	run: async (message, translations) => {
		if (message.author.id !== "204255221017214977" /* YAGPDB */) return;

		if (
			message.content.startsWith("Gave up trying to execute custom command") ||
			message.content.startsWith(
				"An error caused the execution of the custom command template to stop",
			)
		) {
			message.delete().catch(console.error);
		}
	},
};

export default messageResponse;
