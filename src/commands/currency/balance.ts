import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import { DatabaseUserMoney } from "../../types/structures/Database";
import Util from "../../Util";

const command: Command = {
	name: "balance",
	aliases: [],
	description: {
		fr: "Vérifier l'argent que tu possèdes",
		en: "Check how much money you have",
	},
	usage: "",
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],

	options: {
		fr: [
			{
				name: "user",
				description: "Un utilisateur dont tu veux voir l'argent",
				type: "USER",
				required: false,
			},
		],
		en: [
			{
				name: "user",
				description: "A user whose balance you want to see",
				type: "USER",
				required: false,
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const DAY_IN_MS = 1000 * 60 * 60 * 24;
		const NOW = Date.now();
		const MIDNIGHT = new Date();
		MIDNIGHT.setHours(0, 0, 0, 0);

		const user = interaction.options.getUser("user", false) ?? interaction.user;

		const {
			rows: [userCurrency],
		}: { rows: DatabaseUserMoney[] } = await Util.database.query(
			"SELECT * FROM currency WHERE user_id = $1",
			[user.id],
		);

		const { money, last_daily } = userCurrency ?? {
			money: 0,
			last_daily: null,
		};

		const nextDaily =
			last_daily && Date.parse(last_daily) > MIDNIGHT.valueOf()
				? MIDNIGHT.valueOf() + DAY_IN_MS.valueOf()
				: NOW;

		interaction.followUp({
			embeds: [
				{
					author: {
						name: translations.strings.author(user.tag),
						iconURL: user.displayAvatarURL({ dynamic: true }),
					},
					color: interaction.guild.me.displayColor,
					description: translations.strings.description(
						money.toString(),
						nextDaily > NOW ? Math.round(nextDaily / 1000).toString() : null,
					),
					footer: {
						text: "✨ Mayze ✨",
					},
				},
			],
		});
	},
};

export default command;
