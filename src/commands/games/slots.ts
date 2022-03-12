import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import { CollectorFilter, GuildMember, TextChannel } from "discord.js";
import { sleep } from "../../utils/misc/sleep";

const command: Command = {
	name: "slots",
	aliases: [],
	description: {
		fr: "Joue à une partie de casino",
		en: "Play a slots game",
	},
	usage: "",
	userPermissions: [],
	botPermissions: ["EMBED_LINKS", "MANAGE_ROLES", "KICK_MEMBERS"],
	cooldown: 5,
	guildIds: [Util.config.MAIN_GUILD_ID],

	options: {
		fr: [],
		en: [],
	},

	runInteraction: async (interaction, translations) => {
		const SPINNING = interaction.client.emojis.cache.get("845009613664288769").toString();
		const SLOTS = ["🥊", "⛓️", "🔇", "🏓", "🔒"];

		const result = [];

		const reply = (await interaction.followUp({
			embeds: [
				{
					author: {
						name: translations.strings.author(),
						iconURL: interaction.user.displayAvatarURL({
							dynamic: true,
						}),
					},
					color: interaction.guild.me.displayColor,
					description: SPINNING + SPINNING + SPINNING,
					footer: {
						text: "✨ Mayze ✨",
					},
				},
			],
			fetchReply: true,
		})) as Message;

		await sleep(2_000);
		interaction.editReply({
			embeds: [reply.embeds[0].setDescription(randomSlot() + SPINNING + SPINNING)],
		});

		await sleep(2_000);
		interaction.editReply({
			embeds: [reply.embeds[0].setDescription(result[0] + randomSlot() + SPINNING)],
		});

		await sleep(2_000);
		interaction.editReply({
			embeds: [reply.embeds[0].setDescription(result[0] + result[1] + randomSlot())],
		});

		await sleep(2_000);
		if (result[0] !== result[1] || result[1] !== result[2]) return;

		switch (result[0]) {
			case "🥊": {
				if ((interaction.member as GuildMember).roles.highest.position >= interaction.guild.me.roles.highest.position)
					return;
				if ((interaction.member as GuildMember).premiumSinceTimestamp) return;

				(interaction.member as GuildMember).kick(translations.strings.reason());
				break;
			}

			case "⛓️": {
				if (interaction.channel.id === "695934227140837386") return;
				if ((interaction.member as GuildMember).roles.highest.position >= interaction.guild.me.roles.highest.position)
					return;

				const jailedRole = interaction.guild.roles.cache.get("695943648235487263");
				const unJailedRoles = (interaction.member as GuildMember).roles.cache.filter((role) =>
					interaction.guild.roles.cache.some((r) => r.name === role.name + " (Jailed)"),
				);
				const jailedRoles = interaction.guild.roles.cache.filter((role) =>
					(interaction.member as GuildMember).roles.cache.some((r) => role.name === r.name + " (Jailed)"),
				);
				jailedRoles.set(jailedRole.id, jailedRole);

				await (interaction.member as GuildMember).roles.remove(unJailedRoles).catch(console.error);
				await (interaction.member as GuildMember).roles.add(jailedRoles).catch(console.error);
				break;
			}

			case "🔇": {
				if ((interaction.member as GuildMember).roles.highest.position >= interaction.guild.me.roles.highest.position)
					return;

				const duration = Math.ceil(Math.random() * 10) * 60 * 1000;
				(interaction.member as GuildMember).timeout(duration, translations.strings.reason());
				break;
			}

			case "🏓": {
				interaction.followUp(translations.strings.spam_ping());

				const filter: CollectorFilter<[Message]> = (msg) =>
					msg.author.id === interaction.user.id && msg.mentions.users.size > 0;

				const collected = await interaction.channel.awaitMessages({
					filter,
					max: 1,
					time: 120_000,
				});

				if (!collected || !collected.size)
					return interaction.followUp({
						content: translations.strings.too_late(),
						ephemeral: true,
					});

				const messages: Promise<Message>[] = [];

				for (let i = 0; i < 25; i++) {
					messages.push(
						new Promise((resolve, reject) => {
							interaction.channel
								.send(collected.first().mentions.users.first().toString())
								.then((msg) => resolve(msg))
								.catch(() => resolve(null));
						}),
					);
				}

				(interaction.channel as TextChannel).bulkDelete(
					(await Promise.all(messages)).filter((msg) => msg),
					true,
				);
				break;
			}

			case "🔒": {
				interaction.followUp(translations.strings.timeout());

				const filter: CollectorFilter<[Message]> = (msg) =>
					msg.author.id === interaction.user.id && msg.mentions.members.size > 0;

				const collected = await interaction.channel.awaitMessages({
					filter,
					max: 1,
					time: 120_000,
				});

				if (!collected || !collected.size)
					return interaction.followUp({
						content: translations.strings.too_late(),
						ephemeral: true,
					});

				const member = collected.first().mentions.members.first();

				await member.timeout(120_000);

				interaction.followUp(translations.strings.timed_out(member.user.tag));
				break;
			}
		}

		function randomSlot() {
			const random = SLOTS[Math.floor(Math.random() * SLOTS.length)];
			SLOTS.push(random);
			result.push(random);
			return random;
		}
	},
};

export default command;
