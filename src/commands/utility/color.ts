import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import { GuildMember } from "discord.js";

const command: Command = {
	name: "color",
	aliases: [],
	description: {
		fr: "Modifier la couleur de ton pseudo",
		en: "Modify the color of your nickname",
	},
	usage: "",
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],
	guildIds: [Util.config.MAIN_GUILD_ID],
	ephemeralReply: true,

	options: {
		fr: [
			{
				name: "name",
				description: "Le nom de la couleur",
				type: "STRING",
				required: true,
				autocomplete: true,
			},
		],
		en: [
			{
				name: "name",
				description: "The name of the color",
				type: "STRING",
				required: true,
				autocomplete: true,
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const roleId = interaction.options.getString("name", true);
		const role = interaction.guild.roles.cache.get(roleId);

		const topRole = interaction.guild.roles.cache.get("818531980480086086");
		const bottomRole = interaction.guild.roles.cache.get("735809874205737020");

		const colorRoles = interaction.guild.roles.cache.filter(
			(role) => role.position > bottomRole.position && role.position < topRole.position,
		);

		await (interaction.member as GuildMember).roles.remove(colorRoles);
		await (interaction.member as GuildMember).roles.add(role);

		interaction.followUp(translations.strings.updated());
	},
};

export default command;
