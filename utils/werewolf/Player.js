const { GuildMember } = require("discord.js");
const selectPlayer = require("./selectPlayer");

class Player {
	/** @type {GuildMember} */
	#member;
	/** @type {string} */
	#role;
	/** @type {boolean} */
	#isAlive;
	/** @type {Player} */
	#couple;
	/** @type {object} */
	#options;

	/**
	 * @param {GuildMember} member The member linked to the player
	 * @param {object} options Additional information about the player
	 */
	constructor(member, role, options = {}) {
		this.#member = member;
		this.#role = role;
		this.#isAlive = true,
		this.#couple = null;
		this.#options = options;
	}

	/**
	 * @returns {GuildMember} The member linked to the player
	 */
	get member() { return this.#member; }

	/**
	 * @returns {string} The player's role
	 */
	get role() { return this.#role; }

	/**
	 * @returns {boolean} If the player is alive
	 */
	get isAlive() {	return this.#isAlive; }

	/**
	 * @returns {Player} The lover of the player
	 */
	get couple() { return this.#couple; }

	/**
	 * @param {Player} player 
	 */
	setCouple(player) {
		this.#couple = player;
	}

	/**
	 * @returns {Object} Other information about the player
	 */
	get options() {	return this.#options; }

	/**
	 * @param {string} option - An additional information about the player
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
	 * Sets the player as dead
	 */
	setDead() {
		this.#isAlive = false;
	}

	/**
	 * @param {Player[]} players The list of all players
	 * @param {number} night The current night
	 */
	async action(players, night) {
		switch (this.role) {
			case "Loup-garou":
				this.member.send({
					embed: {
						title: "C'est l'heure de tuer quelqu'un !",
						color: "#010101",
						description: "Vas voir <#759702367800786964> pour discuter avec les autres loups-garous",
						footer: {
							text: "🐺 Mayze 🐺"
						}
					}
				}).catch(console.error);
				break;
			case "Voyante":
				{
					const player = await selectPlayer(this.member, players.filter(p => p.member.id !== this.member.id), "De quel joueur souhaites-tu connaître le rôle ?").catch(console.error);
					if (!player) return this.member.send("Tu n'as pas répondu à temps");
					this.member.send(`**${ player.member.user.username }** est **${ player.role }** !`).catch(console.error);
				}
				break;
			case "Sorcière":
				this.member.send("Le joueur que les loups-garous ont décidé d'attaquer s'affichera lorsqu'ils auront fait le choix").catch(console.error);
				break;
			case "Cupidon":
				if (night !== 1) return;
				if (players.some(player => player.couple)) return;
				const player_1 = await selectPlayer(this.member, players.filter(p => p.member.id !== this.member.id), "Quel joueur souhaites-tu mettre en couple ? (1er joueur)", 15000).catch(console.error);
				if (!player_1) return this.member.send("Tu n'as pas répondu à temps");
				const player_2 = await selectPlayer(this.member, players.filter(p => p.member.id !== this.member.id && p.member.id !== player_1.member.id), "Quel joueur souhaites-tu mettre en couple ? (2ème joueur)", 15000).catch(console.error);
				if (!player_2) return this.member.send("Tu n'as pas répondu à temps");
				player_1.setCouple(player_2);
				player_2.setCouple(player_1);
				this.member.send(`**${player_1.member.user.username}** et **${player_2.member.user.username}** sont maintenant en couple !`).catch(console.error);
				player_1.member.send(`Tu es désormais en couple avec **${player_2.member.user.username}** ! Son rôle est **${player_2.role}**`).catch(console.error);
				player_2.member.send(`Tu es désormais en couple avec **${player_1.member.user.username}** ! Son rôle est **${player_1.role}**`).catch(console.error);
				break;
			case "Chasseur":
				{
					const player = await selectPlayer(this.member, players.filter(p => p.member.id !== this.member.id), "Quel joueur souhaites-tu tuer lors de ta mort ?").catch(console.error);
					if (!player) return this.member.send("Tu n'as pas répondu à temps");
					this.setOption("avenge", player);
					this.member.send(`**${ player.member.user.username }** mourra avec toi !`).catch(console.error);
				}
				break;
			case "Petite fille":
				this.member.send({
					embed: {
						title: "Espionne les loups-garous !",
						color: "#010101",
						description: "Le chat des loups-garous s'affichera ici 👀",
						footer: {
							text: "🐺 Mayze 🐺"
						}
					}
				}).catch(console.error);
				break;
			default:
				this.member.send({
					embed: {
						title: "Rien à faire cette nuit...",
						color: "#010101",
						description: "Fais de beaux rêves 😴",
						footer: {
							text: "🐺 Mayze 🐺"
						}
					}
				}).catch(console.error);
		}
	}
};

module.exports = Player;