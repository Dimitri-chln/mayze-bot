import { CollectorFilter, MessageReaction, User } from "discord.js";
import MessageResponse from "../types/structures/MessageResponse";
import Util from "../Util";

const messageResponse: MessageResponse = {
	name: "mudae-extended-wish-list",
	noDM: true,

	run: async (message, translations) => {
		if (message.author.id !== "432610292342587392" /* Mudae */) return;
		if (!message.embeds.length) return;
		const embed = message.embeds[0];
		if (embed.color !== 6753288) return;
		if (!/0\/\d+/.test(embed.author.name)) return;

		await message.react("📝");

		const filter: CollectorFilter<[MessageReaction, User]> = (reaction, user) => reaction.emoji.name === "📝";
		const reactions = await message.awaitReactions({ filter, time: 60_000, max: 1 });
		if (!reactions.size) return;

		const { description } = message.embeds[0];
		const names = description.match(/\*\*#\d+\*\* - (.+)/gm).map((name) => name.match(/\*\*#\d+\*\* - (.+)/)[1]);

		message.channel.send({
			embeds: [
				{
					author: {
						name: reactions.first().users.cache.at(1).tag,
					},
					color: message.guild.me.displayColor,
					description: names.join("$"),
					footer: {
						text: "✨ Mayze ✨",
					},
				},
			],
		});
	},
};

export default messageResponse;
