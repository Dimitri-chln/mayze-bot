import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

import gifts from "../../assets/gifts.json";



const command: Command = {
	name: "gift",
	description: {
		fr: "Donner un cadeau aléatoire à quelqu'un",
		en: "Give someone a random gift"
	},
	userPermissions: [],
	botPermissions: [],
	guildIds: ["689164798264606784"],
	
	options: {
		fr: [
			{
				name: "user",
				description: "L'utilisateur à qui donner un cadeau",
				type: "USER",
				required: true
			}
		],
		en: [
			{
				name: "user",
				description: "The user to send a gift to",
				type: "USER",
				required: true
			}
		]
	},
	
	run: async (interaction, translations) => {
		const user = interaction.options.getUser("user");
		
		interaction.reply(
			translations.data.gift(
				user.toString(),
				getGift(gifts[translations.language]),
				interaction.user.username
			)
		);

		function getGift(giftList: Gift[]): string {
			const item = giftList[Math.floor(Math.random() * giftList.length)];
			
			if (typeof item === "string") return item;

			const category = Object.keys(item)[0];
			return `${category} ${getGift(item[category])}`;
		}
	}
};



export default command;



type Gift = string | {
	[K: string]: Gift[];
}