import MessageResponse from "../types/structures/MessageResponse";
import Util from "../Util";

import { TextChannel } from "discord.js";

const messageResponse: MessageResponse = {
	name: "message-link",
	noBot: true,
	noDM: true,
	guildIds: [Util.config.MAIN_GUILD_ID],

	run: async (message, translations) => {
		const regex =
			/https:\/\/(?:cdn\.)?discord(?:app)?\.com\/channels\/(\d{18})\/(\d{18})\/(\d{18})/;
		if (!regex.test(message.content)) return;

		const [, guildId, channelId, messageId] = message.content.match(regex);
		if (message.guild.id !== guildId) return;

		const channel = message.guild.channels.cache.get(channelId) as TextChannel;
		const msg = await channel.messages.fetch(messageId);

		if (!msg.content) return;

		message.channel.send({
			embeds: [
				{
					author: {
						name: msg.author.tag,
						iconURL: msg.author.displayAvatarURL({ dynamic: true }),
					},
					title: `#${channel.name}`,
					color: message.guild.me.displayColor,
					description: msg.content,
					fields: [
						{
							name: "\u200b",
							value: translations.strings.teleport(msg.url),
							inline: true,
						},
					],
					image: {
						url: msg.attachments.first()?.url,
					},
					footer: {
						text: translations.strings.quoted_by(message.author.tag),
					},
					timestamp: msg.createdTimestamp,
				},
			],
		});
	},
};

export default messageResponse;
