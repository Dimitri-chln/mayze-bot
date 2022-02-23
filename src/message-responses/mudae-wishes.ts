import MessageResponse from "../types/structures/MessageResponse";
import Util from "../Util";

import { DatabaseMudaeWish } from "../types/structures/Database";

const messageResponse: MessageResponse = {
	name: "mudae-wishes",
	noDM: true,

	run: async (message, translations) => {
		if (message.author.id !== "432610292342587392" /* Mudae */) return;

		const embed = message.embeds[0];
		if (!embed || embed.color !== 0xff9d2c) return;
		const imRegex = /\d+ \/ \d+/;
		if (imRegex.test(embed.footer?.text)) return;

		const characterName = embed.author.name;
		const characterSeries = embed.description.includes("Claims:")
			? embed.description.split("\nClaims:")[0].replace(/\n/g, " ")
			: embed.description.split("\n**")[0].replace(/\n/g, " ");
		const [, kakeraValue] = embed.description.match(
			/\*\*(\d+)\*\*<:kakera:469835869059153940>/m,
		);

		const { rows: wishes }: { rows: DatabaseMudaeWish[] } =
			await Util.database.query(`SELECT * FROM mudae_wish`);

		wishes.forEach(async (wish) => {
			const regex = wish.regex
				? new RegExp(
						wish.regex.replace(/^|(\|)|$/g, (a) => {
							if (a) return `\\b${a}\\b`;
							return "\\b";
						}),
						"i",
				  )
				: new RegExp(`\\b${wish.series}\\b`, "i");

			if (regex.test(characterSeries)) {
				try {
					if (!message.guild.members.cache.has(wish.user_id)) return;
					const user = await message.client.users.fetch(wish.user_id);

					user.send({
						embeds: [
							{
								author: {
									name: translations.strings.author(),
									iconURL: user.displayAvatarURL({ dynamic: true }),
								},
								color: message.guild.me.displayColor,
								description: translations.strings.description(
									characterName,
									message.url,
									message.channel.toString(),
									characterSeries,
									kakeraValue,
								),
								footer: {
									text: "✨ Mayze ✨",
								},
							},
						],
					});
				} catch (err) {
					console.error(err);
				}
			}
		});
	},
};

export default messageResponse;
