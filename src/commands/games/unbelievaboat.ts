import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

import { Client as UnbClient } from "unb-api";



const command: Command = {
	name: "unbelievaboat",
	description: {
		fr: "Intéragir avec UnbelievaBoat",
		en: "Interact with UnbelievaBoat"
	},
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
						required: false
					}
				]
			}
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
						required: false
					}
				]
			}
		]
	},

	run: async (interaction, translations) => {
		const unbClient = new UnbClient(process.env.UNB_TOKEN);
		const user = await unbClient.getUserBalance(interaction.guild.id, interaction.user.id);

		const subCommand = interaction.options.getSubcommand();

		switch (subCommand) {
			case "balance": {
				interaction.reply({
					embeds: [
						{
							author: {
								name: translations.data.balance_title(interaction.user.tag),
								iconURL: interaction.user.displayAvatarURL({ dynamic: true })
							},
							color: interaction.guild.me.displayColor,
							description: translations.data.balance_description(
								user.rank.toLocaleString(translations.language),
								user.cash.toLocaleString(translations.language),
								user.bank.toLocaleString(translations.language),
								user.total.toLocaleString(translations.language)
							),
							footer: {
								text: "✨ Mayze ✨"
							}
						}
					]
				});
				break;
			}
		}
	}
};



export default command;