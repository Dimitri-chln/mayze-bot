import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import Util from "../../Util";

import { DatabaseUser } from "../../types/Database";

import formatTime from "../../utils/misc/formatTime";

const command: CommandData = {
	name: "daily",
	aliases: [],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField([PermissionFlagsBits.EmbedLinks]),

	options: [],

	async run(input, args, localizations) {
		const DAY_IN_MS = 1000 * 60 * 60 * 24;
		const NOW = new Date();
		const MIDNIGHT = new Date();
		MIDNIGHT.setHours(0, 0, 0, 0);

		const {
			rows: [userCurrency],
		}: { rows: Pick<DatabaseUser, "currency_money" | "currency_last_daily">[] } = await Util.database.query(
			'SELECT currency_money, currency_last_daily FROM "user" WHERE id = $1',
			[input.user.id],
		);

		const lastDaily = userCurrency.currency_last_daily ?? new Date(0);

		if (lastDaily.valueOf() > MIDNIGHT.valueOf()) {
			const timeLeft = MIDNIGHT.valueOf() + DAY_IN_MS - NOW.valueOf();
			await input.reply(localizations.cooldown.format(input.locale, await formatTime(timeLeft, input.locale)));
			return;
		}

		const {
			rows: [newUserCurrency],
		}: { rows: Pick<DatabaseUser, "currency_money">[] } = await Util.database.query(
			`
			INSERT INTO "user" (id, currency_money, currency_last_daily) VALUES ($1, $2, $3)
			ON CONFLICT (id)
			DO UPDATE SET
				currency_money = "user".currency_money + $2,
				currency_last_daily = $3
			WHERE "user".id = EXCLUDED.id
			RETURNING currency_money
			`,
			[input.user.id, Util.config.DAILY_REWARD, NOW],
		);

		await input.reply({
			embeds: [
				{
					author: {
						name: localizations.author.format(input.locale),
						icon_url: input.user.displayAvatarURL(),
					},
					color: input.guild.members.me.displayColor,
					description: localizations.description.format(
						input.locale,
						Util.config.DAILY_REWARD.toString(),
						newUserCurrency.currency_money.toString(),
					),
					footer: {
						text: Util.config.DEFAULT_EMBED_FOOTER_TEXT,
					},
				},
			],
		});
	},
};

export default command;
