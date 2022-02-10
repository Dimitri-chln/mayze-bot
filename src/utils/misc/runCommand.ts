import { CommandInteraction, GuildMember, Permissions } from "discord.js";
import Util from "../../Util";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import { DatabaseUpgrades } from "../../types/structures/Database";

export default async function runCommand(
	command: Command,
	interaction: CommandInteraction,
) {
	const language = Util.guildConfigs.get(interaction.guild.id).language;
	const translations = (await new Translations("run-command").init()).data[
		language
	];
	const NOW = Date.now();

	const available = await command.available;
	if (!available)
		return interaction.followUp(translations.strings.not_available());

	if (command.category === "admin" && interaction.user.id !== Util.owner.id)
		return;

	const userPermissions =
		interaction.member instanceof GuildMember
			? interaction.member.permissionsIn(interaction.channel.id)
			: new Permissions(BigInt(interaction.member.permissions));

	const missingUserPermissions = command.userPermissions.filter(
		(permission) => !userPermissions.has(permission),
	);

	if (missingUserPermissions.length && interaction.user.id !== Util.owner.id)
		return interaction
			.followUp(
				translations.strings.user_missing_permissions(
					missingUserPermissions.join("`, `"),
				),
			)
			.catch(console.error);

	const missingBotPermissions = command.botPermissions.filter(
		(permission) =>
			!interaction.guild.me
				.permissionsIn(interaction.channel.id)
				.has(permission),
	);

	if (missingBotPermissions.length)
		return interaction
			.followUp(
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
			[interaction.user.id],
		);

		if (userUpgrades)
			cooldownReduction += 30 * userUpgrades.catch_cooldown_reduction;
	}

	const cooldownAmount = ((command.cooldown ?? 2) - cooldownReduction) * 1000;
	if (command.cooldowns.has(interaction.user.id)) {
		const expirationTime =
			command.cooldowns.get(interaction.user.id) + cooldownAmount;

		if (NOW < expirationTime) {
			const timeLeft = Math.ceil((expirationTime - NOW) / 1000);
			const timeLeftHumanized = new Date((timeLeft % 86400) * 1000)
				.toUTCString()
				.replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, "$1h $2m $3s")
				.replace(/00h |00m /g, "");

			return interaction
				.followUp(
					translations.strings.cooldown(timeLeftHumanized, command.name),
				)
				.catch(console.error);
		}
	}

	command.cooldowns.set(interaction.user.id, NOW);
	setTimeout(
		() => command.cooldowns.delete(interaction.user.id),
		cooldownAmount,
	);

	command.runInteraction(interaction, command.translations.data[language]).catch((err) => {
		console.error(err);
		interaction.followUp(translations.strings.error()).catch(console.error);
	});
}
