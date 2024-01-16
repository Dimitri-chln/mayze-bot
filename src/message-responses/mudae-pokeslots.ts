import MessageResponse from "../types/structures/MessageResponse";
import Util from "../Util";

import { TextChannel } from "discord.js";

const messageResponse: MessageResponse = {
	name: "mudae-pokeslots",
	noDM: true,
	guildIds: [Util.config.MAIN_GUILD_ID],

	run: async (message, translations) => {
		if (message.author.id !== "432610292342587392" /* Mudae */) return;

		const pinChannel = message.client.channels.cache.get("788428208298000435") as TextChannel;
		const legendaryRegex =
			/Félicitations, vous venez de gagner un\.\.\. Un\.\.\. <:.+?:(\d{18,20})> \*\*(\w+?)\*\*\?!/m;
		const ultraBeastRegex = /un <:.+?:(\d{18,20})> \*\*(\w+?)\*\*\. Euh, QUOI \?/m;
		const shinyRegex = /<:.+?:(\d{18,20})> \*\*(\w+?) <:shinySparkles:653808283244560402>\*\*/m;
		// https://cdn.discordapp.com/emojis/653808283244560402.png?v=1

		const [, legendaryEmoji, legendaryPokemon] = message.content.match(legendaryRegex) || [];
		const [, ultraBeastEmoji, ultraBeastPokemon] = message.content.match(ultraBeastRegex) || [];
		const [, shinyEmoji, shinyPokemon] = message.content.match(shinyRegex) || [];

		const emoji = legendaryEmoji ?? ultraBeastEmoji ?? shinyEmoji;
		const pokemon = legendaryPokemon ?? ultraBeastPokemon ?? shinyPokemon;

		if (!pokemon) return;

		let user = message.mentions.users.first();
		if (!user) {
			const [, username] = message.content.match(/^(.+): /m) || [];
			user = message.client.users.cache.find((u) => u.username === username);
			if (!user) return;
		}

		pinChannel.send({
			embeds: [
				{
					author: {
						name: user.tag,
						iconURL: user.displayAvatarURL({ dynamic: true }),
					},
					color: 0x010101,
					thumbnail: {
						url: `https://cdn.discordapp.com/emojis/${emoji}.png?v=1`,
					},
					description: `a attrapé un ${shinyPokemon ? "⭐ " : ""}**[${pokemon}](${
						message.url
					})** dans ${message.channel.toString()} !`,
					footer: {
						text: "✨ Mayze ✨",
					},
					timestamp: Date.now(),
				},
			],
		});
	},
};

export default messageResponse;
