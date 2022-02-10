import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import { Client as UnbClient } from "unb-api";

const command: Command = {
	name: "unbelievaboat",
	aliases: [],
	description: {
		fr: "Intéragir avec UnbelievaBoat",
		en: "Interact with UnbelievaBoat",
	},
	usage: "",
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],
	guildIds: ["689164798264606784"],

	options: {
		fr: [
			{
				name: "balance",
				description: "Voir ton argent sur UnbelievaBoat",
				type: "SUB_COMMAND",
				options: [
					{
						name: "user",
						description: "L'utilisateur dont tu veux voir l'argent",
						type: "USER",
						required: false,
					},
				],
			},
		],
		en: [
			{
				name: "balance",
				description: "See your UnbelievaBoat balance",
				type: "SUB_COMMAND",
				options: [
					{
						name: "user",
						description: "The user whose balance you want to see",
						type: "USER",
						required: false,
					},
				],
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const unbClient = new UnbClient(process.env.UNB_TOKEN);
		const user = interaction.options.getUser("user") ?? interaction.user;
		const unbUser = await unbClient.getUserBalance(
			interaction.guild.id,
			user.id,
		);

		const subCommand = interaction.options.getSubcommand();

		switch (subCommand) {
			case "balance": {
				interaction.followUp({
					embeds: [
						{
							author: {
								name: translations.strings.balance_title(user.tag),
								iconURL: user.displayAvatarURL({
									dynamic: true,
								}),
							},
							color: interaction.guild.me.displayColor,
							description: translations.strings.balance_description(
								unbUser.rank.toLocaleString(translations.language),
								unbUser.cash.toLocaleString(translations.language),
								unbUser.bank.toLocaleString(translations.language),
								unbUser.total.toLocaleString(translations.language),
							),
							footer: {
								text: "✨ Mayze ✨",
							},
						},
					],
				});
				break;
			}
		}
	},
};

export default command;
