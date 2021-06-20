const { Message } = require("discord.js");

const command = {
	name: "werewolf",
	description: {
		fr: "Jouer aux Loups-garous sur Discord",
		en: "Play a game of Werewolf on Discord"
	},
	aliases: ["ww", "lg"],
	args: 0,
	usage: "join | leave | start | end | config",
	botPerms: ["EMBED_LINKS", "ADD_REACTIONS", "MANAGE_MESSAGES", "MANAGE_ROLES", "MANAGE_CHANNELS"],
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
			name: "config",
			description: "Get the channel and role config for Werewolf games",
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
		const { ROLE_INGAME_ID, ROLE_VILLAGE_ID, ROLE_WEREWOLVES_ID, VILLAGE_CHANNEL_ID, WEREWOLVES_CHANNEL_ID, DEAD_CHANNEL_ID } = config.WEREWOLF[message.guild.id];
		const roleIngame = message.guild.roles.cache.get(ROLE_INGAME_ID);
		const roleVillage = message.guild.roles.cache.get(ROLE_VILLAGE_ID);
		const roleWerewolves = message.guild.roles.cache.get(ROLE_WEREWOLVES_ID);
		const villageChannel = message.guild.channels.cache.get(VILLAGE_CHANNEL_ID);
		const werewolvesChannel = message.guild.channels.cache.get(WEREWOLVES_CHANNEL_ID);
		const deadChannel = message.guild.channels.cache.get(DEAD_CHANNEL_ID);

		switch (subCommand) {
			case "join": {
				if (message.client.werewolfGames && message.client.werewolfGames.get(message.guild.id) && !message.client.werewolfGames.get(message.guild.id).ended) return message.reply(language.ongoing).catch(console.error);
				if (message.guild.members.cache.filter(m => m.roles.cache.has(roleIngame.id)).size === 16) return message.reply(language.max_players).catch(console.error);
				
				const unJailedRoles = member.roles.cache.filter(role => role.permissions.has("ADMINISTRATOR") && message.guild.roles.cache.some(r => r.name === role.name + " (Jailed)"));
				const jailedRoles = message.guild.roles.cache.filter(role => member.roles.cache.some(r => r.permissions.has("ADMINISTRATOR") && role.name === r.name + " (Jailed)"));
				jailedRoles.set(roleIngame.id, roleIngame);

				await member.roles.remove(unJailedRoles);
				await member.roles.add(jailedRoles);
								
				message.channel.send(language.get(language.joined, message.author)).catch(console.error);
				if (message.channel.id !== villageChannel.id) villageChannel.send(language.get(language.joined, message.author)).catch(console.error);
				break;
			}
			case "leave": {
				if (message.client.werewolfGames && message.client.werewolfGames.get(message.guild.id) && !message.client.werewolfGames.get(message.guild.id).ended) return message.reply(language.already_started).catch(console.error);
				
				const jailedRoles = member.roles.cache.filter(role => message.guild.roles.cache.some(r => r.permissions.has("ADMINISTRATOR") && role.name === r.name + " (Jailed)"));
				const unJailedRoles = message.guild.roles.cache.filter(role => role.permissions.has("ADMINISTRATOR") && member.roles.cache.some(r => r.name === role.name + " (Jailed)"));
				jailedRoles.set(roleIngame.id, roleIngame);

				await member.roles.add(unJailedRoles).catch(console.error);
				await member.roles.remove(jailedRoles).catch(console.error);
				
				message.channel.send(language.get(language.left, message.author)).catch(console.error);
				if (message.channel.id !== villageChannel.id) villageChannel.send(language.get(language.left, message.author)).catch(console.error);
				break;
			}
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
						color: message.guild.me.displayColor,
						description: language.start_msg_description,
						footer: {
							text: "🐺 Mayze 🐺"
						}
					}
				}).catch(console.error);
				await startMsg.react("🐺").catch(console.error);
				await startMsg.react("✅").catch(console.error);

				const possiblePlayers = message.guild.members.cache.filter(m => m.roles.cache.has(roleIngame.id));

				const playFilter = (reaction, user) => reaction.emoji.name === "🐺" && !user.bot && possiblePlayers.has(user.id);
				const collector = startMsg.createReactionCollector(playFilter);

				collector.on("end", async collected => {
					if (!collected.size) return villageChannel.send(language.not_enough_players).catch(console.error);

					const [ players, toRemove ] = possiblePlayers.partition(m => collected.first().users.cache.has(m.id));

					if (players.size < 4) return villageChannel.send(language.not_enough_players).catch(console.error);

					toRemove.forEach(m => m.roles.remove(roleIngame).catch(console.error));
					players.sort(() => Math.random() - 0.5);

					const game = new Game(message.guild, roleIngame, roleVillage, roleWerewolves, villageChannel, werewolvesChannel, deadChannel, [], languageCode);
					const composition = werewolfInfo.composition[players.size];
					const werewolves = shuffle(werewolfInfo.werewolfRoles[languageCode]);
					const villagers = shuffle(werewolfInfo.villagerRoles[languageCode]);

					await Promise.all(Array.from(players).map(async ([ , player ], i) => {
						let role = null;

						if (i < composition.werewolves) {
							role = werewolves[i] || werewolfInfo.werewolfRoles[languageCode][0];
							player.roles.add(roleWerewolves).catch(console.error);
						} else if (i === composition.werewolves) {
							role = werewolfInfo.roles.seer[languageCode];
							player.roles.add(roleVillage).catch(console.error);
						} else {
							role = villagers[i] || werewolfInfo.villagerRoles[languageCode][0];
							player.roles.add(roleVillage).catch(console.error);
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
							color: message.guild.me.displayColor,
							footer: {
								text: "🐺 Mayze 🐺"
							}
						}
					}).catch(console.error);

					game.setNight();
				});

				const startFilter = (reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id;
				await startMsg.awaitReactions(startFilter, { max: 1 }).catch(console.error);
				collector.stop();
				startMsg.reactions.removeAll().catch(console.error);
				break;
			case "end":
				if (message.channel.id !== villageChannel.id) return;
				if (!message.member.hasPermission("ADMINISTRATOR") && message.author.id !== OWNER_ID) return message.reply(language.unauthorized).catch(console.error);
				
				{
					const game = message.client.werewolfGames ? message.client.werewolfGames.get(message.guild.id) : null;
					if (!game) return message.reply(language.no_game).catch(console.error);
					if (game.options.timeout) clearTimeout(game.options.timeout);
					game.end();
				}

				message.client.werewolfGames.delete(message.guild.id);
				break;
			case "config":
				message.channel.send({
					embed: {
						title: language.config,
						color: message.guild.me.displayColor,
						description: language.get(language.config_description, roleIngame.toString(), roleVillage.toString(), roleWerewolves.toString(), villageChannel.toString(), werewolvesChannel.toString(), deadChannel.toString()),
						footer: {
							text: "🐺 Mayze 🐺"
						}
					}
				}).catch(console.error);
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
							color: message.guild.me.displayColor,
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
							color: message.guild.me.displayColor,
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