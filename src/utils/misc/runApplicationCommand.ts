import Path from "path";
import { CommandInteraction, GuildMember, Permissions } from "discord.js";
import Util from "../../Util";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";



export default async function runApplicationCommand(command: Command, interaction: CommandInteraction) {
	const language = Util.languages.get(interaction.guild.id);
	const translations = await new Translations("run", language).init();
	const commandTranslations = new Translations(`cmd_${command.name}`, language);
	const NOW = Date.now();

	const channelCooldown = Util.channelCooldowns.get(interaction.channel.id)
		?? {
			numberOfMessages: 0,
			lastMessageTimestamp: 0
		};
	
	if (channelCooldown.numberOfMessages === 0) setTimeout(() => Util.channelCooldowns.delete(interaction.channel.id), 10000);
	if (channelCooldown.numberOfMessages >= 5) return;
	if (NOW - channelCooldown.lastMessageTimestamp < 500) return;
	
	Util.channelCooldowns.set(interaction.channel.id,
		{
			numberOfMessages: channelCooldown.numberOfMessages + 1,
			lastMessageTimestamp: NOW
		}
	);

	if (command.category === "admin" && interaction.user.id !== Util.owner.id) return;

	const userPermissions = interaction.member instanceof GuildMember
		? interaction.member.permissionsIn(interaction.channel.id)
		: new Permissions(BigInt(interaction.member.permissions));
	
	const missingUserPermissions = command.userPermissions.filter(permission => !userPermissions.has(permission));

	if (missingUserPermissions.length && interaction.user.id !== Util.owner.id)
		return interaction.reply({
			content: translations.data.user_missing_permissions(missingUserPermissions.join("`, `")),
			ephemeral: true
		}).catch(console.error);
	
	const missingBotPermissions = command.botPermissions.filter(permission => !interaction.guild.me.permissionsIn(interaction.channel.id).has(permission));
	
	if (missingBotPermissions.length)
		return interaction.reply({
			content: translations.data.bot_missing_perms(missingBotPermissions.join("`, `")),
			ephemeral: true
		}).catch(console.error);

	let cooldownReduction = 0;
		
	if (command.name === "catch") {
		const { rows } = await Util.database.query(
				"SELECT catch_cooldown_reduction FROM upgrades WHERE user_id = $1",
				[ interaction.user.id ]
		);

		if (rows.length) cooldownReduction += 30 * rows[0].catch_cooldown_reduction;
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
			
			return interaction.reply({
				content: translations.data.cooldown(timeLeftHumanized, command.name),
				ephemeral: true
			}).catch(console.error);
		}
	}

	command.cooldowns.set(interaction.user.id, NOW);
	setTimeout(() => command.cooldowns.delete(interaction.user.id), cooldownAmount);

	command.run(interaction, commandTranslations)
		.catch(err => {
			console.error(err);
			if (interaction.replied)
				interaction.channel.send(translations.data.error()).catch(console.error);
			else
				interaction.reply(translations.data.error()).catch(console.error);
		});
}