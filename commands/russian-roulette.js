const command = {
	name: "russian-roulette",
	description: "Joue à la roulette russe",
	aliases: ["rr"],
	args: 1,
	usage: "create/join/start [-kick]",
	async execute(message, args) {
		const shuffle = require("../modules/shuffle.js");
		const prefix = require("../config.json").prefix[message.client.user.id];
		if (!message.client.russianRoulette) message.client.russianRoulette = [];
		switch (args[0]) {
			case "create":
				if (message.client.russianRoulette.length) {
					return message.reply("une partie est déjà en cours!").catch(console.error);
				}
				message.client.russianRoulette.push(message.author.id);
				try {
					message.channel.send({
						embed: {
							author: {
								name: "Une partie de roulette russe a été lancée!",
								icon_url: message.author.avatarURL({ dynamic: true })
							},
							color: "#010101",
							description:
								`Rejoins la partie avec la commande \`${prefix}russian-roulette join\``,
							footer: {
								text: "✨Mayze✨"
							}
						}
					});
				} catch (err) { console.log(err); }
				break;
			case "join":
				if (!message.client.russianRoulette.length) {
					return message.reply(`il n'y a pas de partie en cours! Crée une partie avec la commande\`${prefix}russian-roulette create\``).catch(console.error);
				}
				if (message.client.russianRoulette.includes(message.author.id)) {
					return message.reply("tu as déjà rejoint cette partie").catch(console.error);
				}
				message.client.russianRoulette.push(message.author.id);
				message.channel.send(`<@${message.author.id}> a rejoint la partie`).catch(console.error);
				break;
			case "start":
				if (!message.client.russianRoulette.length) {
					try{ message.reply(`il n'y a pas de partie en cours! Crée une partie avec la commande \`${prefix}russian-roulette create\``); }
					catch (err) { console.log(err); }
					return;
				}
				if (message.client.russianRoulette.length < 2) {
					return message.reply("il faut au minimum 2 joueurs pour lancer la partie").catch(console.error);
				}
				if (message.client.russianRoulette[0] !== message.author.id && !message.member.hasPermission("KICK_MEMBERS")) {
					return message.reply("seule la personne qui a créé la partie peut la lancer").catch(console.error);
				}
				const players = message.client.russianRoulette;
				const Discord = require("discord.js");
				const Embed = new Discord.MessageEmbed()
					.setAuthor("La partie de roulette russe a commencé!", message.author.avatarURL({ dynamic: true }))
					.setColor("#010101")
					.setFooter("✨Mayze✨")
					.setTimestamp();
					var msg;
				try { msg = await message.channel.send(Embed.setDescription("...")); }
				catch (err) { return console.log(err); }
				const deadPlayer = players[Math.floor(Math.random() * players.length)];
				var alivePlayers = players.filter(p => p !== deadPlayer);
				shuffle(alivePlayers);
				await roulette(msg, alivePlayers, deadPlayer, Embed, 0);
				message.client.russianRoulette = [];
				break;
			default:
				try{ message.reply("arguments incorrects !"); }
				catch (err) { console.log(err); }s
		}

		async function roulette(msg, alivePlayers, deadPlayer, Embed, i) {
			if (alivePlayers.length > 0 && i < 5) {
				setTimeout(async function () {
					try { msg.edit(Embed.setDescription(`${message.client.users.cache.get(alivePlayers.pop()).username} ...`)); }
					catch (err) { console.log(err); }
					roulette(msg, alivePlayers, deadPlayer, Embed, i + 1);
				}, 2000);
			} else {
				setTimeout(async function () {
					try { msg.edit(Embed.setDescription(`🔫 ${message.client.users.cache.get(deadPlayer).username} est mort !`)); }
					catch (err) { console.log(err); }
					if (args.includes("-kick")) {
						try { message.guild.members.cache.get(deadPlayer).kick("Roulette Russe"); }
						catch (err) {
							console.log(err);
							message.channel.send("Je n'ai pas pu expulser le perdant").catch(console.error);
						}
					}
				}, 2000);
		}
		}
	}
};

module.exports = command;