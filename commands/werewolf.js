const { Message } = require("discord.js");

const command = {
	name: "werewolf",
	description: {
		fr: "Jouer aux Loups-garous sur Discord",
		en: "Play a game of Werewolf on Discord"
	},
	aliases: ["ww", "lg"],
	args: 0,
	usage: "join | leave | start | end",
	onlyInGuilds: ["689164798264606784", "724530039781326869"],
	slashOptions: [
		{
			name: "join",
			description: "Join the next game of Werewolf",
			type: 1
		},
		{
			name: "leave",
			description: "Leave the next game of Werewolf",
			type: 1
		},
		{
			name: "start",
			description: "Start a new game of Werewolf",
			type: 1
		},
		{
			name: "end",
			description: "End a game of Werewolf",
			type: 1
		},
		{
			name: "players",
			description: "Get the list of all players of the ongoing Werewolf game",
			type: 1
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args
	 */
	execute: async (message, args, options, language, languageCode) => {
		const subCommand = args
			? (args[0] || "").toLowerCase() || "players"
			: (options ? options[0] : {}).value.toLowerCase();

		const { Collection } = require("discord.js");
		const Game = require("../utils/werewolf/Game");
		const shuffle = require("../utils/shuffle");
		const werewolfInfo = require("../assets/werewolf-composition.json");

		const config = require("../config.json");
		if (!config.WEREWOLF[message.guild.id]) return message.reply(language.unauthorized_guild).catch(console.error);

		const { OWNER_ID } = config;
		const { ROLE_INGAME_ID, ROLE_VILLAGE_ID, ROLE_WEREWOLVES_ID, VILLAGE_CHANNEL_ID, WEREWOLEVS_CHANNEL_ID, DEAD_CHANNEL_ID } = config.WEREWOLF[message.guild.id];
		const roleIngame = message.guild.roles.cache.get(ROLE_INGAME_ID);
		const roleVillage = message.guild.roles.cache.get(ROLE_VILLAGE_ID);
		const roleWerewolves = message.guild.roles.cache.get(ROLE_WEREWOLVES_ID);
		const villageChannel = message.guild.channels.cache.get(VILLAGE_CHANNEL_ID);
		const werewolvesChannel = message.guild.channels.cache.get(WEREWOLEVS_CHANNEL_ID);
		const deadChannel = message.guild.channels.cache.get(DEAD_CHANNEL_ID);

		switch (subCommand) {
			case "join":
				if (message.client.werewolfGames && message.client.werewolfGames.get(message.guild.id) && !message.client.werewolfGames.get(message.guild.id).ended) return message.reply(language.ongoing).catch(console.error);
				if (message.guild.members.cache.filter(m => m.roles.cache.has(roleIngame.id)).size === 16) return message.reply(language.max_players).catch(console.error);
				
				if (message.guild.id === "689164798264606784") message.member.roles.add("759694957132513300").catch(console.error);
				message.member.roles.add(roleIngame).catch(console.error);
				// if (message.member.roles.cache.has("689180158359371851")) { // Administrateur
				// 	message.member.roles.add("753245162469064795").catch(console.error);
				// 	message.member.roles.remove("689180158359371851").catch(console.error);
				// }
				// if (message.member.roles.cache.has("737646140362850364")) { // Modérateur
				// 	message.member.roles.add("753250476891439185").catch(console.error);
				// 	message.member.roles.remove("737646140362850364").catch(console.error);
				// }
				
				message.channel.send(language.get(language.joined, message.author)).catch(console.error);
				break;
			case "leave":
				if (message.client.werewolfGames && message.client.werewolfGames.get(message.guild.id) && !message.client.werewolfGames.get(message.guild.id).ended) return message.reply(language.already_started).catch(console.error);
				
				if (message.guild.id === "689164798264606784") message.member.roles.remove("759694957132513300").catch(console.error);
				message.member.roles.remove(roleIngame).catch(console.error);
				// if (message.member.roles.cache.has("753245162469064795")) { // Administrateur
				// 	message.member.roles.add("689180158359371851").catch(console.error);
				// 	message.member.roles.remove("753245162469064795").catch(console.error);
				// }
				// if (message.member.roles.cache.has("753250476891439185")) { // Modérateur
				// 	message.member.roles.add("737646140362850364").catch(console.error);
				// 	message.member.roles.remove("753250476891439185").catch(console.error);
				// }

				message.channel.send(language.get(language.left, message.author)).catch(console.error);
				break;
			case "start":
				if (message.channel.id !== villageChannel.id) return;
				if (!message.member.hasPermission("ADMINISTRATOR") && message.author.id !== OWNER_ID) return message.reply(language.unauthorized).catch(console.error);
				if (message.client.werewolfGames && message.client.werewolfGames.get(message.guild.id) && !message.client.werewolfGames.get(message.guild.id).ended) return message.reply(language.already_started).catch(console.error);
				
				const startMsg = await villageChannel.send({
					content: roleIngame.toString(),
					embed: {
						author: {
							name: language.start_msg_title,
							icon_url: message.client.user.avatarURL()
						},
						color: "#010101",
						description: language.start_msg_description,
						footer: {
							text: "🐺 Mayze 🐺"
						}
					}
				}).catch(console.error);
				startMsg.react("✅").catch(console.error);

				const possiblePlayers = message.guild.members.cache.filter(m => m.roles.has(roleIngame));

				const filter = (reaction, user) => reaction.emoji.name === "✅" && !user.bot && possiblePlayers.has(user.id);
				const collected = await startMsg.awaitReactions(filter, { time: 30000 }).catch(console.error);;
				const [ players, toRemove ] = possiblePlayers.partition(m => collected.first().users.cache.has(m.id));

				toRemove.forEach(m => m.roles.remove(roleIngame).catch(console.error));

				players.sort(() => Math.random() - 0.5);
				if (players.size < 4)
					return villageChannel.send(language.not_enough_players).catch(console.error);

				const game = new Game(message.guild, roleIngame, roleVillage, roleWerewolves, villageChannel, werewolvesChannel, deadChannel);
				const composition = werewolfInfo.composition[players.length];
				const werewolves = shuffle(werewolfInfo.werewolfRoles[languageCode]);
				const villagers = shuffle(werewolfInfo.villagerRoles[languageCode]);

				await Promise.all(Array.from(players).map(async ([ , player ], i) => {
					let role = null;

					if (i < composition.werewolves) {
						role = werewolves[i] || werewolfInfo.werewolfRoles[languageCode][0];
						playerMember.roles.add(roleWerewolves).catch(console.error);
					} else if (i === composition.werewolves) {
						role = werewolfInfo.roles.seer[languageCode];
						playerMember.roles.add(roleVillage).catch(console.error);
					} else {
						role = villagers[i] || werewolfInfo.villagerRoles[languageCode][0];
						playerMember.roles.add(roleVillage).catch(console.error);
					};

					let options = {};
					if (role === werewolfInfo.roles.witch[languageCode]) options.canSave = true;
					if (role === werewolfInfo.roles.shaman[languageCode]) {
						deadChannel.updateOverwrite(player, { "VIEW_CHANNEL": true, "SEND_MESSAGES": false }).catch(console.error);
					};
					
					game.addPlayer(player, role, options);
					player.user.send(language.get(language.welcome, role)).catch(console.error);
				})).catch(console.error);

				if (!message.client.werewolfGames) message.client.werewolfGames = new Collection();
				message.client.werewolfGames.set(message.guild.id, game);
				
				villageChannel.send({
					content: language.get(language.started_content, roleIngame),
					embed: {
						author: {
							name: language.started_title,
							icon_url: message.client.user.avatarURL()
						},
						description: game.players.map((player, i) =>  `\`${i + 1}.\` ${player.role}`).join("\n"),
						color: "#010101",
						footer: {
							text: "🐺 Mayze 🐺"
						}
					}
				}).catch(console.error);

				game.setNight();
				break;
			case "end":
				if (message.channel.id !== villageChannel.id) return;
				if (!message.member.hasPermission("ADMINISTRATOR") && message.author.id !== OWNER_ID) return message.reply(language.unauthorized).catch(console.error);
				
				{
					const game = message.client.werewolfGames ? message.client.werewolfGames.get(message.guild.id) : null;
					if (!game) return message.reply("il n'y a pas de partie en cours !").catch(console.error);
					if (game.options.timeout) clearTimeout(game.options.timeout);
					game.end();
				}

				message.client.werewolfGame.delete(message.guild.id);
				break;
			case "players":
				if (message.client.werewolfGames && message.client.werewolfGames.has(message.guild.id) && message.channel.id === villageChannel.id) {
					const { players } = message.client.werewolfGames.get(message.guild.id);

					message.channel.send({
						embed: {
							author: {
								name: language.player_list,
								icon_url: message.client.user.avatarURL()
							},
							color: "#010101",
							fields: [
								{
									name: language.fields[0],
									value: players.map((p, i) => {
										if (p.isAlive) return `\`${i + 1}.\` ${p.member.user.username}`;
										return `\`${i}.\` ~~${p.member.user.username}~~ (${p.role})`;
									}).join("\n"),
									inline: true
								}, {
									name: language.fields[1],
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
					const joined = message.guild.members.cache.filter(m => m.roles.cache.has(roleIngame.id)).array();

					message.channel.send({
						embed: {
							author: {
								name: language.player_list,
								icon_url: message.client.user.avatarURL()
							},
							color: "#010101",
							description: joined.map((m, i) => `\`${i + 1}.\` ${m.user.username}`).join("\n") || language.no_player,
							footer: {
								text: "🐺 Mayze 🐺"
							}
						}
					}).catch(console.error);
				}
				break;
			default:
				message.reply(language.errors.invalid_args).catch(console.error);
		}
	}
};

module.exports = command;