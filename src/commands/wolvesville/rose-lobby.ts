import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

import { CronJob } from "cron";
import { TextChannel } from "discord.js";



const command: Command = {
	name: "rose-lobby",
	description: {
		fr: "Créer et gérer les games de roses",
		en: "Create and manage rose lobbies"
	},
	userPermissions: ["ADMINISTRATOR"],
	botPermissions: ["ADD_REACTIONS", "USE_EXTERNAL_EMOJIS", "MANAGE_ROLES"],
	guildIds: [ Util.config.MAIN_GUILD_ID ],
	
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
						required: true
					},
					{
						name: "message",
						description: "L'ID du message sous lequel les membres devront réagir",
						type: "STRING",
						required: false
					}
				]
			},
			{
				name: "end",
				description: "Terminer une game de roses",
				type: "SUB_COMMAND"
			}
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
						required: true
					},
					{
						name: "message",
						description: "The ID of the message below which members will need to react",
						type: "STRING",
						required: false
					}
				]
			},
			{
				name: "end",
				description: "End a rose lobby",
				type: "SUB_COMMAND"
			}
		]
	},

	run: async (interaction: CommandInteraction, translations: Translations) => {
		const announcementChannel = interaction.client.channels.cache.get("817365433509740554") as TextChannel;
		const logChannel = interaction.client.channels.cache.get("856901268445069322") as TextChannel;
		
		if (interaction.channel.id !== announcementChannel.id) return interaction.reply({
			content: translations.data.wrong_channel(),
			ephemeral: true
		});

		const subCommand = interaction.options.getSubcommand();

		switch (subCommand) {
			case "create": {
				const announcementId = interaction.options.getString("message");
				const announcement = await interaction.channel.messages.fetch(announcementId);

				if (!announcement) return interaction.reply({
					content: translations.data.invalid_message_id(),
					ephemeral: true
				});
				
				announcement.react("833620353133707264");

				const date = new Date(
					parseInt(
						announcement.content.match(/<t:(\d+)(?::[tTdDfFR])?>/)[1]
					)
				);
				if (!date) return interaction.reply({
					content: translations.data.no_date(),
					ephemeral: true
				});
				if (Date.now() > date.valueOf()) return interaction.reply({
					content: translations.data.date_passed(),
					ephemeral: true
				});

				const password = interaction.options.getString("password").toUpperCase();

				if (Util.roseLobby) Util.roseLobby.stop();
				
				Util.roseLobby = new CronJob(date, () => {
					announcementChannel.send(
						translations.data.annoucement(password)
					).catch(console.error);
					
					logChannel.messages.fetch({ limit: 1 }).then(messages => {
						const logMessage = messages.first();
						logMessage.edit(`~~${logMessage.content}~~`).catch(console.error);
					});
				});

				Util.roseLobby.start();
				
				logChannel.send(`**Starting at:** \`${date.toUTCString()}\`\n**Password:** \`${password}\``).catch(console.error);
				break;
			}

			case "end": {
				interaction.reply(translations.data.ending());

				const annoucements = await announcementChannel.messages.fetch({ limit: 100 });
				await Promise.all(
					annoucements.filter(m => m.reactions.cache.has("833620353133707264"))
						.map(async m => await m.reactions.cache.get("833620353133707264").remove())
				);

				await Promise.all(
					interaction.guild.members.cache.filter(m => m.roles.cache.has("833620668066693140"))
						.map(async member => await member.roles.remove("833620668066693140"))
				);

				interaction.editReply(translations.data.ended());
				break;
			}
		}
	}
};



export default command;