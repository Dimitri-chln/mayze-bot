import { Message } from "discord.js";
import Util from "../../Util";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import { DatabaseUpgrades } from "../../types/structures/Database";

export default async function runMessageCommand(
	command: Command,
	message: Message,
	args: string[],
) {
	const language = Util.guildConfigs.get(message.guild.id).language;
	const translations = (await new Translations("run-command").init()).data[
		language
	];
	const NOW = Date.now();

	const available = await command.available;
	if (!available) return message.reply(translations.strings.not_available());

	if (command.category === "admin" && message.author.id !== Util.owner.id)
		return;

	const missingUserPermissions = command.userPermissions.filter(
		(permission) =>
			!message.member.permissionsIn(message.channel.id).has(permission),
	);

	if (missingUserPermissions.length && message.author.id !== Util.owner.id)
		return message
			.reply(
				translations.strings.user_missing_permissions(
					missingUserPermissions.join("`, `"),
				),
			)
			.catch(console.error);

	const missingBotPermissions = command.botPermissions.filter(
		(permission) =>
			!message.guild.me.permissionsIn(message.channel.id).has(permission),
	);

	if (missingBotPermissions.length)
		return message
			.reply(
				translations.strings.bot_missing_perms(
					missingBotPermissions.join("`, `"),
				),
			)
			.catch(console.error);

	let cooldownReduction = 0;

	if (command.name === "catch") {
		const {
			rows: [userUpgrades],
		}: { rows: DatabaseUpgrades[] } = await Util.database.query(
			"SELECT catch_cooldown_reduction FROM upgrades WHERE user_id = $1",
			[message.author.id],
		);

		if (userUpgrades)
			cooldownReduction += 30 * userUpgrades.catch_cooldown_reduction;
	}

	const cooldownAmount = ((command.cooldown ?? 2) - cooldownReduction) * 1000;
	if (command.cooldowns.has(message.author.id)) {
		const expirationTime =
			command.cooldowns.get(message.author.id) + cooldownAmount;

		if (NOW < expirationTime) {
			const timeLeft = Math.ceil((expirationTime - NOW) / 1000);
			const timeLeftHumanized = new Date((timeLeft % 86400) * 1000)
				.toUTCString()
				.replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, "$1h $2m $3s")
				.replace(/00h |00m /g, "");

			return message
				.reply(translations.strings.cooldown(timeLeftHumanized, command.name))
				.catch(console.error);
		}
	}

	command.cooldowns.set(message.author.id, NOW);
	setTimeout(() => command.cooldowns.delete(message.author.id), cooldownAmount);

	command
		.runMessage(message, args, command.translations.data[language])
		.catch((err) => {
			console.error(err);
			message.reply(translations.strings.error()).catch(console.error);
		});
}
