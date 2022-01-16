import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import LanguageStrings from "../../types/structures/LanguageStrings";
import Util from "../../Util";



const command: Command = {
	name: "balance",
	description: {
		fr: "Vérifier l'argent que tu possèdes",
		en: "Check how much money you have"
	},
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],
	
	options: {
		fr: [
			{
				name: "user",
				description: "Un utilisateur dont tu veux voir l'argent",
				type: "USER",
				required: false
			}
		],
		en: [
			{
				name: "user",
				description: "A user whose balance you want to see",
				type: "USER",
				required: false
			}
		]
	},
	
	run: async (interaction: CommandInteraction, languageStrings: LanguageStrings) => {
		const DAY_IN_MS = 1000 * 60 * 60 * 24;
		const NOW = Date.now();

		const user = interaction.options.getUser("user")
			?? interaction.user;
		
		const { rows: [ userCurrency ] } = await Util.database.query(
			"SELECT * FROM currency WHERE user_id = $1",
			[ user.id ]
		);

		const { money, last_daily } = userCurrency
			?? {
				money: 0,
				last_daily: null
			};
		
		const nextDaily = last_daily
			? Date.parse(last_daily) + DAY_IN_MS
			: NOW;

		interaction.reply({
			embeds: [
				{
					author: {
						name: languageStrings.data.title(user.tag),
						iconURL: user.displayAvatarURL({ dynamic: true })
					},
					color: interaction.guild.me.displayColor,
					description: languageStrings.data.description(
						money,
						nextDaily > NOW
							? Math.round(nextDaily / 1000).toString()
							: null
					),
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			]
		});
	}
};



export default command;