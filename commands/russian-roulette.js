const { Message } = require("discord.js");

const command = {
	name: "russian-roulette",
	description: "Joue à la roulette russe",
	aliases: ["rr"],
	args: 1,
	usage: "create/join/start [-kick]",
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async execute(message, args) {
		if (!message.client.russianRoulette) message.client.russianRoulette = [];
		switch (args[0].toLowerCase()) {
			case "create":
				if (message.client.russianRoulette.length) return message.reply("une partie est déjà en cours!").catch(console.error);
				message.client.russianRoulette.push(message.author);
				message.channel.send({
					embed: {
						author: {
							name: "Une partie de roulette russe a été lancée!",
							icon_url: message.author.avatarURL({ dynamic: true })
						},
						color: "#010101",
						description:
							`Rejoins la partie avec la commande \`${message.client.prefix}russian-roulette join\``,
						footer: {
							text: "✨Mayze✨"
						}
					}
				}).catch(console.error);
				break;
			case "join":
				if (!message.client.russianRoulette.length) return message.reply(`il n'y a pas de partie en cours! Crée une partie avec la commande\`${message.client.prefix}russian-roulette create\``).catch(console.error);
				if (message.client.russianRoulette.includes(message.author.id)) return message.reply("tu as déjà rejoint cette partie").catch(console.error);
				message.client.russianRoulette.push(message.author);
				message.channel.send(`<@${message.author.id}> a rejoint la partie`).catch(console.error);
				break;
			case "start":
				if (!message.client.russianRoulette.length) return message.reply(`il n'y a pas de partie en cours! Crée une partie avec la commande \`${message.client.prefix}russian-roulette create\``).catch(console.error);
				if (message.client.russianRoulette.length < 2) return message.reply("il faut au minimum 2 joueurs pour lancer la partie").catch(console.error);
				if (message.client.russianRoulette[0] !== message.author.id && !message.member.hasPermission("KICK_MEMBERS")) return message.reply("seule la personne qui a créé la partie peut la lancer").catch(console.error);
				const shuffle = require("../modules/shuffle.js");
				const players = shuffle(message.client.russianRoulette);
				const { MessageEmbed } = require("discord.js");
				const embed = new MessageEmbed()
					.setAuthor("La partie de roulette russe a commencé!", message.author.avatarURL({ dynamic: true }))
					.setColor("#010101")
					.setDescription("...")
					.setFooter("✨Mayze✨")
					.setTimestamp();
				const msg = await message.channel.send(embed).catch(console.error);
				if (!msg) return;
				await roulette();
				message.client.russianRoulette = [];

				async function roulette(i = 0) {
					if (players.length > 1 && i < 5) {
						setTimeout(async () => {
							msg.edit(embed.setDescription(`${players.pop().username} ...`)).catch(console.error);
							roulette(i + 1);
						}, 2000);
					} else {
						setTimeout(async () => {
							const deadPlayer = players.pop();
							msg.edit(embed.setDescription(`🔫 ${deadPlayer.username} est mort !`)).catch(console.error);
							if (args.includes("-kick")) deadPlayer.kick("Roulette Russe").catch(console.error);
							else if (args.includes("-mute")) {
								const mute = require("../commands/mute.js");
								const muteMsg = await message.channel.send(`*mute ${deadPlayer}`).catch(console.error);
								mute.execute(muteMsg, ["5m"]);
							}
						}, 2000);
					}
				}
				break;
			default:
				message.reply("arguments incorrects !").catch(console.error);
		}
	}
};

module.exports = command;