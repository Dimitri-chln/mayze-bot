import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

import { GuildMember } from "discord.js";



const command: Command = {
	name: "kick-myself",
	description: {
		fr: "T'expulse du serveur sans aucune raison",
		en: "Kicks you from the server for no reason"
	},
	userPermissions: [],
	botPermissions: ["KICK_MEMBERS"],
	guildIds: [ Util.config.MAIN_GUILD_ID, "724530039781326869" ],
	
	options: {
		fr: [],
		en: []
	},

	run: async (interaction: CommandInteraction, translations: Translations) => {
		// Server booster
        if ((interaction.member as GuildMember).premiumSinceTimestamp)
			return interaction.reply({
				content: translations.data.boosting(),
				ephemeral: true
			});

		if ((interaction.member as GuildMember).roles.highest.position >= interaction.guild.me.roles.highest.position)
			return interaction.reply({
				content: translations.data.too_high_hierarchy(),
				ephemeral: true
			});

		(interaction.member as GuildMember).kick(translations.data.reason())
			.then(() => {
				interaction.reply(
					translations.data.kick_message()
				);
			});
	}
};



export default command;