import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import { CronJob } from "cron";
import { TextChannel } from "discord.js";

const command: Command = {
	name: "rose-lobby",
	aliases: [],
	description: {
		fr: "Créer et gérer les games de roses",
		en: "Create and manage rose lobbies",
	},
	usage: "",
	userPermissions: ["ADMINISTRATOR"],
	botPermissions: ["ADD_REACTIONS", "USE_EXTERNAL_EMOJIS", "MANAGE_ROLES"],
	guildIds: [Util.config.MAIN_GUILD_ID],

	options: {
		fr: [
			{
				name: "create",
				description: "Créer une game de roses",
				type: "SUB_COMMAND",
				options: [
					{
						name: "password",
						description: "Le mot de passe de la game de roses",
						type: "STRING",
						required: true,
					},
					{
						name: "message",
						description:
							"L'ID du message sous lequel les membres devront réagir",
						type: "STRING",
						required: false,
					},
				],
			},
			{
				name: "end",
				description: "Terminer une game de roses",
				type: "SUB_COMMAND",
			},
		],
		en: [
			{
				name: "create",
				description: "Create a rose lobby",
				type: "SUB_COMMAND",
				options: [
					{
						name: "password",
						description: "The lobby's password",
						type: "STRING",
						required: true,
					},
					{
						name: "message",
						description:
							"The ID of the message below which members will need to react",
						type: "STRING",
						required: false,
					},
				],
			},
			{
				name: "end",
				description: "End a rose lobby",
				type: "SUB_COMMAND",
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const announcementChannel = interaction.client.channels.cache.get(
			"817365433509740554",
		) as TextChannel;
		const logChannel = interaction.client.channels.cache.get(
			"856901268445069322",
		) as TextChannel;

		if (interaction.channel.id !== "707304882662801490" /* Bureau */)
			return interaction.followUp(translations.strings.wrong_channel());

		const subCommand = interaction.options.getSubcommand();

		switch (subCommand) {
			case "create": {
				const announcementId = interaction.options.getString("message", false);
				const announcement = announcementId
					? await announcementChannel.messages.fetch(announcementId)
					: (await announcementChannel.messages.fetch({ limit: 1 })).first();

				if (!announcement)
					return interaction.followUp(
						translations.strings.invalid_message_id(),
					);

				const date = new Date(
					parseInt(
						(announcement.content.match(/<t:(\d+)(?::[tTdDfFR])?>/) ?? [])[1],
					) * 1000,
				);

				if (!date.valueOf())
					return interaction.followUp(translations.strings.no_date());

				if (Date.now() > date.valueOf())
					return interaction.followUp(translations.strings.date_passed());

				announcement.react("833620353133707264");

				const password = interaction.options
					.getString("password")
					.toUpperCase();

				if (Util.roseLobby) Util.roseLobby.stop();

				Util.roseLobby = new CronJob(date, () => {
					announcementChannel
						.send(translations.strings.annoucement(password))
						.catch(console.error);

					logChannel.messages.fetch({ limit: 1 }).then((messages) => {
						const logMessage = messages.first();
						logMessage.edit(`~~${logMessage.content}~~`).catch(console.error);
					});
				});

				Util.roseLobby.start();

				await logChannel.send(
					`**Starting at:** \`${date.toUTCString()}\`\n**Password:** \`${password}\``,
				);

				interaction.followUp(translations.strings.created());
				break;
			}

			case "end": {
				await interaction.followUp(translations.strings.ending());

				const annoucements = await announcementChannel.messages.fetch({
					limit: 100,
				});
				await Promise.all(
					annoucements
						.filter((m) => m.reactions.cache.has("833620353133707264"))
						.map(
							async (m) =>
								await m.reactions.cache.get("833620353133707264").remove(),
						),
				);

				await Promise.all(
					interaction.guild.members.cache
						.filter((m) => m.roles.cache.has("833620668066693140"))
						.map(
							async (member) => await member.roles.remove("833620668066693140"),
						),
				);

				interaction.editReply(translations.strings.ended());
				break;
			}
		}
	},
};

export default command;
