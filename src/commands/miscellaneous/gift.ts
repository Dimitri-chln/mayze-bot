import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import gifts from "../../assets/gifts.json";

const command: Command = {
	name: "gift",
	aliases: [],
	description: {
		fr: "Donner un cadeau aléatoire à quelqu'un",
		en: "Give someone a random gift",
	},
	usage: "",
	userPermissions: [],
	botPermissions: [],
	guildIds: [Util.config.MAIN_GUILD_ID],

	options: {
		fr: [
			{
				name: "user",
				description: "L'utilisateur à qui donner un cadeau",
				type: "USER",
				required: true,
			},
		],
		en: [
			{
				name: "user",
				description: "The user to send a gift to",
				type: "USER",
				required: true,
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const user = interaction.options.getUser("user");

		interaction.followUp({
			content: translations.strings.gift(
				user.toString(),
				getGift(gifts[translations.language] ?? gifts.fr),
				interaction.user.username,
			),
			allowedMentions: {
				users: [user.id],
			},
		});

		function getGift(giftList: Gift[]): string {
			const item = giftList[Math.floor(Math.random() * giftList.length)];

			if (typeof item === "string") return item;

			const category = Object.keys(item)[0];
			return `${category} ${getGift(item[category])}`;
		}
	},
};

export default command;

type Gift =
	| string
	| {
			[K: string]: Gift[];
	  };
