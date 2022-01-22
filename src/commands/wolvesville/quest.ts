import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import LanguageStrings from "../../types/structures/LanguageStrings";
import Util from "../../Util";

import { CollectorFilter, GuildMember, TextChannel } from "discord.js";



const command: Command = {
	name: "quest",
	description: {
		fr: "Afficher un message de vote pour les quêtes Wolvesville",
		en: "Display a voting message for Wolvesville quests"
	},
	userPermissions: [],
	botPermissions: ["EMBED_LINKS", "ADD_REACTIONS"],
	guildIds: ["689164798264606784"],

	options: {
		fr: [
			{
				name: "votes",
				description: "Le nombre de quêtes du vote",
				type: "INTEGER",
				required: false,
				minValue: 0,
				maxValue: 10
			},
			{
				name: "single",
				description: "Si chaque membre dispose d'un seul vote ou non",
				type: "BOOLEAN",
				required: false
			}
		],
		en: [
			{
				name: "votes",
				description: "The number of quests",
				type: "INTEGER",
				required: false,
				minValue: 0,
				maxValue: 10
			},
			{
				name: "single",
				description: "Whether each member only has one vote or not",
				type: "BOOLEAN",
				required: false
			}
		]
	},
	
	run: async (interaction: CommandInteraction, languageStrings: LanguageStrings) => {
		if (
			!(interaction.member as GuildMember).roles.cache.has("696751852267765872") &&	// Chef
			!(interaction.member as GuildMember).roles.cache.has("696751614177837056")	// Sous-chef
		) return interaction.reply({
			content: languageStrings.data.not_allowed(),
			ephemeral: true
		});
		
		if (!["707304882662801490", "689212233439641649"].includes(interaction.channel.id))
			return interaction.reply({
				content: languageStrings.data.wrong_channel(),
				ephemeral: true
			});
	
		const questChannel = interaction.client.channels.cache.get("689385764219387905") as TextChannel;

		interaction.reply(
			languageStrings.data.await_image()
		);

		const filter: CollectorFilter<[Message]> = msg => msg.author.id === interaction.user.id && msg.attachments.size === 1;
		const collected = await interaction.channel.awaitMessages({ filter, idle: 120_000, max: 1 });
		if (!collected.size) return;
		
		const imageURL = collected.first().attachments.first().url;
		const votes = interaction.options.getBoolean("single") ? "Un seul vote" : "Plusieurs votes";
		const reactions = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"]
			.slice(0, interaction.options.getInteger("votes") ?? 3);
		
		const msg = await questChannel.send({
			content: "<@&689169027922526235>",
			embeds: [
				{
					title: languageStrings.data.title(),
					color: interaction.guild.me.displayColor,
					image: {
						url: imageURL
					},
					footer: {
						text: votes
					}
				}
			]
		});
		
		reactions.forEach(async e => await msg.react(e).catch(console.error));
		await msg.react("🔄").catch(console.error);

		collected.first().react("✅").catch(console.error);
	}
};



export default command;