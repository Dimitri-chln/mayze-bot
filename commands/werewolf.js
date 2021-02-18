const { Message } = require("discord.js");

const command = {
	name: "werewolf",
	description: "Jouer aux Loups-garous sur Discord",
	aliases: ["ww", "lg"],
	args: 0,
	usage: "join | leave | start | end",
	onlyInGuilds: ["689164798264606784"],
	slashOptions: [
		{
			name: "join",
			description: "Rejoindre la partie de Loups-garous",
			type: 1
		},
		{
			name: "leave",
			description: "Quitter la partie de Loups-garous",
			type: 1
		},
		{
			name: "start",
			description: "Lancer une partie de Loups-garous",
			type: 1
		},
		{
			name: "end",
			description: "Terminer une partie de Loups-garous de force",
			type: 1
		},
		{
			name: "players",
			description: "Obtenir la liste des joueurs",
			type: 1
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args
	 */
	execute: async (message, args, options, language) => {
		const { OWNER_ID } = require("../config.json");
		const subCommand = args
			? (args[0] || "").toLowerCase() || "players"
			: (options ? options[0] : {}).value.toLowerCase();
		const Game = require("../werewolfModules/classGame");
		const shuffle = require("../utils/shuffle");
		const werewolfInfo = require("../assets/werewolfInfo.json");

		const roleIngame = message.guild.roles.cache.get("759699864191107072");
		const roleVillage = message.guild.roles.cache.get("759702019207725089");
		const roleWerewolves = message.guild.roles.cache.get("759701843864584202");
		const villageChannel = message.guild.channels.cache.get("759700750803927061");
		const werewolvesChannel = message.guild.channels.cache.get("759702367800786964");
		const deadChannel = message.guild.channels.cache.get("759702659530883095");
		
		switch (subCommand) {
			case "join":
				if (message.client.werewolfGame && !message.client.werewolfGame.ended) return message.reply("une partie est déjà en cours, reviens plus tard!").catch(console.error);
				if (message.guild.members.cache.filter(m => m.roles.cache.has(roleIngame.id)).size === 16) return message.reply("il y a déjà 16 joueurs dans la partie :/").catch(console.error);
				message.member.roles.add("759694957132513300").catch(console.error);
				if (message.member.roles.cache.has("689180158359371851")) { // Administrateur
					message.member.roles.add("753245162469064795").catch(console.error);
					message.member.roles.remove("689180158359371851").catch(console.error);
				}
				if (message.member.roles.cache.has("737646140362850364")) { // Modérateur
					message.member.roles.add("753250476891439185").catch(console.error);
					message.member.roles.remove("737646140362850364").catch(console.error);
				}
				message.channel.send(`${message.author} a rejoint la partie de Loups-garous`).catch(console.error);
				break;
			case "leave":
				if (message.client.werewolfGame && !message.client.werewolfGame.ended) return message.reply("la partie a déjà commencé!").catch(console.error);
				message.member.roles.remove("759694957132513300").catch(console.error);
				if (message.member.roles.cache.has("753245162469064795")) { // Administrateur
					message.member.roles.add("689180158359371851").catch(console.error);
					message.member.roles.remove("753245162469064795").catch(console.error);
				}
				if (message.member.roles.cache.has("753250476891439185")) { // Modérateur
					message.member.roles.add("737646140362850364").catch(console.error);
					message.member.roles.remove("753250476891439185").catch(console.error);
				}
				message.channel.send(`${message.author} a quitté la partie de Loups-garous`).catch(console.error);
				break;
			case "start":
				if (message.channel.id !== "759700750803927061") return;
				if (!message.member.hasPermission("ADMINISTRATOR") && message.author.id !== OWNER_ID) return message.reply("tu n'as pas les permissions nécessaires").catch(console.error);
				if (message.client.werewolfGame && !message.client.werewolfGame.ended) return message.reply("la partie a déjà commencé!").catch(console.error);
				const startMsg = await villageChannel.send({
					content: `${roleIngame}`,
					embed: {
						author: {
							name: "La partie va commencer...",
							icon_url: message.client.user.avatarURL()
						},
						color: "#010101",
						description: "Réagis avec ✅ pour pouvoir jouer",
						footer: {
							text: "🐺 Mayze 🐺"
						}
					}
				}).catch(console.error);
				startMsg.react("✅").catch(console.error);
				const filter = (reaction, user) => reaction.emoji.name === "✅" && !user.bot && message.guild.members.cache.get(user.id).roles.cache.has("759694957132513300");
				const reactionCollector = startMsg.createReactionCollector(filter, { time: 15000 });
				reactionCollector.on("collect", (_reaction, user) => {
					message.guild.members.cache.get(user.id).roles.add(roleIngame).catch(console.error);
				});

				reactionCollector.on("end", () => {
					const players = shuffle(message.guild.members.cache.filter(member => member.roles.cache.has(roleIngame.id)).array());
					if (players.length < 4) {
						players.forEach(player => player.roles.remove(roleIngame).catch(console.error));
						return villageChannel.send(`Il faut au minimum 4 joueurs pour pouvoir lancer la partie (${players.length} joueur${players.length < 2 ? "" : "s"} actuellement)`).catch(console.error);
					}
					message.guild.members.cache.forEach(member => {
						if (member.roles.cache.has("759694957132513300") && !players.some(player => player.id === member.id)) {
							member.roles.remove("759694957132513300").catch(console.error);
							if (member.roles.cache.has("753245162469064795")) { // Administrateur
								member.roles.add("689180158359371851").catch(console.error);
								member.roles.remove("753245162469064795").catch(console.error);
							}
							if (member.roles.cache.has("753250476891439185")) { // Modérateur
								member.roles.add("737646140362850364").catch(console.error);
								member.roles.remove("753250476891439185").catch(console.error);
							}
						}
					});

					const game = new Game(message.guild, roleIngame, roleVillage, roleWerewolves, villageChannel, werewolvesChannel, deadChannel);
					const composition = werewolfInfo.composition[players.length];
					const werewolves = shuffle(werewolfInfo.werewolfRoles);
					const villagers = shuffle(werewolfInfo.villagerRoles);

					players.forEach((playerMember, i) => {
						var role;
						if (i < composition.werewolves) {
							role = werewolves[i] || "Loup-garou";
							playerMember.roles.add(roleWerewolves).catch(console.error);
						} else if (i === composition.werewolves) {
							role = "Voyante";
							playerMember.roles.add(roleVillage).catch(console.error);
						} else {
							role = villagers[i] || "Villageois simple";
							playerMember.roles.add(roleVillage).catch(console.error);
						};

						let options = {};
						if (role === "Sorcière") options.canSave = true;
						if (role === "Chaman") {
							deadChannel.updateOverwrite(playerMember, { "VIEW_CHANNEL": true, "SEND_MESSAGES": false }).catch(console.error);
						};
						
						game.addPlayer(playerMember, role, options);
						playerMember.user.send(`Bienvenue dans cette partie de Loups-garous! Ton rôle est **${role}** 🐺`).catch(console.error);
						});

					message.client.werewolfGame = game;
					villageChannel.send({
						content: `${roleIngame} la partie vient de commencer!`,
						embed: {
							title: "__Rôles de cette partie :__",
							description: game.players.map((player, i) =>  `\`${ i + 1 }.\` ${ player.role }`).join("\n"),
							color: "#010101",
							footer: {
								text: "🐺 Mayze 🐺"
							}
						}
					}).catch(console.error);
					game.setNight();
				});
				break;
			case "end":
				if (message.channel.id !== "759700750803927061") return;
				if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("tu n'as pas les permissions nécessaires").catch(console.error);
				{
					const game = message.client.werewolfGame;
					if (!game) return message.reply("il n'y a pas de partie en cours !").catch(console.error);
					if (game.options.timeout) clearTimeout(game.options.timeout);
					game.end();
				}
				delete message.client.werewolfGame;
				break;
			case "players":
				if (message.client.werewolfGame && message.channel.id === villageChannel.id) {
					const { players } = message.client.werewolfGame;
					message.channel.send({
						embed: {
							author: {
								name: "Liste des joueurs :",
								icon_url: message.client.user.avatarURL()
							},
							color: "#010101",
							fields: [
								{
									name: "Joueurs :",
									value: players.map((p, i) => {
										if (p.isAlive) return `\`${i+1}.\` ${p.member.user.username}`;
										return `\`${i}.\` ~~${p.member.user.username}~~ (${p.role})`;
									}).join("\n"),
									inline: true
								}, {
									name: "Rôles :",
									value: shuffle(players).map(p => `• ${p.role}`).join("\n"),
									inline: true
								}
							],
							footer: {
								text: "🐺 Mayze 🐺"
							}
						}
					}).catch(console.error);
				} else {
					const joined = message.guild.members.cache.filter(m => m.roles.cache.has("759699864191107072")).array();
					message.channel.send({
						embed: {
							author: {
								name: "Liste des joueurs :",
								icon_url: message.client.user.avatarURL()
							},
							color: "#010101",
							description: joined.map((m, i) => `\`${i+1}.\` ${m.user.username}`).join("\n") || "*Aucun joueur*",
							footer: {
								text: "🐺 Mayze 🐺"
							}
						}
					}).catch(console.error);
				}
				break;
			default:
				message.reply("arguments incorrects").catch(console.error);
		}
	}
};

module.exports = command;