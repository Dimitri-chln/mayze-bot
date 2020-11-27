const command = {
	name: "molkky",
	description: "Pour compter les points au molkky",
	aliases: ["mk"],
	args: 1,
	usage: "setup | create <joueur> <joueur> ... | score <score> | delete",
	async execute(message, args) {
		const Discord = require("discord.js");
		const molkkyData = message.client.molkky || {};
		if (!Object.keys(molkkyData).length) message.client.molkky = {};
		var gameData = molkkyData[message.author.id];
		const Embed = new Discord.MessageEmbed()
			.setTitle(`Partie de ${message.author.username}`)
			.setColor("#010101")
			.setFooter("✨Mayze✨")
			.setTimestamp();

		switch (args[0]) {
			case "setup":
				try {
					message.channel.send({
						embed: {
							title: "Placement Mölkky",
							color: "#010101",
							image: {
								url: "https://i.imgur.com/aj6CMIC.jpg"
							},
							footer: {
								text: "✨Mayze✨"
							}
						}
					});
				} catch (err) { console.log(err); }
			break;
		case "create":
			const players = args.splice(1);
			if (gameData) {
				return message.reply(" une partie est déjà en cours").catch(console.error);
			}
			if (players.length < 2) {
				return message.reply("il faut au moins 2 joueurs pour lancer une partie").catch(console.error);
			}
			gameData = { currentPlayer: 0, players: players.map(p => { return { name: p, scores: [0], failed: 0 }; }), winners: [] };
			message.channel.send(Embed.setDescription(molkkyDesc(gameData))).catch(console.error);
			message.client.molkky[message.author.id] = gameData;
			break;
		case "score":
			if (!gameData) {
				return message.reply("tu n'as pas de partie en cours").catch(console.error);
			}
			const points = parseInt(args[1], 10);
			if (isNaN(points)) {
				return message.reply("le score doit être un nombre").catch(console.error);
			}
			if (points > 12 || points < 0) {
				return message.reply("le score doit être compris entre 0 et 12").catch(console.error);
			}
			var newScore = gameData.players[gameData.currentPlayer].scores.slice(-1)[0] + points;
			if (points === 0) {
				gameData.players[gameData.currentPlayer].failed += 1;
			} else {
				gameData.players[gameData.currentPlayer].failed = 0;
			};
			if (gameData.players[gameData.currentPlayer].failed === 3) {
				newScore = 0;
				gameData.players[gameData.currentPlayer].failed = 0;
			};
			if (newScore > 50) newScore = 25;
			if (newScore === 50) {
				gameData.winners.push(gameData.players[gameData.currentPlayer].name);
			}
			gameData.players[gameData.currentPlayer].scores.push(newScore);
			var gameEnd = false;
			if (gameData.winners.length === gameData.players.length - 1) {
				delete message.client.molkky[message.author.id];
				message.reply("la partie est terminée!").catch(console.error);
				gameEnd = true;
			};
			do {
				gameData.currentPlayer += 1;
				if (gameData.currentPlayer === gameData.players.length) {
					gameData.currentPlayer = 0;
				}
			} while (
				gameData.players[gameData.currentPlayer].scores.slice(-1)[0] === 50);
			if (gameEnd) {
				gameData.winners.push(gameData.players[gameData.currentPlayer].name);
			} else {
				message.client.molkky[message.author.id]= gameData;
			}
			message.channel.send(Embed.setDescription(molkkyDesc(gameData))).catch(console.error);
			break;
		case "delete":
			delete message.client.molkky[message.author.id];
			message.reply("partie supprimée avec succès").catch(console.error);
			break;
		default:
			message.reply("arguments incorrects !").catch(console.error);
		}

		function molkkyDesc(gameData) {
			const embedDesc = `Joueur actuel: __**${gameData.players[gameData.currentPlayer].name}**__\`\`\`\n${gameData.players.map(p => `${(p.name + "      ").substr(0, 7)}|${p.scores.map(s => (s + " ").substr(0, 2)).join("|")}`).join("\n" +"—".repeat(10 + 3 * gameData.players[gameData.currentPlayer].scores.length) + "\n")}\n\`\`\`\nRésultats: \n${gameData.winners.map((w, i) => `\`${i + 1}.\` ${w}`).join("\n") || "-"}`;
			return embedDesc;
			};
	}
};

module.exports = command;