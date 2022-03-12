import MessageResponse from "../types/structures/MessageResponse";
import Util from "../Util";

import { CollectorFilter, MessageReaction, TextChannel, User } from "discord.js";
import pagination, { Page } from "../utils/misc/pagination";

const messageResponse: MessageResponse = {
	name: "mudae-pins",
	noDM: true,

	run: async (message, translations) => {
		if (message.author.id !== "432610292342587392" /* Mudae */) return;

		const pinRegex = /<:(?:logo)?pin\d{1,4}:\d{18}>/g;
		if (!pinRegex.test(message.content)) return;

		message.react("🔎");

		let user: User;

		const filter: CollectorFilter<[MessageReaction, User]> = (reaction, reactingUser) => {
			user = reactingUser;
			return reaction.emoji.name === "🔎" && !user.bot;
		};

		const collected = await message.awaitReactions({
			filter,
			max: 1,
			time: 60_000,
		});

		if (!collected.size) {
			message.reactions.removeAll();
			return;
		}

		const pins = message.content.match(pinRegex);

		const pages: Page[] = [];

		for (const pin of pins) {
			pages.push({
				embeds: [
					{
						author: {
							name: `Mudapins: ${pin.match(/(?:logo)?pin\d+/)[0]}`,
							iconURL: user.displayAvatarURL({ dynamic: true }),
						},
						color: message.guild.me.displayColor,
						thumbnail: {
							url: `https://cdn.discordapp.com/emojis/${pin.match(/\d{18}/)}.png`,
						},
					},
				],
			});
		}

		pagination(message, pages, { user });
	},
};

export default messageResponse;
