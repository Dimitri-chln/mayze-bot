import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "sudo",
	aliases: [],
	description: {
		fr: "Envoyer un message sous l'identité de quelqu'un d'autre",
		en: "Send a message as someone else",
	},
	usage: "",
	userPermissions: [],
	botPermissions: ["MANAGE_MESSAGES", "MANAGE_WEBHOOKS"],
	guildIds: [Util.config.MAIN_GUILD_ID],

	options: {
		fr: [
			{
				name: "user",
				description: "L'utilisateur à usurper",
				type: "USER",
				required: true,
			},
			{
				name: "message",
				description: "Le message à envoyer",
				type: "STRING",
				required: true,
			},
		],
		en: [
			{
				name: "user",
				description: "The user to impersonate",
				type: "USER",
				required: true,
			},
			{
				name: "message",
				description: " The message to send",
				type: "STRING",
				required: true,
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const user = interaction.options.getUser("user", true);
		const message = interaction.options.getString("message", true);

		const webhook = await interaction.client.fetchWebhook(
			Util.guildConfigs.get(interaction.guild.id).webhookId,
		);

		if (webhook.channelId !== interaction.channel.id)
			await webhook.edit({ channel: interaction.channel.id });

		webhook.send({
			avatarURL: user.displayAvatarURL(),
			username: interaction.guild.members.cache.get(user.id).displayName,
			content: message,
		});

		interaction.followUp(translations.strings.sent());
	},
};

export default command;
