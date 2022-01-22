import Path from "path";
import { CommandInteraction, GuildMember, Permissions } from "discord.js";
import Util from "../../Util";
import Command from "../../types/structures/Command";
import LanguageStrings from "../../types/structures/LanguageStrings";



export default async function runApplicationCommand(command: Command, interaction: CommandInteraction) {
	const language = Util.languages.get(interaction.guild.id);
	const languageStrings = new LanguageStrings(__filename, language);
	const commandFileName = Path.basename(command.path, Path.extname(command.path));
	const commandLanguageString = new LanguageStrings(commandFileName, language);

	const now = Date.now();

	const channelCooldown = Util.channelCooldowns.get(interaction.channel.id)
		?? {
			numberOfMessages: 0,
			lastMessageTimestamp: 0
		};
	
	if (channelCooldown.numberOfMessages === 0) setTimeout(() => Util.channelCooldowns.delete(interaction.channel.id), 10000);
	if (channelCooldown.numberOfMessages >= 5) return;
	if (now - channelCooldown.lastMessageTimestamp < 500) return;
	
	Util.channelCooldowns.set(interaction.channel.id,
		{
			numberOfMessages: channelCooldown.numberOfMessages + 1,
			lastMessageTimestamp: now
		}
	);

	if (command.category === "admin" && interaction.user.id !== Util.owner.id) return;

	const userPermissions = interaction.member instanceof GuildMember
		? interaction.member.permissionsIn(interaction.channel.id)
		: new Permissions(BigInt(interaction.member.permissions));
	
	const missingUserPermissions = command.userPermissions.filter(permission => !userPermissions.has(permission));

	if (missingUserPermissions.length && interaction.user.id !== Util.owner.id)
		return interaction.reply({
			content: languageStrings.data.user_missing_permissions(missingUserPermissions.join("`, `")),
			ephemeral: true
		}).catch(console.error);
	
	const missingBotPermissions = command.botPermissions.filter(permission => !interaction.guild.me.permissionsIn(interaction.channel.id).has(permission));
	
	if (missingBotPermissions.length)
		return interaction.reply({
			content: languageStrings.data.bot_missing_perms(missingBotPermissions.join("`, `")),
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
		
		if (now < expirationTime) {
			const timeLeft = Math.ceil((expirationTime - now) / 1000);
			const timeLeftHumanized = new Date((timeLeft % 86400) * 1000)
				.toUTCString()
				.replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, "$1h $2m $3s")
				.replace(/00h |00m /g, "");
			
			return interaction.reply({
				content: languageStrings.data.cooldown(timeLeftHumanized, Util.prefix + command.name),
				ephemeral: true
			}).catch(console.error);
		}
	}

	command.cooldowns.set(interaction.user.id, now);
	setTimeout(() => command.cooldowns.delete(interaction.user.id), cooldownAmount);

	command.run(interaction, commandLanguageString)
		.catch(err => {
			console.error(err);
			if (interaction.replied)
				interaction.channel.send(languageStrings.data.error()).catch(console.error);
			else
				interaction.reply(languageStrings.data.error()).catch(console.error);
		});
}