const { Guild, GuildChannel, Role } = require("discord.js");
const Player = require("./classPlayer");
const selectPlayer = require("../werewolfModules/selectPlayer");

class Game {
	/**
	 * @type {Guild}
	 */
	#guild;
	/**
	 * @type {Role}
	 */
	#roleIngame;
	/**
	 * @type {Role}
	 */
	#roleVillage;
	/**
	 * @type {Role}
	 */
	#roleWerwolves;
	/**
	 * @type {Channel}
	 */
	#villageChannel;
	/**
	 * @type {Channel}
	 */
	#werewolvesChannel;
	/**
	 * @type {Channel}
	 */
	#deadChannel;
	/**
	 * @type {Player[]}
	 */
	#players;
	/**
	 * @type {number}
	 */
	#night;
	/**
	 * @type {number}
	 */
	#day;
	/**
	 * @type {object}
	 */
	#options;

	/**
	 * @param {Guild} guild The guild where the game is created
	 * @param {Role} roleIngame The role the players have when they are ingame
	 * @param {Role} roleVillage The role all villagers have
	 * @param {Role} roleWerwolves The role all werewolves have
	 * @param {GuildChannel} villageChannel The channel where all the village can chat
	 * @param {GuildChannel} werewolvesChannel The channel where the werewolves can chat
	 * @param {GuildChannel} deadChannel The channel where the dead players can chat
	 * @param {Player[]} players A list of all the players
	 * @param {object} option Additional information about the game
	 */
	constructor(guild, roleIngame, roleVillage, roleWerwolves, villageChannel, werewolvesChannel, deadChannel, players = [], options = {}) {
		this.#guild = guild;
		this.#roleIngame = roleIngame;
		this.#roleVillage = roleVillage;
		this.#roleWerwolves = roleWerwolves;
		this.#villageChannel = villageChannel;
		this.#werewolvesChannel = werewolvesChannel;
		this.#deadChannel = deadChannel;
		this.#players = players;
		this.#options = options;
		this.#night = 0;
		this.#day = 0;
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

	addPlayer(member, role, options = {}) {
		this.#players.push(new Player(member, role, options));
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
	 * @param {Player} player The player to kill
	 * @returns {Player[]} All the players that got killed
	 */
	kill(player) {
		if (!player) return;
		player.setDead();
		const deadRole = this.guild.roles.cache.find(role => role.name === player.role);
		player.member.roles.add(deadRole).catch(console.error);

		const dead = [player];
		if (player.options.couple && player.options.couple.isAlive)
			dead.push(...this.kill(player.options.couple));
		if (player.options.avenge && player.options.avenge.isAlive)
			dead.push(...this.kill(player.options.avenge));
		return dead;
	}

	/**
	 * Sets the beginning of the night
	 */
	async setNight() {
		this.#night ++;
		this.villageChannel.updateOverwrite(this.roleIngame, { "SEND_MESSAGES": false });
		this.werewolvesChannel.updateOverwrite(this.roleWerwolves, { "SEND_MESSAGES": null });
		this.villageChannel.send({
			embed: {
				title: `La nuit tombe sur le village... (nuit ${this.night})`,
				color: "#010101",
				footer: {
					text: "🐺 Mayze 🐺"
				}
			}
		});
		const filter = message => !message.author.bot;
		const messageCollector = this.werewolvesChannel.createMessageCollector(filter, { time: 90000 });
		const littleGirl = this.players.find(player => player.role === "Petite fille");
		if (littleGirl) {
			messageCollector.on("collect", async message => {
				littleGirl.member.send(message.content).catch(console.error);
			});
		}
		this.alivePlayers.forEach(async player => {
			player.action(this.players, this.night);
		});
		setTimeout(() => {
			if (!this.options.ended) this.setDay();
		}, 90000);

		const attackedPlayer = await selectPlayer(this.werewolvesChannel, this.alivePlayers.filter(player => player.role !== "Loup-garou"), "Quel joueur souhaitez-vous attaquer cette nuit ?");
		const witch = this.players.find(player => player.role === "Sorcière");
		if (attackedPlayer) {
			this.werewolvesChannel.send(`Les loups-garous attaqueront **${attackedPlayer.member.user.username}**`).catch(console.error);
			attackedPlayer.setOption("isAttacked", true);
			if (witch && witch.isAlive) {
				if (witch.options.canSave) {
					const msg = await witch.member.user.send({
						embed: {
							title: `Les loups-garous ont décidé de tuer **${attackedPlayer.member.user.username}**`,
							color: "#010101",
							description: "Souhaites-tu le sauver ?",
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
						msg.edit(msg.embeds[0].setDescription("Mais tu l'a sauvé !")).catch(console.error);
					} else {
						msg.edit(msg.embeds[0].setDescription("Mais tu ne l'a pas sauvé...")).catch(console.error);
					}
				} else {
					witch.member.send({
						embed: {
							title: `Les loups-garous ont décidé de tuer **${ attackedPlayer.member.user.username }**`,
							color: "#010101",
							description: "Mais tu ne peux pas sauver ce joueur...",
							footer: {
								text: "🐺 Mayze 🐺"
							}
						}
					}).catch(console.error);
				}
			}
		} else {
			if (witch && witch.isAlive) {
				witch.member.send("Les loups-garous n'ont attaqué personne cette nuit").catch(console.error);
			}
		}
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
				title: `Le jour se lève sur le village... (jour ${this.day})`,
				color: "#010101",
				description: `Les joueurs qui sont morts cette nuit sont:\n${dead.map(player => `• **${player.member.user.username}** qui était **${player.role}**`).join("\n") || "*Personne !*"}`,
				footer: {
					text: "🐺 Mayze 🐺"
				}
			}
		}).catch(console.error);
		if (!this.options.ended) {
			const ended = this.endCheck();
			if (!ended) setTimeout(() => this.setVote(), 90000);
		}
	}

	/**
	 * Sets the beginning of the vote
	 */
	async setVote() {
		const msg = await this.villageChannel.send({
			content: `${this.roleIngame}`,
			embed: {
				title: "L'heure du vote a sonné !",
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
					title: "Résultat du vote",
					color: "#010101",
					description: this.alivePlayers.map((player, i) => `\`${ (i + 1).toString(16).toUpperCase() }.\` **${ player.member.user.username }** - \`${ player.options.votes }\` vote(s)`).join("\n"),
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
					await this.villageChannel.send(`Le village a décidé de tuer **${lynched.member.user.username}**`).catch(console.error);
					this.villageChannel.send({
						embed: {
							title: "Les joueurs qui sont morts aujourd'hui sont:",
							color: "#010101",
							description: dead.map(player => `- **${player.member.user.username}** qui était **${player.role}**`).join(", "),
							footer: {
								text: "🐺 Mayze 🐺"
							}
						}
					}).catch(console.error);
					if (lynched.role === "Ange") {
						this.villageChannel.send("L'ange a gagné !").catch(console.error);
						this.end();
					}
				} else {
					this.villageChannel.send("Le village n'a pas pu décider qui éliminer").catch(console.error);
				}
				if (!this.options.ended) {
					const ended = this.endCheck();
					if (!ended) setTimeout(() => this.setNight(), 3000);
				}
			}, 3000);
		});
	}

	/**
	 * Checks is the game should end
	 * @returns {boolean} If the game ended
	 */
	endCheck() {
		const werewolves = this.alivePlayers.filter(player => player.role === "Loup-garou");
		const villagers = this.alivePlayers.filter(player => player.role !== "Loup-garou");

		if (werewolves.length >= villagers.length) {
			this.villageChannel.send("Les loups-garous ont gagné !").catch(console.error);
			this.end();
			return true;
		}
		if (werewolves.length === 0) {
			this.villageChannel.send("Le village a gagné !").catch(console.error);
			this.end();
			return true;
		}
		return false;
	};

	/**
	 * Ends the game
	 */
	async end() {
		this.setOption("ended", true);
		const roles = [/*"759699864191107072", "759694957132513300", */"759701843864584202", "759702019207725089", "759703669221359637", "759703558445727786", "759703743104548894", "759703827133497386", "759703894720380928", "759703955956957205", "759704017570889728", "759704083173998604", "759704177587912704"];
		this.villageChannel.updateOverwrite(this.roleIngame, { "SEND_MESSAGES": null }).catch(console.error);
		this.werewolvesChannel.updateOverwrite(this.roleWerwolves, { "SEND_MESSAGES": false }).catch(console.error);
		this.players.forEach(async player => {
			player.member.roles.remove(this.guild.roles.cache.filter(role => roles.includes(role.id) && player.member.roles.cache.has(role.id))).catch(console.error);
			if (player.role === "Chaman") {
				this.deadChannel.permissionOverwrites.get(player.member.id).delete().catch(console.error);
			}
		});
		this.villageChannel.send({
			embed: {
				title: "Partie terminée !",
				color: "#010101",
				description: this.players.map(player => {
						const dead = player.isAlive ? "" : " (mort)";
						return `${player.member.user.username} - ${player.role}${dead}`;
					}).join("\n"),
				footer: {
					text: "🐺 Mayze 🐺"
				}
			}
		}).catch(console.error);
		delete this.guild.client.werewolfGame;
	}
};

module.exports = Game;