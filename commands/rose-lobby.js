const { Message, Collection, TextChannel } = require("discord.js");

const command = {
	name: "rose-lobby",
	description: "Ajouter une réaction au message d'annonce de la game de roses",
	aliases: ["rose"],
	args: 1,
	usage: "react [<ID message>] | end",
	onlyInGuilds: ["689164798264606784"],
	disableSlash: true,
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const { CronJob } = require("cron");

		/**@type {TextChannel} */
		const channel = message.guild.channels.cache.get("817365433509740554");
		if (message.channel.id !== channel.id) return;

		const subCommand = args[0].toLowerCase();

		switch (subCommand) {
			case "react":
				await message.delete();
				const msg = args[1]
					? (await channel.messages.fetch(args[1]).catch(console.error))
					: (await channel.messages.fetch({ limit: 1 })).first();
				if (!msg) return message.reply("ID invalide")
					.then(m => m.delete({ timeout: 4000 }).catch(console.error))
					.catch(console.error);
				
				msg.react("833620353133707264").catch(console.error);

				let [ , hour ] = msg.content.match(/\*\*([0-5]?\dh(?:[0-5]\d)?)\*\*/) || [];
				let password;
				if (!hour) await chooseHour();
				await choosePassword();

				const finalMsg = await message.author.send({
					embed: {
						author: {
							name: "Game de roses",
							icon_url: message.client.user.avatarURL()
						},
						color: message.guild.me.displayColor,
						description: `**Heure :** \`${hour}\`\n**Mot de passe :** \`${password}\``,
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
							const date = getDate(hour);
							if (Date.now() > date.valueOf()) return message.author.send("L'heure est déjà dépassée").catch(console.error);
							const job = new CronJob(date, () => channel.send(`<@&833620668066693140>, la game de roses va démarrer. Le mot de passe est ||${password}||`).catch(console.error));
							job.start();
							collector.stop();
							message.author.send("Partie enregistrée").catch(console.error);
							break;
						case "⏱️":
							chooseHour(true);
							break;
						case "#️⃣":
							choosePassword(true);
							break;
					}
				});

				async function chooseHour(del) {
					const m = await message.author.send("À quelle heure doit commencer la game de roses ?").catch(console.error);
					if (!m) return message.reply("je n'ai pas pu te DM. As-tu désactivé les DM ?").catch(console.error);
					const filter = rep => /[0-5]?\dh(?:[0-5]\d)?/.test(rep.content);
					const collected = await m.channel.awaitMessages(filter, { max: 1 }).catch(console.error);
					hour = collected.first().content;

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
					password = collected.first().content;

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
								icon_url: message.client.user.avatarURL()
							},
							color: message.guild.me.displayColor,
							description: `**Heure :** \`${hour}\`\n**Mot de passe :** \`${password}\``,
							footer: {
								text: "✨ Mayze ✨"
							}
						}
					}).catch(console.error);
				}

				function getDate(hour) {
					hour = /^\dh/.test(hour) ? "0" + hour : hour;
					hour = hour.endsWith("h") ? hour + "00:00" : hour + ":00";
					hour = hour.replace("h", ":");
					return new Date(new Date().toISOString().replace(/\d{2}:\d{2}:\d{2}(?:[\.,]\d+)?Z/, hour + "+02:00"));
				}
				break;
			case "end":
				message.channel.startTyping(1);
				const msgs = await channel.messages.fetch({ limit: 100 }).catch(console.error);
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