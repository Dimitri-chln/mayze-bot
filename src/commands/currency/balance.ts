import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField, User } from "discord.js";
import Util from "../../Util";
import { DatabaseUser } from "../../types/Database";

const command: CommandData = {
	name: "balance",
	aliases: ["bal", "money"],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField([PermissionFlagsBits.EmbedLinks]),

	options: [
		{
			type: ApplicationCommandOptionType.User,
			name: "user",
			description: undefined,
			required: false,
		},
	],

	async run(input, args, localizations) {
		const user = (args.get("user") as User) ?? input.user;

		const DAY_IN_MS = 1000 * 60 * 60 * 24;
		const MIDNIGHT = new Date();
		MIDNIGHT.setHours(0, 0, 0, 0);

		const {
			rows: [userCurrency],
		}: { rows: Pick<DatabaseUser, "currency_money" | "currency_last_daily">[] } = await Util.database.query(
			'SELECT currency_money, currency_last_daily FROM "user" WHERE id = $1',
			[user.id],
		);

		await input.reply({
			embeds: [
				{
					author: {
						name: localizations.author.format(input.locale, user.tag),
						icon_url: user.displayAvatarURL(),
					},
					color: input.guild.members.me.displayColor,
					description: localizations.description.format(
						input.locale,
						userCurrency.currency_money.toString(),
						userCurrency.currency_last_daily && userCurrency.currency_last_daily.valueOf() > MIDNIGHT.valueOf(),
						Math.round((MIDNIGHT.valueOf() + DAY_IN_MS) / 1000).toString(),
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
