import MessageResponse from "../types/structures/MessageResponse";
import Util from "../Util";

import formatTime from "../utils/misc/formatTime";
import { DatabaseAfkUser } from "../types/structures/Database";

const messageResponse: MessageResponse = {
	name: "afk-ping",
	noBot: true,
	noDM: true,

	run: async (message, translations) => {
		const mentionned = message.mentions.users;
		const { rows: afkUsers }: { rows: DatabaseAfkUser[] } =
			await Util.database.query("SELECT * FROM afk");

		afkUsers.forEach((afkUser) => {
			if (mentionned.has(afkUser.user_id))
				message.channel
					.send(
						translations.strings.reply(
							mentionned.get(afkUser.user_id).tag,
							formatTime(
								Date.now() - Date.parse(afkUser.timestamp),
								translations.language,
							),
							afkUser.message,
						),
					)
					.catch(console.error);

			if (
				message.author.id === afkUser.user_id &&
				Date.now() - Date.parse(afkUser.timestamp) > 60_000
			) {
				Util.database
					.query("DELETE FROM afk WHERE user_id = $1", [message.author.id])
					.catch(console.error);

				message.react("👋").catch(console.error);

				setTimeout(
					() => message.reactions.cache.get("👋").remove().catch(console.error),
					4_000,
				);
			}
		});
	},
};

export default messageResponse;
