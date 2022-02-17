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
	name: "messageReactionRemove",
	once: false,

	run: async (
		reaction: MessageReaction | PartialMessageReaction,
		user: User | PartialUser,
	) => {
		try {
			if (reaction.message.partial) await reaction.message.fetch();
		} catch (err) {
			console.error(err);
		}

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
					false,
					reactionCommandTranslations[language],
				)
				.catch(console.error);
		}

		// Sniping
		Util.sniping.messageReactions.set(reaction.message.channel.id, {
			reaction: reaction as MessageReaction,
			user: user as User,
		});

		setTimeout(() => {
			Util.sniping.messageReactions.delete(reaction.message.channel.id);
		}, 60_000);
	},
};

export default event;
