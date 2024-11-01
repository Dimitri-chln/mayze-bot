import Event from "../types/Event";
import Util from "../Util";

import { Client, TextChannel } from "discord.js";

import initializeApplicationCommands from "../utils/init/initializeApplicationCommands";
import initializeGuildConfigs from "../utils/init/initializeGuildConfigs";
import initializeReminders from "../utils/init/initializeReminders";
import initializeVoiceXp from "../utils/init/initializeVoiceXp";
import initializeCanvas from "../utils/init/initializeCanvas";
import initializePokedex from "../utils/init/initializePokedex";

const event: Event = {
	name: "ready",
	once: true,

	run: async (client: Client) => {
		console.log("Connected to Discord");

		const logChannel = client.channels.cache.get(Util.config.LOG_CHANNEL_ID);

		(logChannel as TextChannel)
			.send({
				embeds: [
					{
						author: {
							name: "Mayze is starting...",
							icon_url: client.user.displayAvatarURL(),
						},
						color: 0x010101,
						description: `- **Ping:** \`${client.ws.ping}\` ms`,
						footer: {
							text: "✨ Mayze ✨",
						},
						timestamp: new Date().toISOString(),
					},
				],
			})
			.catch(console.error);

		Util.owner = await client.users.fetch(Util.config.OWNER_ID);

		await Promise.all([
			initializeGuildConfigs(),
			initializeApplicationCommands(),
			initializeReminders(),
			initializeVoiceXp(),
			initializeCanvas(),
			initializePokedex(),
		]);
	},
};

export default event;
