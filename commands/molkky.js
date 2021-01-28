const { Message } = require("discord.js");

const command = {
	name: "molkky",
	description: "Pour compter les points au Molkky",
	aliases: ["mk"],
	args: 1,
	usage: "setup | create <joueur> <joueur> ... | score <score> | delete",
	slashOptions: [
		{
			name: "setup",
			description: "Vérifier le placement des quilles",
			type: 1
		},
		{
			name: "create",
			description: "Créer une partie de Molkky",
			type: 1,
			options: [
				{
					name: "joueurs",
					description: "Une liste de minimum 2 joueurs",
					type: 3,
					required: true
				}
			]
		},
		{
			name: "score",
			description: "Enregistrer un score",
			type: 1,
			options: [
				{
					name: "points",
					description: "Le nombre de points marqués",
					type: 4,
					required: true
				}
			]
		},
		{
			name: "delete",
			description: "Supprimer la partie que tu as créée",
			type: 1
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options) => {
		const Discord = require("discord.js");
		const { "molkky_setup": setup } = require("../assets/misc.json");
		if (!message.client.molkky) message.client.molkky = {};
		const molkkyData = message.client.molkky;
		let gameData = molkkyData[message.author.id];
		const embed = new Discord.MessageEmbed()
			.setTitle(`Partie de ${message.author.tag}`)
			.setColor("#010101")
			.setFooter("✨Mayze✨")
			.setTimestamp();

		const subCommand = args
			? args[0].toLowerCase()
			: options[0].name;

		switch (subCommand) {
			case "setup":
				message.channel.send({
						embed: {
							title: "Placement Mölkky",
							color: "#010101",
							image: {
								url: setup
							},
							footer: {
								text: "✨Mayze✨"
							}
						}
					}).catch(console.error);
				break;
			case "create":
				const players = args
						? args.slice(1).split(" ")
						: options[0].options[0].value.split(" ");
				if (gameData) return message.reply(" une partie est déjà en cours").catch(console.error);
				if (players.length < 2) return message.reply("il faut au moins 2 joueurs pour lancer une partie").catch(console.error);

				gameData = {
					currentPlayer: 0,
					players: players.map(p => {
						return { name: p, scores: [0], failed: 0 };
					}),
					winners: []
				};
				message.channel.send(embed.setDescription(molkkyDesc(gameData))).catch(console.error);
				message.client.molkky[message.author.id] = gameData;
				break;
			case "score":
				const points = args
					? parseInt(args[1])
					: options[0].options[0].value;
				if (!gameData) return message.reply("tu n'as pas de partie en cours").catch(console.error);
				if (isNaN(points)) return message.reply("le score doit être un nombre").catch(console.error);
				if (points > 12 || points < 0) return message.reply("le score doit être compris entre 0 et 12").catch(console.error);

				let newScore = gameData.players[gameData.currentPlayer].scores.slice(-1)[0] + points;
				if (points === 0) gameData.players[gameData.currentPlayer].failed += 1;
				else gameData.players[gameData.currentPlayer].failed = 0;
				if (gameData.players[gameData.currentPlayer].failed === 3) {
					newScore = 0;
					gameData.players[gameData.currentPlayer].failed = 0;
				};
				if (newScore > 50) newScore = 25;
				if (newScore === 50) gameData.winners.push(gameData.players[gameData.currentPlayer].name);
				gameData.players[gameData.currentPlayer].scores.push(newScore);

				let gameEnd = false;
				if (gameData.winners.length === gameData.players.length - 1) {
					delete message.client.molkky[message.author.id];
					message.reply("la partie est terminée!").catch(console.error);
					gameEnd = true;
				};
				do {
					gameData.currentPlayer += 1;
					if (gameData.currentPlayer === gameData.players.length) gameData.currentPlayer = 0;
				} while (gameData.players[gameData.currentPlayer].scores.slice(-1)[0] === 50);
				if (gameEnd) gameData.winners.push(gameData.players[gameData.currentPlayer].name);
				else message.client.molkky[message.author.id]= gameData;

				message.channel.send(embed.setDescription(molkkyDesc(gameData))).catch(console.error);
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