import { GuildMember, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "test",
	aliases: [],
	description: {
		fr: "Une commande de test",
		en: "A test command",
	},
	usage: "",
	userPermissions: [],
	botPermissions: [],

	options: {
		fr: [],
		en: [],
	},

	runInteraction: async (interaction, translations) => {
		const roleId = (interaction.member as GuildMember).roles.cache.first().id;

		interaction.channel.send({
			content: `<@&${roleId}> 1 `,
		});

		interaction.channel.send({
			content: `<@&${roleId}> 2`,
			allowedMentions: {
				roles: [roleId],
			},
		});
	},
};

export default command;
