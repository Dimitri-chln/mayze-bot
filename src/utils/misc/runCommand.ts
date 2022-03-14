import { CommandInteraction, GuildMember, Permissions } from "discord.js";
import Util from "../../Util";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import { DatabaseUpgrades } from "../../types/structures/Database";

export default async function runCommand(command: Command, interaction: CommandInteraction) {
	const language =
		interaction.channel.type === "DM"
			? interaction.locale.slice(0, 2)
			: Util.guildConfigs.get(interaction.guild.id).language;

	const translations = (await new Translations("run-command").init()).data[language];
	const commandTranslations = await new Translations(`cmd_${command.name}`).init();

	if (interaction.channel.type === "DM") return interaction.followUp(translations.strings.command_in_dm());

	const NOW = Date.now();

	// Check admin permissions
	if (command.category === "admin" && interaction.user.id !== Util.owner.id) return;

	// Check user permissions
	const userPermissions =
		interaction.member instanceof GuildMember
			? interaction.member.permissionsIn(interaction.channel.id)
			: new Permissions(BigInt(interaction.member.permissions));

	const missingUserPermissions = command.userPermissions.filter((permission) => !userPermissions.has(permission));

	if (missingUserPermissions.length && interaction.user.id !== Util.owner.id)
		return interaction
			.followUp(translations.strings.user_missing_permissions(missingUserPermissions.join("`, `")))
			.catch(console.error);

	// Check bot permissions
	const missingBotPermissions = command.botPermissions.filter(
		(permission) => !interaction.guild.me.permissionsIn(interaction.channel.id).has(permission),
	);

	if (missingBotPermissions.length)
		return interaction
			.followUp(translations.strings.bot_missing_permissions(missingBotPermissions.join("`, `")))
			.catch(console.error);

	// Check if the user is in the same voice channel as the bot
	if (
		command.voice &&
		(!(interaction.member as GuildMember).voice.channelId ||
			(Util.musicPlayer.get(interaction.guild.id) &&
				(interaction.member as GuildMember).voice.channelId !==
					Util.musicPlayer.get(interaction.guild.id).voiceChannel.id))
	)
		return interaction.followUp(translations.strings.not_in_vc());

	// Check if the bot is currently playing music
	if (command.voicePlaying && !Util.musicPlayer.isPlaying(interaction.guild.id))
		return interaction.followUp(translations.strings.no_music());

	let cooldownReduction = 0;

	if (command.name === "catch") {
		const {
			rows: [userUpgrades],
		}: { rows: DatabaseUpgrades[] } = await Util.database.query(
			"SELECT catch_cooldown_reduction FROM upgrades WHERE user_id = $1",
			[interaction.user.id],
		);

		if (userUpgrades) cooldownReduction += 30 * userUpgrades.catch_cooldown_reduction;
	}

	const cooldownAmount = ((command.cooldown ?? 2) - cooldownReduction) * 1000;
	if (command.cooldowns.has(interaction.user.id)) {
		const expirationTime = command.cooldowns.get(interaction.user.id) + cooldownAmount;

		if (NOW < expirationTime) {
			const timeLeft = Math.ceil((expirationTime - NOW) / 1000);
			const timeLeftHumanized = new Date((timeLeft % 86400) * 1000)
				.toUTCString()
				.replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, "$1h $2m $3s")
				.replace(/00h |00m /g, "");

			return interaction.followUp(translations.strings.cooldown(timeLeftHumanized, command.name)).catch(console.error);
		}
	}

	command.cooldowns.set(interaction.user.id, NOW);
	setTimeout(() => command.cooldowns.delete(interaction.user.id), cooldownAmount);

	command.runInteraction(interaction, commandTranslations.data[language]).catch((err) => {
		console.error(err);
		interaction.followUp(translations.strings.error()).catch(console.error);
	});
}
