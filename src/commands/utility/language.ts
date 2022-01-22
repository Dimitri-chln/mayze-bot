import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import LanguageStrings from "../../types/structures/LanguageStrings";
import Util from "../../Util";



const command: Command = {
	name: "language",
	description: {
		fr: "Modifier la langue du bot sur le serverur",
		en: "Change the server's bot language"
	},
	userPermissions: ["ADMINISTRATOR"],
	botPermissions: [],
	
	options: {
		fr: [
			{
				name: "language",
				description: "La nouvelle langue du bot",
				type: "STRING",
				required: true,
				choices: [
					{
						name: "Français",
						value: "fr",
					},
					{
						name: "Anglais",
						value: "en"
					}
				]
			}
		],
		en: [
			{
				name: "language",
				description: "The new bot's language",
				type: "STRING",
				required: true,
				choices: [
					{
						name: "French",
						value: "fr",
					},
					{
						name: "English",
						value: "en"
					}
				]
			}
		]
	},
	
	run: async (interaction: CommandInteraction, languageStrings: LanguageStrings) => {
		const newLanguage = interaction.options.getString("language") as "fr" | "en";

		await Util.database.query(
			`
			INSERT INTO languages VALUES ($1, $2)
			ON CONFLICT (guild_id)
			DO UPDATE SET language = $2
			WHERE languages.guild_id = EXCLUDED.guild_id
			`,
			[ interaction.guild.id, newLanguage ]
		);

		Util.languages.set(interaction.guild.id, newLanguage);
		
		interaction.reply(
			languageStrings.data.language_updated()
		);
	}
};



export default command;