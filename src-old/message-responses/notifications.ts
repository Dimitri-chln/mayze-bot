import MessageResponse from "../types/structures/MessageResponse";
import Util from "../Util";

import { TextChannel } from "discord.js";

const messageResponse: MessageResponse = {
	name: "notifications",
	noBot: true,
	noDM: true,

	run: async (message, translations) => {
		const users = [
			{
				user: await message.client.users.fetch("307815349699608577"),
				regex: /\b(?:di+m+i*(?:tr(?:i+|ax))?(?:ouille)?)+\b/i,
			},
			{
				user: await message.client.users.fetch("608623753399762964"),
				regex: /\bmila+(?:y(?=na+))?(?:na+)?\b/i,
			},
		];

		for (const userData of users) {
			if (
				message.author.id !== userData.user.id &&
				userData.regex.test(message.content) &&
				!message.mentions.users.has(userData.user.id) &&
				(message.channel as TextChannel).members.has(userData.user.id)
			) {
				userData.user.send({
					embeds: [
						{
							author: {
								name: message.author.tag,
								iconURL: message.author.displayAvatarURL({ dynamic: true }),
							},
							title: `#${(message.channel as TextChannel).name}`,
							color: message.guild.me.displayColor,
							description: message.content,
							fields: [
								{
									name: "\u200b",
									value: translations.strings.link(message.url),
								},
							],
							image: {
								url: message.attachments.first()?.url,
							},
							footer: {
								text: "✨ Mayze ✨",
							},
						},
					],
				});
			}
		}
	},
};

export default messageResponse;
