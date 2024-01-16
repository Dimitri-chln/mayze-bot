import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "language",
	aliases: [],
	description: {
		fr: "Modifier la langue du bot sur le serverur",
		en: "Change the server's bot language",
	},
	usage: "",
	userPermissions: ["ADMINISTRATOR"],
	botPermissions: [],

	options: {
		fr: [
			{
				name: "language",
				description: "La nouvelle langue du bot",
				type: "STRING",
				required: true,
				autocomplete: true,
			},
		],
		en: [
			{
				name: "language",
				description: "The new bot's language",
				type: "STRING",
				required: true,
				autocomplete: true,
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const newLanguage = interaction.options.getString("language", true) as "fr" | "en";

		await Util.database.query(
			`
			INSERT INTO guild_config VALUES ($1, $2)
			ON CONFLICT (guild_id)
			DO UPDATE SET language = $2
			WHERE guild_config.guild_id = EXCLUDED.guild_id
			`,
			[interaction.guild.id, newLanguage],
		);

		Util.guildConfigs.set(interaction.guild.id, {
			...Util.guildConfigs.get(interaction.guild.id),
			language: newLanguage,
		});

		interaction.followUp(translations.strings.changed());
	},
};

export default command;
