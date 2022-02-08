import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

import pagination, { Page } from "../../utils/misc/pagination";
import Minecraft from "minecraft-server-ping";
import { MessageAttachment } from "discord.js";

const command: Command = {
	name: "minecraft",
	description: {
		fr: "Obtenir des informations sur les serveurs Minecraft de Mayze",
		en: "Get information about Mayze's Minecraft servers",
	},
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],
	guildIds: [Util.config.MAIN_GUILD_ID],

	options: {
		fr: [],
		en: [],
	},

	run: async (interaction, translations) => {
		const serverIPs = process.env.MINECRAFT_SERVER_IPS.split(",");

		const pages: Page[] = [];

		await Promise.all(
			serverIPs.map(async (serverIP) => {
				const page: Page = {
					embeds: [],
					attachments: [],
				};

				try {
					const res = await Minecraft.ping(serverIP);
					const isOnline = (pingResult: typeof res) =>
						/^Bienvenue sur le serveur de .+!$/.test(
							pingResult.description?.text,
						);

					page.embeds.push({
						author: {
							name: translations.data.title(),
							iconURL: interaction.client.user.displayAvatarURL(),
						},
						thumbnail: {
							url: "attachment://favicon.png",
						},
						color: interaction.guild.me.displayColor,
						description: translations.data.description(
							serverIP,
							isOnline(res),
							res.version.name,
							res.players.online.toString(),
							res.players.max.toString(),
							res.ping.toString(),
						),
						footer: {
							text: "✨ Mayze ✨",
						},
					});

					page.attachments.push(
						new MessageAttachment(
							Buffer.from(res.favicon.slice(22), "base64"),
							"favicon.png",
						),
					);
				} catch (err) {
					page.embeds.push({
						author: {
							name: translations.data.title(),
						},
						color: interaction.guild.me.displayColor,
						description:
							translations.data.failed_description(serverIP),
						footer: {
							text: "✨ Mayze ✨",
						},
					});
				}

				pages.push(page);
			}),
		);

		// Sort online servers first
		pages.sort((a, b) => {
			if (a.embeds[0].thumbnail) return -1;
			if (b.embeds[0].thumbnail) return 1;
			return 0;
		});

		pagination(interaction, pages);
	},
};

export default command;
