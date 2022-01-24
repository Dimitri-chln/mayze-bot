import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

import pagination, { Page } from "../../utils/misc/pagination";



const command: Command = {
	name: "palette",
	description: {
		fr: "Voir la palette de couleurs disponibles",
		en: "See the palette of availables colors"
	},
	userPermissions: [],
	botPermissions: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
	
	options: {
		fr: [],
		en: []
	},
	
	run: async (interaction: CommandInteraction, translations: Translations) => {
		const pages: Page[] = [];
		
		for (const [ name, palette ] of Util.palettes) {
			const page: Page = {
				embeds: [
					{
						author: {
							name: translations.data.title(),
							iconURL: interaction.client.user.displayAvatarURL()
						},
						title: translations.data.palette(name),
						color: interaction.guild.me.displayColor,
						description: palette.all().map((color, alias) => `${color.emoji} \`${alias}\` - **${color.name}** \`${color.hex}\``).join("\n")
					}
				]
			};

			pages.push(page);
		}

		pagination(interaction, pages);
	}
};



export default command;