const { Guild, GuildChannel, Role } = require("discord.js");
const Player = require("./Player");
const selectPlayer = require("./selectPlayer");
const shuffle = require("../shuffle");
const { roles } = require("../../assets/werewolf-composition.json");

const language = {
	get: (text, ...args) => text
		.replace(/\{\d+?\}/g, a => args[parseInt(a.replace(/[\{\}]/g, "")) - 1])
		.replace(/\[\d+?\?.*?:.*?\]/g, a => {
			let m = a.match(/\[(\d+?)\?(.*?):(.*?)\]/);
			if (args[parseInt(m[1]) - 1]) return m[2];
			else return m[3];
		}),

	nightStart: {
		fr: "La nuit tombe sur le village... (Nuit {1})",
		en: "Night falls upon the village... (Night {1})"
	},
	werewolvesTitle: {
		fr: "Quel joueur souhaitez-vous attaquer cette nuit ?",
		en: "Which player do you want to attack this night?"
	},
	werewolvesAnswer: {
		fr: "Les loups-garous attaqueront **{1}**",
		en: "The werewolves will attack **{1}**"
	},
	witchTitle: {
		fr: "Les loups-garous ont décidé d'attaquer **{1}**",
		en: "The werewolves decided to attack **{1}**"
	},
	witchDescription: {
		fr: "Souhaites-tu le sauver ?",
		en: "Do you want to save them?"
	},
	witchSaved: {
		fr: "Mais tu l'a sauvé !",
		en: "But you saved them!"
	},
	witchDidntSave: {
		fr: "Mais tu ne l'as pas sauvé...",
		en: "But you didn't save them..."
	},
	witchCantSave: {
		fr: "Mais tu ne peux pas sauver ce joueur...",
		en: "But you can't save this player..."
	},
	witchNoAttack: {
		fr: "Les loups-garous n'ont attaqué personne cette nuit",
		en: "Te werewolves didn't attack anyone this night"
	},
	dayStart: {
		fr: "Le jour se lève sur le village... (Jour {1})",
		en: "The day rises upon the village... (Day {1})"
	},
	deadPlayers: {
		fr: "Les joueurs qui sont morts cette nuit sont :\n{1}",
		en: "The players who died this night are:\n{1}"
	},
	deadPlayerLine: {
		fr: "• **{1}** qui était **{2}**",
		en: "• **{1}** who was **{2}**"
	},
	noDead: {
		fr: "*Personne !*",
		en: "*Nobody!*"
	},
	voteStart: {
		fr: "L'heure du vote a sonné !",
		en: "It's time to vote!"
	},
	voteResult: {
		fr: "Résultat du vote",
		en: "Vote result"
	},
	lynched: {
		fr: "Le village a décidé de tuer **{1}**",
		en: "The village decided to lynch **{1}**"
	},
	deadVote: {
		fr: "Les joueurs qui sont morts aujourd'hui sont :",
		en: "The players who died today are:"
	},
	angelWin: {
		fr: "L'ange a gagné !",
		en: "The angel won!"
	},
	noLynched: {
		fr: "Le village n'a pas pu décider qui éliminer",
		en: "The village couldn't decide who to lynch"
	},
	coupleWin: {
		fr: "Les amoureux ont gagné !",
		en: "The lovers won!"
	},
	werewolvesWin: {
		fr: "Les loups-garous ont gagné !",
		en: "The werewolves won!"
	},
	villageWin: {
		fr: "Le village a gagné !",
		en: "The village won!"
	},
	gameEnd: {
		fr: "Partie terminée !",
		en: "Game ended!"
	}
};

class Game {
	/** @type {Guild} */
	#guild;
	/** @type {Role} */
	#roleIngame;
	/** @type {Role} */
	#roleVillage;
	/** @type {Role} */
	#roleWerwolves;
	/** @type {Channel} */
	#villageChannel;
	/** @type {Channel} */
	#werewolvesChannel;
	/** @type {Channel} */
	#deadChannel;
	/** @type {Player[]} */
	#players;
	/** @type {number} */
	#night;
	/** @type {number} */
	#day;
	/** @type {string} */
	#languageCode;
	/** @type {object} */
	#options;
	/** @type {boolean} */
	#ended;

