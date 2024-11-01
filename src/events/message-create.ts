import Event from "../types/Event";
import Util from "../Util";

import { ChannelType, Message, PermissionFlagsBits } from "discord.js";

import { DatabaseUser } from "../types/Database";
import { DataLocalizationManager } from "../structures/localizations/LocalizationManager";
import { MessageCommandInput } from "../structures/commands/CommandInput";
import getLevel from "../utils/misc/getLevel";

const event: Event = {
	name: "messageCreate",
	once: false,

	run: async (message: Message) => {
		// Message commands
		if (!message.content.startsWith(Util.prefix)) return;
		if (!message.guild.members.me.permissionsIn(message.channel.id).has(PermissionFlagsBits.SendMessages)) return;
		if (message.author.bot) return;

		try {
			const input = new MessageCommandInput(message);
			input.command.run(input).catch(console.error);
		} catch (err) {
			if (err.message !== "InvalidCommand") console.error(err);
		}

		// Message responses
		/*const language = Util.guildConfigs.get(message.guild?.id)?.language ?? "fr";

		for (const messageResponse of Util.messageResponses) {
			if (messageResponse.noBot && message.author.bot) continue;
			if (messageResponse.noDM && message.channel.type === "DM") continue;
			if (messageResponse.guildIds && !messageResponse.guildIds.includes(message.guild?.id)) continue;

			const messageResponseTranslations = await new Translations(`resp_${messageResponse.name}`).init();

			messageResponse.run(message, messageResponseTranslations.data[language]).catch(console.error);
		}*/

		// Chat xp
		if (
			message.channel.type !== ChannelType.DM &&
			!message.author.bot &&
			!message.channel.name.includes("spam") &&
			message.channel.id !== "865997369745080341" /* #tki */
		) {
			if (Util.xpMessages.has(message.author.id)) {
				Util.xpMessages.set(message.author.id, Util.xpMessages.get(message.author.id) + 1);
			} else {
				Util.xpMessages.set(message.author.id, 1);
				setTimeout(() => {
					Util.xpMessages.delete(message.author.id);
				}, 60_000);
			}

			const newXp = Math.round(
				(Math.sqrt(message.content.length) * Util.config.XP_MULTIPLIER) / Util.xpMessages.get(message.author.id),
			);

			try {
				const {
					rows: [user],
				}: { rows: Pick<DatabaseUser, "level_chat_xp">[] } = await Util.database.query(
					`
					INSERT INTO "user" (id, level_chat_xp) VALUES ($1, $2)
					ON CONFLICT (id)
					DO UPDATE SET
						level_chat_xp = "user".level_chat_xp + 0
					WHERE "user".id = EXCLUDED.id
					RETURNING level_chat_xp
					`,
					[message.author.id, newXp],
				);

				const levelInfo = getLevel(user.level_chat_xp);

				if (levelInfo.currentXp < newXp && message.guild.id === Util.config.MAIN_GUILD_ID) {
					const dataLocalizations = new DataLocalizationManager();
					await dataLocalizations.fetch();

					message.channel.send(
						dataLocalizations.strings.level.chat_level_up.format(
							Util.guildConfigs.get(message.guild.id).language,
							message.author.toString(),
							levelInfo.level.toString(),
						),
					);
				}
			} catch (err) {
				console.error(err);
			}
		}
	},
};

export default event;
