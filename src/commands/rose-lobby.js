const { Message, TextChannel } = require("discord.js");

const command = {
	name: "rose-lobby",
	description: "Ajouter une réaction au message d'annonce de la game de roses",
	aliases: ["rose"],
	args: 1,
	usage: "react [<ID message>] | end",
	botPerms: ["ADD_REACTIONS", "USE_EXTERNAL_EMOJIS", "MANAGE_MESSAGES", "MANAGE_ROLES"],
	onlyInGuilds: ["689164798264606784"],
	category: "wolvesville",
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	run: async (message, args, options, language, languageCode) => {
		const { CronJob } = require("cron");
		const { TIMEZONE } = require("../config.json");

		/**@type {TextChannel} */
		const announcementChannel = message.guild.channels.cache.get("817365433509740554");
		/**@type {TextChannel} */
		const logChannel = message.client.channels.cache.get("856901268445069322");
		if (message.channel.id !== announcementChannel.id) return;

		const subCommand = args[0].toLowerCase();

		switch (subCommand) {
			case "react":
				await message.delete();
				const msg = args[1]
					? (await announcementChannel.messages.fetch(args[1]).catch(console.error))
					: (await announcementChannel.messages.fetch({ limit: 1 })).first();
				if (!msg) return message.reply("ID invalide")
					.then(m => m.delete({ timeout: 4000 }).catch(console.error))
					.catch(console.error);
				
				msg.react("833620353133707264").catch(console.error);

				let timestamp = secondstoTimestamp(msg.content.match(/<t:(\d+)(?::[tTdDfFR])?>/));
				let password;

				if (!timestamp) await chooseTime();
				await choosePassword();

				const finalMsg = await message.author.send({
					embed: {
						author: {
							name: "Game de roses",
							iconURL: message.client.user.displayAvatarURL()
						},
						color: message.guild.me.displayColor,
						description: `**Le :** \`<t:${timestamp / 1000}>\`\n**Mot de passe :** \`${password}\``,
						footer: {
							text: "✨ Mayze ✨"
						}
					}
				}).catch(console.error);
				if (!finalMsg) return;

				await finalMsg.react("✅").catch(console.error);
				await finalMsg.react("⏱️").catch(console.error);
				await finalMsg.react("#️⃣").catch(console.error);

				const reactionFilter = (reaction, user) => !user.bot && ["✅", "⏱️", "#️⃣"].includes(reaction.emoji.name);
				const collector = finalMsg.createReactionCollector(reactionFilter);

				collector.on("collect", (reaction, user) => {
					switch (reaction.emoji.name) {
						case "✅":
							const date = new Date(timestamp);
							if (Date.now() > date.valueOf()) return message.author.send("L'heure est déjà dépassée").catch(console.error);
							if (message.client.roseTimer) message.client.roseTimer.stop();
							message.client.roseTimer = new CronJob(date, () => {
								announcementChannel.send(`<@&833620668066693140>\nLa game de roses va démarrer, le mot de passe est \`${password}\``).catch(console.error);
								logChannel.messages.fetch({ limit: 1 }).then(messages => {
									const logMessage = messages.first();
									logMessage.edit(`~~${logMessage.content}~~`).catch(console.error);
								});
							});
							message.client.roseTimer.start();
							collector.stop();
							message.author.send("Partie enregistrée").catch(console.error);

							logChannel.send(`**Starting at:** \`${date.toUTCString()}\`\n**Password:** \`${password}\``).catch(console.error);
							break;
						case "⏱️":
							chooseTime(true);
							break;
						case "#️⃣":
							choosePassword(true);
							break;
					}
				});

				function secondstoTimestamp(match) {
					if (!match) return;
					return parseInt(match[1]) * 1000;
				}

				async function chooseTime(del) {
					const m = await message.author.send("À quelle heure doit commencer la game de roses ? (`<t:...>`)").catch(console.error);
					if (!m) return message.reply("je n'ai pas pu te DM. As-tu désactivé les DM ?").catch(console.error);
					const filter = rep => /<t:\d+(:[tTdDfFR])?>/.test(rep.content);
					const collected = await m.channel.awaitMessages(filter, { max: 1 }).catch(console.error);
					time = collected.first().content;
					timestamp = secondstoTimestamp(time.match(/<t:(\d+)(?::[tTdDfFR])?>/));

					if (del) {
						m.delete().catch(console.error);
						await updateFinalMsg();
					}
				}

				async function choosePassword(del) {
					const m = await message.author.send("Quel sera le mot de passe de la game ?").catch(console.error);
					if (!m) return message.reply("je n'ai pas pu te DM. As-tu désactivé les DM ?").catch(console.error);
					const filter = rep => /.{1,12}/.test(rep.content);
					const collected = await m.channel.awaitMessages(filter, { max: 1 }).catch(console.error);
					password = collected.first().content.toUpperCase();

					if (del) {
						m.delete().catch(console.error);
						await updateFinalMsg();
					}
				}

				async function updateFinalMsg() {
					await finalMsg.edit({
						embed: {
							author: {
								name: "Game de roses",
								iconURL: message.client.user.displayAvatarURL()
							},
							color: message.guild.me.displayColor,
							description: `**Le :** \`<t:${Math.round(timestamp / 1000)}>\`\n**Mot de passe :** \`${password}\``,
							footer: {
								text: "✨ Mayze ✨"
							}
						}
					}).catch(console.error);
				}

				function getTimezoneOffset(tz) {
					const d = new Date();
					const parts = d.toLocaleString("ja", { timeZone: tz }).split(/[/\s:]/);
					parts[1]--;
		
					const utcDate = Date.UTC(...parts);
					const tzDate = new Date(d).setMilliseconds(0);
					return (utcDate - tzDate) / 60 / 60 / 1000;
				}

				function getDate(hourTime) {
					const [ , hour, minutes = 0 ] = hourTime.match(/(\d{1,2})h(\d{2})?/) || [];
					const dateWithoutOffset = new Date();
					dateWithoutOffset.setUTCHours(hour);
					dateWithoutOffset.setUTCMinutes(minutes);
					dateWithoutOffset.setUTCSeconds(0);
					dateWithoutOffset.setUTCMilliseconds(0);

					const offset = getTimezoneOffset(TIMEZONE);
					const dateString = dateWithoutOffset.toISOString().replace(/Z$/, (offset > 0 ? "+" : "-") + Math.abs(offset).toString().padStart(2, "0") + ":00")
					
					return new Date(dateString);
				}
				break;
			case "end":
				message.channel.startTyping(1);
				const msgs = await announcementChannel.messages.fetch({ limit: 100 }).catch(console.error);
				if (msgs) await Promise.all(msgs.filter(m => m.reactions.cache.has("833620353133707264"))
					.map(async m => await m.reactions.cache.get("833620353133707264").remove().catch(console.error))
				);

				await Promise.all(message.guild.members.cache.filter(m => m.roles.cache.has("833620668066693140"))
					.map(async member => await member.roles.remove("833620668066693140").catch(console.error))
				);

				message.channel.stopTyping();
				message.channel.send("Game de roses terminée. Tous les rôles ont été retirés").catch(console.error);
				break;
			default:
				message.reply("arguments incorrects").catch(console.error);
		}

	}
};

module.exports = command;