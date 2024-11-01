import Event from "../types/Event";
import Util from "../Util";

import { MessageReaction, PartialMessageReaction, User, ChannelType } from "discord.js";

const event: Event = {
	name: "messageReactionAdd",
	once: false,

	run: async (reaction: MessageReaction | PartialMessageReaction, user: User) => {
		if (reaction.partial) await reaction.fetch();
		if (reaction.message.partial) await reaction.message.fetch();
		if (user.bot) return;
		if (reaction.message.channel.type === ChannelType.DM) return;

		// Reaction commands
		/*Util.guildConfigs.get(reaction.message.guild.id).language;

		for (const reactionCommand of Util.reactionCommands) {
			const reactionCommandTranslations = await new Translations(`reac_${reactionCommand.name}`).init();

			reactionCommand
				.run(reaction as MessageReaction, user as User, true, reactionCommandTranslations[language])
				.catch(console.error);
		}*/
	},
};

export default event;
