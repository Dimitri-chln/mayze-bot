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
		if ((interaction.member as GuildMember).roles.cache.has("689169136374644752")) {
			interaction.followUp({ content: "T'es puni", ephemeral: true });
			return;
		}

		const roleId = interaction.options.getString("name", true);
		const role = interaction.guild.roles.cache.get(roleId);

		await (interaction.member as GuildMember).roles.remove(Util.colorRoles);
		await (interaction.member as GuildMember).roles.add(role);

		interaction.followUp({ content: translations.strings.updated(), ephemeral: true });
	},
};

export default command;
