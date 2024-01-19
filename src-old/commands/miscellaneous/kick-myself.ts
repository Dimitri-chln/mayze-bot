import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import { GuildMember } from "discord.js";

const command: Command = {
	name: "kick-myself",
	aliases: ["kickmyself", "kms", "4-4-2", "442"],
	description: {
		fr: "T'expulse du serveur sans aucune raison",
		en: "Kicks you from the server for no reason",
	},
	usage: "",
	userPermissions: [],
	botPermissions: ["KICK_MEMBERS"],
	guildIds: [Util.config.MAIN_GUILD_ID, "724530039781326869"],

	options: {
		fr: [],
		en: [],
	},

	runInteraction: async (interaction, translations) => {
		// Server booster
		if ((interaction.member as GuildMember).premiumSinceTimestamp)
			return interaction.followUp(translations.strings.boosting());

		if ((interaction.member as GuildMember).roles.highest.position >= interaction.guild.me.roles.highest.position)
			return interaction.followUp(translations.strings.too_high_hierarchy());

		(interaction.member as GuildMember).kick(translations.strings.reason()).then(() => {
			interaction.followUp(translations.strings.kick_message(interaction.user.tag));
		});
	},

	runMessage: async (message, args, translations) => {
		// Server booster
		if (message.member.premiumSinceTimestamp) return message.reply(translations.strings.boosting());

		if (message.member.roles.highest.position >= message.guild.me.roles.highest.position)
			return message.reply(translations.strings.too_high_hierarchy());

		message.member.kick(translations.strings.reason()).then(() => {
			message.reply(translations.strings.kick_message(message.author.tag));
		});
	},
};

export default command;
