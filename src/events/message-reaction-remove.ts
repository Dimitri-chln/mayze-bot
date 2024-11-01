import Event from "../types/Event";
import Util from "../Util";

import { MessageReaction, PartialMessageReaction, User, ChannelType } from "discord.js";

const event: Event = {
	name: "messageReactionRemove",
	once: false,

	run: async (reaction: MessageReaction | PartialMessageReaction, user: User) => {
		if (reaction.partial) await reaction.fetch();
		if (reaction.message.partial) await reaction.message.fetch();
		if (user.bot) return;
		if (reaction.message.channel.type === ChannelType.DM) return;

		// Reaction commands
		/*const language = Util.guildConfigs.get(reaction.message.guild?.id)?.language ?? "fr";

		for (const reactionCommand of Util.reactionCommands) {
			const reactionCommandTranslations = await new Translations(`reac_${reactionCommand.name}`).init();

			reactionCommand
				.run(reaction as MessageReaction, user as User, false, reactionCommandTranslations[language])
				.catch(console.error);
		}*/

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
