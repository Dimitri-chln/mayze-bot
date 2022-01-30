import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";

import { Collection, CollectorFilter, GuildMember, TextChannel } from "discord.js";



const command: Command = {
	name: "slots",
	description: {
		fr: "Joue à une partie de casino",
		en: "Play a slots game",
	},
	userPermissions: [],
	botPermissions: ["EMBED_LINKS", "MANAGE_ROLES", "KICK_MEMBERS"],
	cooldown: 5,
	guildIds: ["689164798264606784"],
	
	options: {
		fr: [],
		en: []
	},
	
	run: async (interaction: CommandInteraction, translations: Translations) => {
		const SPINNING = "<a:slots:845009613664288769>";
		const SLOTS = ["🥊", "⛓️", "🔇", "🏓", "🔒"];
		
		const result = [];

		const reply = await interaction.reply({
			embeds: [
				{
					author: {
						name: translations.data.title(),
						iconURL: interaction.user.displayAvatarURL({ dynamic: true })
					},
					color: interaction.guild.me.displayColor,
					description: SPINNING + SPINNING + SPINNING,
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			],
			fetchReply: true
		}) as Message;

		setTimeout(() => {
			interaction.editReply({
				embeds: [ reply.embeds[0].setDescription(randomSlot() + SPINNING + SPINNING) ]
			});
			
			setTimeout(() => {
				interaction.editReply({
					embeds: [ reply.embeds[0].setDescription(result[0] + randomSlot() + SPINNING) ]
				});

				setTimeout(() => {
					interaction.editReply({
						embeds: [ reply.embeds[0].setDescription(result[0] + result[1] + randomSlot()) ]
					});

					setTimeout(async () => {
						if (result[0] !== result[1] || result[1] !== result[2]) return;

						switch (result[0]) {
							case "🥊": {
								if (
									(interaction.member as GuildMember).roles.highest.position < interaction.guild.me.roles.highest.position &&
									!(interaction.member as GuildMember).premiumSinceTimestamp
								) (interaction.member as GuildMember).kick(translations.data.reason());
								break;
							}
							
							case "⛓️": {
								if (interaction.channel.id === "695934227140837386") return;
								
								const jailedRole = interaction.guild.roles.cache.get("695943648235487263");
								const unJailedRoles = (interaction.member as GuildMember).roles.cache.filter(role => interaction.guild.roles.cache.some(r => r.name === role.name + " (Jailed)"));
								const jailedRoles = interaction.guild.roles.cache.filter(role => (interaction.member as GuildMember).roles.cache.some(r => role.name === r.name + " (Jailed)"));
								jailedRoles.set(jailedRole.id, jailedRole);

								await (interaction.member as GuildMember).roles.remove(unJailedRoles).catch(console.error);
								await (interaction.member as GuildMember).roles.add(jailedRoles).catch(console.error);
								break;
							}

							case "🔇": {
								const duration = Math.ceil(Math.random() * 10) * 60 * 1000;
								(interaction.member as GuildMember).timeout(duration, translations.data.reason());
								break;
							}

							case "🏓": {
								interaction.followUp({
									content: translations.data.spam_ping(),
									ephemeral: true
								});

								const filter: CollectorFilter<[Message]> = msg => msg.author.id === interaction.user.id && msg.mentions.users.size > 0;
								const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 120_000 });

								if (!collected || !collected.size) return interaction.followUp({
									content: translations.data.too_late(),
									ephemeral: true,
									allowedMentions: {
										repliedUser: false
									}
								});

								const messages: Promise<Message>[] = [];
								
								for (let i = 0; i < 25; i++) {
									messages.push(new Promise((resolve, reject) => {
										interaction.channel.send(collected.first().mentions.users.first().toString())
											.then(msg => resolve(msg))
											.catch(() => resolve(null))
									}));
								}

								(interaction.channel as TextChannel).bulkDelete(
									(await Promise.all(messages)).filter(msg => msg),
									true
								);
								break;
							}

							case "🔒": {
								interaction.followUp({
									content: translations.data.timeout(),
									ephemeral: true
								});

								const filter: CollectorFilter<[Message]> = msg => msg.author.id === interaction.user.id && msg.mentions.users.size > 0;
								const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 120_000 });

								if (!collected || !collected.size) return interaction.followUp({
									content: translations.data.too_late(),
									ephemeral: true,
									allowedMentions: {
										repliedUser: false
									}
								});

								interaction.guild.members.cache.get(
									collected.first().mentions.users.first().id
								).timeout(120_000);
								break;
							}
						}
					}, 2000);
				}, 2000);
			}, 2000);
		}, 2000);

		
		function randomSlot() {
			const random = SLOTS[Math.floor(Math.random() * SLOTS.length)];
			SLOTS.push(random);
			result.push(random);
			return random;
		}
	}
};



export default command;