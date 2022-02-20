import Event from "../types/structures/Event";
import Util from "../Util";
import Translations from "../types/structures/Translations";

import {
	MessageReaction,
	PartialMessageReaction,
	User,
	PartialUser,
} from "discord.js";

const event: Event = {
	name: "messageReactionAdd",
	once: false,

	run: async (
		reaction: MessageReaction | PartialMessageReaction,
		user: User | PartialUser,
	) => {
		if (reaction.partial) await reaction.fetch();
		if (reaction.message.partial) await reaction.message.fetch();

		if (reaction.partial || reaction.message.partial) return;
		if (user.bot) return;
		if (reaction.message.channel.type === "DM") return;

		// Reaction commands
		const language =
			Util.guildConfigs.get(reaction.message.guild?.id)?.language ?? "fr";

		for (const reactionCommand of Util.reactionCommands) {
			const reactionCommandTranslations = await new Translations(
				`reac_${reactionCommand.name}`,
			).init();

			reactionCommand
				.run(
					reaction as MessageReaction,
					user as User,
					true,
					reactionCommandTranslations[language],
				)
				.catch(console.error);
		}
	},
};

export default event;
