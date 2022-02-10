import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "daily",
	description: {
		fr: "Récupérer tes récompenses quotidiennes",
		en: "Claim your daily rewards",
	},
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],

	options: {
		fr: [],
		en: [],
	},

	run: async (interaction, translations) => {
		const DAY_IN_MS = 1000 * 60 * 60 * 24;
		const NOW = new Date();
		const MIDNIGHT = new Date();
		MIDNIGHT.setHours(0, 0, 0, 0);

		const {
			rows: [userCurrency],
		} = await Util.database.query("SELECT * FROM currency WHERE user_id = $1", [
			interaction.user.id,
		]);

		const lastDaily = userCurrency
			? new Date(userCurrency.last_daily)
			: new Date(0);

		if (lastDaily.valueOf() > MIDNIGHT.valueOf()) {
			const timeLeft = Math.ceil(
				(MIDNIGHT.valueOf() + DAY_IN_MS.valueOf() - NOW.valueOf()) / 1000,
			);
			const timeLeftHumanized = new Date((timeLeft % 86_400) * 1000)
				.toUTCString()
				.replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, "$1h $2m $3s")
				.replace(/00h |00m /g, "");

			return interaction.followUp(
				translations.strings.cooldown(timeLeftHumanized),
			);
		}

		const {
			rows: [{ money }],
		} = await Util.database.query(
			`
			INSERT INTO currency VALUES ($1, $2, $3)
			ON CONFLICT (user_id)
			DO UPDATE SET
				money = currency.money + $2,
				last_daily = $3
			WHERE currency.user_id = EXCLUDED.user_id
			RETURNING money
			`,
			[
				interaction.user.id,
				Util.config.DAILY_REWARD,
				new Date(NOW).toISOString(),
			],
		);

		interaction.followUp({
			embeds: [
				{
					author: {
						name: translations.strings.title(),
						iconURL: interaction.user.displayAvatarURL({
							dynamic: true,
						}),
					},
					color: interaction.guild.me.displayColor,
					description: translations.strings.description(
						Util.config.DAILY_REWARD.toString(),
						money.toString(),
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
