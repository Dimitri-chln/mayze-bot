import { CommandData } from "../../structures/commands/Command";
import {
	ApplicationCommandOptionType,
	CollectorFilter,
	Message,
	PermissionFlagsBits,
	PermissionsBitField,
} from "discord.js";
import Util from "../../Util";

import sleep from "../../utils/misc/sleep";

const command: CommandData = {
	name: "slot-machine",
	aliases: ["slots"],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField([
		PermissionFlagsBits.EmbedLinks,
		PermissionFlagsBits.UseExternalEmojis,
		PermissionFlagsBits.ModerateMembers,
		PermissionFlagsBits.ManageRoles,
		PermissionFlagsBits.KickMembers,
	]),
	cooldown: 5,
	allowedGuildIds: [Util.config.MAIN_GUILD_ID],

	options: [],

	async run(input, args, localizations) {
		const SPINNING = input.client.emojis.cache.get("845009613664288769").toString();
		const SLOTS = ["🥊", "⛓️", "🔇", "🏓", "🔒"];

		const result = [];

		const embed = {
			author: {
				name: localizations.author.format(input.locale),
				icon_url: input.user.displayAvatarURL(),
			},
			color: input.guild.members.me.displayColor,
			description: `${SPINNING} ${SPINNING} ${SPINNING}`,
			footer: {
				text: Util.config.DEFAULT_EMBED_FOOTER_TEXT,
			},
		};

		await sleep(2_000);
		embed.description = `${randomSlot()} ${SPINNING} ${SPINNING}`;
		input.editReply({
			embeds: [embed],
		});

		await sleep(2_000);
		embed.description = `${result[0]} ${randomSlot()} ${SPINNING}`;
		input.editReply({
			embeds: [embed],
		});

		await sleep(2_000);
		embed.description = `${result[0]} ${result[1]} ${randomSlot()}`;
		input.editReply({
			embeds: [embed],
		});

		if (result[0] !== result[1] || result[1] !== result[2]) return;

		await sleep(2_000);

		switch (result[0]) {
			case "🥊": {
				if (input.member.roles.highest.position >= input.guild.members.me.roles.highest.position) return;
				if (input.member.premiumSinceTimestamp) return;

				input.member.kick(localizations.reason.format(input.locale));
				break;
			}

			case "⛓️": {
				if (input.member.roles.highest.position >= input.guild.members.me.roles.highest.position) return;

				const jailRoleId = Util.guildConfigs.get(input.guild.id).jailRoleId;
				if (jailRoleId) return;

				const jailRole = input.guild.roles.cache.get(jailRoleId);
				const unJailedRoles = input.member.roles.cache.filter((role) =>
					input.guild.roles.cache.some((r) => r.name === role.name + " (Jailed)"),
				);
				const jailedRoles = input.guild.roles.cache.filter((role) =>
					input.member.roles.cache.some((r) => role.name === r.name + " (Jailed)"),
				);

				jailedRoles.set(jailRole.id, jailRole);

				await input.member.roles.remove(unJailedRoles).catch(console.error);
				await input.member.roles.add(jailedRoles).catch(console.error);
				break;
			}

			case "🔇": {
				if (input.member.roles.highest.position >= input.guild.members.me.roles.highest.position) return;

				const duration = Math.ceil(Math.random() * 10) * 60 * 1000; // Between 1 and 10 minutes

				input.member.timeout(duration, localizations.reason.format(input.locale));
				break;
			}

			case "🏓": {
				input.reply(localizations.spam_ping.format(input.locale));

				const filter: CollectorFilter<[Message]> = (message) =>
					message.author.id === input.user.id && message.mentions.users.size > 0;

				const collected = await input.channel
					.awaitMessages({
						filter,
						max: 1,
						time: 120_000,
					})
					.catch(console.error);

				if (!collected || !collected.size) {
					await input.reply(localizations.too_late.format(input.locale));
					return;
				}

				const user = collected.first().mentions.users.first();
				const messages: Promise<Message>[] = [];

				for (let i = 0; i < 25; i++) {
					messages.push(
						new Promise((resolve, reject) => {
							input.channel
								.send(user.toString())
								.then((msg) => resolve(msg))
								.catch(() => resolve(null));
						}),
					);
				}

				input.channel.bulkDelete(
					(await Promise.all(messages)).filter((msg) => msg),
					true,
				);
				break;
			}

			case "🔒": {
				input.reply(localizations.timeout.format(input.locale));

				const filter: CollectorFilter<[Message]> = (msg) =>
					msg.author.id === input.user.id && msg.mentions.members.size > 0;

				const collected = await input.channel
					.awaitMessages({
						filter,
						max: 1,
						time: 120_000,
					})
					.catch(console.error);

				if (!collected || !collected.size) {
					await input.reply(localizations.too_late.format(input.locale));
					return;
				}

				const member = collected.first().mentions.members.first();
				await member.timeout(120_000);

				input.reply(localizations.timed_out.format(input.locale));
				break;
			}
		}

		function randomSlot() {
			const random = SLOTS[Math.floor(Math.random() * SLOTS.length)];
			SLOTS.push(random, random); // Increase the probability of winning this slot
			result.push(random);
			return random;
		}
	},
};

export default command;