	/**
	 * @param {Guild} guild The guild where the game is created
	 * @param {Role} roleIngame The role the players have when they are ingame
	 * @param {Role} roleVillage The role all villagers have
	 * @param {Role} roleWerwolves The role all werewolves have
	 * @param {GuildChannel} villageChannel The channel where all the village can chat
	 * @param {GuildChannel} werewolvesChannel The channel where the werewolves can chat
	 * @param {GuildChannel} deadChannel The channel where the dead players can chat
	 * @param {Player[]} players A list of all the players
	 * @param {string} languageCode The language of the game
	 * @param {object} option Additional information about the game
	 */
	constructor(guild, roleIngame, roleVillage, roleWerwolves, villageChannel, werewolvesChannel, deadChannel, players = [], languageCode = "en", options = {}) {
		this.#guild = guild;
		this.#roleIngame = roleIngame;
		this.#roleVillage = roleVillage;
		this.#roleWerwolves = roleWerwolves;
		this.#villageChannel = villageChannel;
		this.#werewolvesChannel = werewolvesChannel;
		this.#deadChannel = deadChannel;
		this.#players = players;
		this.#languageCode = languageCode;
		this.#options = options;
		this.#night = 0;
		this.#day = 0;
		this.#ended = false;
	}

	/**
	 * @returns {Guild} The guild where the game is created
	 */
	get guild() { return this.#guild; }

	/**
	 * @returns {Role} The role the players have when they are ingame
	 */
	get roleIngame() { return this.#roleIngame; }

	/**
	 * @returns {Role} The role all villagers have
	 */
	get roleVillage() { return this.#roleVillage; }

	/**
	 * @returns {Role} The role all werewolves have
	 */
	get roleWerwolves() { return this.#roleWerwolves; }

	/**
	 * @returns {GuildChannel} The channel where all the village can chat
	 */
	get villageChannel() { return this.#villageChannel; }

	/**
	 * @returns {GuildChannel} The channel where the werewolves can chat
	 */
	get werewolvesChannel() { return this.#werewolvesChannel; }

	/**
	 * @returns {GuildChannel} The channel where the dead players can chat
	 */
	get deadChannel() {	return this.#deadChannel; }

	/**
	 * @returns {Guild} The guild where the game is created
	 */
	get guild() { return this.#villageChannel.guild; }

	/**
	 * @returns {Player[]} The list of all players
	 */
	get players() {	return this.#players; }

	/**
	 * Add a player to the game
	 * @param {GuildMember} member The member linked with the player
	 * @param {string} role The role of the player
	 * @param {*} options Additional information about the player
	 */
	addPlayer(member, role, options = {}) {
		this.#players.push(new Player(member, role, this, options));
	}

	/**
	 * Shuffle the players
	 */
	shufflePlayers() {
		this.#players = shuffle(this.#players);
	}

	/**
	 * @returns {number} The current night
	 */
	get night() { return this.#night; }

	/**
	 * @returns {number} The current day
	 */
	get day() { return this.#day; }

	/**
	 * @returns {string} The language of the game
	 */
	get languageCode() { return this.#languageCode; }

	/**
	 * @returns {object} Other information about the game
	 */
	get options() { return this.#options; }

	/**
	 * @param {string} option - An additional information about the game
	 * @param {*} value - The value of the option
	 */
	setOption(option, value) {
		this.#options[option] = value;
	}

	/**
	 * @param {string} option - The option to remove
	 */
	deleteOption(option) {
		delete this.#options[option];
	}

	/**
	 * @returns {Player[]} The list of all alive players
	 */
	get alivePlayers() { return this.#players.filter(player => player.isAlive); }

	/**
	 * @returns {boolean} If the game ended or not
	 */
	get ended() { return this.#ended; }

	/**
	 * @param {Player} player The player to kill
	 * @returns {Player[]} All the players that got killed
	 */
	kill(player) {
		if (!player) return;
		player.setDead();
		if (player.role === roles.shaman[this.languageCode]) this.deadChannel.permissionOverwrites.get(player.member.id).delete().catch(console.error);
		const deadRole = this.guild.roles.cache.find(role => role.name === player.role);
		player.member.roles.add(deadRole).catch(console.error);
		player.member.roles.remove(this.roleVillage).catch(console.error);
		player.member.roles.remove(this.roleWerwolves).catch(console.error);

		const dead = [ player ];
		if (player.couple && player.couple.isAlive)
			dead.push(...this.kill(player.couple));
		if (player.options.avenge && player.options.avenge.isAlive)
			dead.push(...this.kill(player.options.avenge));
		return dead;
	}

	/**
	 * Sets the beginning of the night
	 */
	async setNight() {
		if (this.night === 0) this.shufflePlayers();
		this.#night ++;
		this.villageChannel.updateOverwrite(this.roleIngame, { "SEND_MESSAGES": false });
		this.werewolvesChannel.updateOverwrite(this.roleWerwolves, { "SEND_MESSAGES": null });
		this.villageChannel.send({
			embed: {
				title: language.get(language.nightStart[this.languageCode], this.night),
				color: "#010101",
				footer: {
					text: "🐺 Mayze 🐺"
				}
			}
		});
		const filter = message => !message.author.bot;
		const messageCollector = this.werewolvesChannel.createMessageCollector(filter, { time: 90000 });
		const littleGirl = this.players.find(player => player.role === roles.little_girl[this.languageCode]);
		if (littleGirl) {
			messageCollector.on("collect", async message => {
				littleGirl.member.send(`- ${message.content}`).catch(console.error);
			});
		}
		this.alivePlayers.forEach(async player => {
			player.action(this.players, this.night);
		});
		
		let readyForDay = false;
		let immediateDay = false;
		setTimeout(() => {
			if (readyForDay && !this.ended) this.setDay();
			else immediateDay = true;
		}, 30000);

		const attackedPlayer = await selectPlayer(this.werewolvesChannel, this.alivePlayers.filter(player => player.role !== roles.werewolf[this.languageCode]), language.werewolvesTitle[this.languageCode], 60000).catch(console.error);
		const witch = this.players.find(player => player.role === roles.witch[this.languageCode]);
		
		if (attackedPlayer) {
			this.werewolvesChannel.send(language.get(language.werewolvesAnswer[this.languageCode], attackedPlayer.member.user.username)).catch(console.error);
			attackedPlayer.setOption("isAttacked", true);
			
			if (witch && witch.isAlive) {
				if (witch.options.canSave) {
					const msg = await witch.member.user.send({
						embed: {
							title: language.get(language.witchTitle[this.languageCode], attackedPlayer.member.user.username),
							color: "#010101",
							description: language.witchDescription[this.languageCode],
							footer: {
								text: "🐺 Mayze 🐺"
							}
						}
					}).catch(console.error);
					await msg.react("✅").catch(console.error);
					await msg.react("❌").catch(console.error);

					const filter = (reaction, user) => ["✅", "❌"].includes(reaction.emoji.name) && !user.bot;
					const collected = await msg.awaitReactions(filter, { max: 1, time: 30000 }).catch(console.error);
					
					if (collected.size && collected.first().emoji.name === "✅") {
						attackedPlayer.deleteOption("isAttacked");
						witch.deleteOption("canSave");
						msg.edit(msg.embeds[0].setDescription(language.witchSaved[this.languageCode])).catch(console.error);
					} else {
						msg.edit(msg.embeds[0].setDescription(language.witchDidntSave[this.languageCode])).catch(console.error);
					}

				} else {
					witch.member.send({
						embed: {
							title: language.get(language.witchTitle[this.languageCode], attackedPlayer.member.user.username),
							color: "#010101",
							description: language.witchCantSave[this.languageCode],
							footer: {
								text: "🐺 Mayze 🐺"
							}
						}
					}).catch(console.error);
				}
			}

		} else {
			if (witch && witch.isAlive) {
				witch.member.send(language.witchNoAttack[this.languageCode]).catch(console.error);
			}
		}

		readyForDay = true;
		if (immediateDay && !this.ended) this.setDay();
	}

	/**
	 * Sets the beginning of the day
	 */
	async setDay() {
		this.#day ++;
		this.villageChannel.updateOverwrite(this.roleIngame, { "SEND_MESSAGES": null });
		this.werewolvesChannel.updateOverwrite(this.roleWerwolves, { "SEND_MESSAGES": false });
		const attackedPlayer = this.alivePlayers.find(player => player.options.isAttacked);
		const dead = this.kill(attackedPlayer) || [];
		this.villageChannel.send({
			content: `${this.roleIngame}`,
			embed: {
				title: language.get(language.dayStart[this.languageCode], this.day),
				color: "#010101",
				description: language.get(language.deadPlayers[this.languageCode], dead.map(player => language.get(language.deadPlayerLine[this.languageCode], player.member.user.username, player.role)).join("\n") || language.noDead[this.languageCode]),
				footer: {
					text: "🐺 Mayze 🐺"
				}
			}
		}).catch(console.error);
		if (this.ended) return;
		const ended = this.endCheck();
		if (!ended) setTimeout(() => this.setVote(), 90000);
	}

	/**
	 * Sets the beginning of the vote
	 */
	async setVote() {
		const msg = await this.villageChannel.send({
			content: this.roleIngame.toString(),
			embed: {
				title: language.voteStart[this.languageCode],
				color: "#010101",
				description: this.alivePlayers.map((player, i) => `\`${ (i + 1).toString(16).toUpperCase() }.\` **${ player.member.user.username }**`).join("\n"),
				footer: {
					text: "🐺 Mayze 🐺"
				}
			}
		}).catch(console.error);
		const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "🇦", "🇧", "🇨", "🇩", "🇪" ,"🇫"].slice(0, this.alivePlayers.length);
		emojis.forEach(async e => await msg.react(e).catch(console.error));
		
		const filter = (reaction, user) => emojis.includes(reaction.emoji.name) && this.alivePlayers.some(player => player.member.user.id === user.id) && !user.bot;
		const reactionCollector = msg.createReactionCollector(filter, { time: 30000 });
		const votes = {};

		reactionCollector.on("collect", async (reaction, user) => {
			reaction.users.remove(user).catch(console.error);
			votes[user.id] = this.alivePlayers[emojis.indexOf(reaction.emoji.name)];
		});
		reactionCollector.on("end", async () => {
			msg.reactions.removeAll().catch(console.error);
			this.alivePlayers.forEach(player => player.setOption("votes", Object.values(votes).filter(vote => vote.member.user.id === player.member.user.id).length));
			this.villageChannel.send({
				embed: {
					title: language.voteResult[this.languageCode],
					color: "#010101",
					description: this.alivePlayers.map((player, i) => `\`${ (i + 1).toString(16).toUpperCase() }.\` **${player.member.user.username}** - \`${player.options.votes}\` vote${player.options.votes > 1 ? "s" : ""}`).join("\n"),
					footer: {
						text: "🐺 Mayze 🐺"
					}
				}
			}).catch(console.error);
			const max = Math.max(...this.alivePlayers.map(player => player.options.votes));
			const maxPlayers = this.alivePlayers.filter(player => player.options.votes === max);
			const lynched = maxPlayers[0];
			setTimeout(async () => {
				if (maxPlayers.length === 1) {
					const dead = this.kill(lynched);
					await this.villageChannel.send(language.get(language.lynched[this.languageCode], lynched.member.user.username)).catch(console.error);
					this.villageChannel.send({
						embed: {
							title: language.deadVote[this.languageCode],
							color: "#010101",
							description: dead.map(player => language.get(language.deadPlayerLine[this.languageCode], player.member.user.username, player.role)).join("\n"),
							footer: {
								text: "🐺 Mayze 🐺"
							}
						}
					}).catch(console.error);
					if (lynched.role === roles.angel[this.languageCode]) {
						this.villageChannel.send(language.angelWin[this.languageCode]).catch(console.error);
						this.end();
					}
				} else {
					this.villageChannel.send(language.noLynched[this.languageCode]).catch(console.error);
				}
				if (this.ended) return;
				const ended = this.endCheck();
				if (!ended) setTimeout(() => this.setNight(), 3000);
			}, 3000);
		});
	}

	/**
	 * Checks is the game should end
	 * @returns {boolean} If the game ended
	 */
	endCheck() {
		const werewolves = this.alivePlayers.filter(player => player.role === roles.werewolf[this.languageCode]);
		const villagers = this.alivePlayers.filter(player => player.role !== roles.werewolf[this.languageCode]);

		if (this.alivePlayers.every(player => player.couple || player.role === roles.cupid[this.languageCode])) {
			this.villageChannel.send(language.coupleWin[this.languageCode]).catch(console.error);
			this.end();
			return true;
		}

		if (werewolves.length >= villagers.length) {
			this.villageChannel.send(language.werewolvesWin[this.languageCode]).catch(console.error);
			this.end();
			return true;
		}
		if (werewolves.length === 0) {
			this.villageChannel.send(language.villageWin[this.languageCode]).catch(console.error);
			this.end();
			return true;
		}
		return false;
	};

	/**
	 * Ends the game
	 */
	async end() {
		this.#ended = true;
		this.villageChannel.updateOverwrite(this.roleIngame, { "SEND_MESSAGES": null }).catch(console.error);
		this.werewolvesChannel.updateOverwrite(this.roleWerwolves, { "SEND_MESSAGES": false }).catch(console.error);
		this.players.forEach(async player => {
			player.member.roles.remove(this.roleIngame).catch(console.error);
			player.member.roles.remove(this.roleVillage).catch(console.error);
			player.member.roles.remove(this.roleWerwolves).catch(console.error);
			player.member.roles.remove(this.guild.roles.cache.find(role => role.name === player.role)).catch(console.error);
			if (player.role === roles.shaman[this.languageCode] && player.isAlive) {
				this.deadChannel.permissionOverwrites.get(player.member.id).delete().catch(console.error);
			}
		});
		this.villageChannel.send({
			embed: {
				title: language.gameEnd[this.languageCode],
				color: "#010101",
				description: this.players.map(player => player.isAlive ? `${player.member.user.username} - ${player.role}` : `~~${player.member.user.username} - ${player.role}~~`).join("\n"),
				footer: {
					text: "🐺 Mayze 🐺"
				}
			}
		}).catch(console.error);
	}
};

module.exports = Game;