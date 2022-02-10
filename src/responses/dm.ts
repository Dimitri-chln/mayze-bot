import MessageResponse from "../types/structures/MessageResponse";
import Util from "../Util";

import { TextChannel } from "discord.js";

const messageResponse: MessageResponse = {
	name: "dm",
	noBot: true,

	run: async (message, translations) => {
		const DMGuild = message.client.guilds.cache.get(Util.config.ADMIN_GUILD_ID);
		const DMcategory = DMGuild.channels.cache.get("744292272300097549");

		if (message.channel.type === "DM") {
			const msg = `${message.content}\n${message.attachments
				.map((attachment) => attachment.url)
				.join("\n")}`;

			let channel = DMGuild.channels.cache.find(
				(c: TextChannel) =>
					c.topic === message.author.id && c.parentId === DMcategory.id,
			);

			if (!channel) {
				channel = await DMGuild.channels.create(message.author.username, {
					type: "GUILD_TEXT",
				});
				channel.setParent(DMcategory.id);
				channel.setTopic(message.author.id);
			} else {
				channel.setName(message.author.username).catch(console.error);
			}
			(channel as TextChannel).send(msg);
		} else if (message.channel.parentId === DMcategory.id) {
			const msg = `${message.content}\n${message.attachments
				.map((attachment) => attachment.url)
				.join("\n")}`;

			const user = await message.client.users.fetch(
				(message.channel as TextChannel).topic,
			);

			user.send(msg);
		}
	},
};

export default messageResponse;
