import Event from "../types/structures/Event";
import Util from "../Util";

import { Message } from "discord.js";
import Translations from "../types/structures/Translations";
import { DatabaseLevel } from "../types/structures/Database";
import getLevel from "../utils/misc/getLevel";
import parseArgs from "../utils/misc/parseArgs";
import runMessageCommand from "../utils/misc/runMessageCommand";

const event: Event = {
	name: "messageCreate",
	once: false,

	run: async (message: Message) => {
		// Chat xp
		if (
			message.channel.type !== "DM" &&
			!message.author.bot &&
			!message.channel.name.includes("spam") &&
			message.channel.id !== "865997369745080341" /* #tki */
		) {
			const translations = (await new Translations("index_level").init()).data[
				Util.guildConfigs.get(message.guild.id).language
			];

			const bots = await message.guild.members.fetch().catch(console.error);

			if (bots) {
				const prefixes = bots
					.map((bot) => {
						const [, prefix] = bot.displayName.match(/\[(.+)\]/) ?? [];
						return prefix;
					})
					.filter((p) => p);

				if (
					!prefixes.some((p) => message.content.toLowerCase().startsWith(p))
				) {
					if (Util.xpMessages.has(message.author.id)) {
						Util.xpMessages.set(
							message.author.id,
							Util.xpMessages.get(message.author.id) + 1,
						);
					} else {
						Util.xpMessages.set(message.author.id, 1);
						setTimeout(() => {
							Util.xpMessages.delete(message.author.id);
						}, 60_000);
					}

					const newXP = Math.round(
						(Math.sqrt(message.content.length) * Util.config.XP_MULTIPLIER) /
							Util.xpMessages.get(message.author.id),
					);

					try {
						const {
							rows: [{ chat_xp: xp }],
						}: { rows: DatabaseLevel[] } = await Util.database.query(
							`
					INSERT INTO level (user_id, chat_xp) VALUES ($1, $2)
					ON CONFLICT (user_id)
					DO UPDATE SET
						chat_xp = level.chat_xp + $2 WHERE level.user_id = $1
					RETURNING level.chat_xp
					`,
							[message.author.id, newXP],
						);

						const levelInfo = getLevel(xp);

						if (
							levelInfo.currentXP < newXP &&
							message.guild.id === Util.config.MAIN_GUILD_ID
						)
							message.channel.send(
								translations.strings.chat_level_up(
									message.author.toString(),
									levelInfo.level.toString(),
								),
							);
					} catch (err) {
						console.error(err);
					}
				}
			}
		}

		// Message responses
		const language = Util.guildConfigs.get(message.guild?.id)?.language ?? "fr";

		for (const messageResponse of Util.messageResponses) {
			if (messageResponse.noBot && message.author.bot) continue;
			if (messageResponse.noDM && message.channel.type === "DM") continue;
			if (
				messageResponse.guildIds &&
				!messageResponse.guildIds.includes(message.guild?.id)
			)
				continue;

			messageResponse
				.run(message, messageResponse.translations.data[language])
				.catch(console.error);
		}

		// Message commands
		if (
			message.channel.type !== "DM" &&
			message.content.toLowerCase().startsWith(Util.prefix) &&
			!message.author.bot &&
			message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")
		) {
			const input = message.content
				.slice(Util.prefix.length)
				.trim()
				.split(/ +/g);
			const commandName = input.shift().toLowerCase();
			const args = parseArgs(input.join(" "));

			const command =
				Util.commands.get(commandName) ??
				Util.commands.find(
					(cmd) => cmd.aliases && cmd.aliases.includes(commandName),
				);
			if (command && command.runMessage)
				runMessageCommand(command, message, args);
		}
	},
};

export default event;
