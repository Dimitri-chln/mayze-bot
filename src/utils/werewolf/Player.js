const { GuildMember } = require("discord.js");
const selectPlayer = require("./selectPlayer");
const { roles } = require("../../assets/werewolf-composition.json");
const Game = require("./Game");

const language = {
	get: require("../parseLanguageText"),
	werewolfTitle: {
		fr: "C'est l'heure de tuer quelqu'un !",
		en: "It's time to kill someone!"
	},
	werewolfDescription: {
		fr: "Vas voir {1} pour discuter avec les autres loups-garous",
		en: "Check {1} to chat with your fellow werewolves"
	},
	tooLate: {
		fr: "Tu n'as pas répondu à temps",
		en: "You didn't answer in time"
	},
	seerTitle: {
		fr: "De quel joueur souhaites-tu connaître le rôle ?",
		en: "Which player do you want to know the role of?"
	},
	seerAnswer: {
		fr: "**{1}** est **{2}** !",
		en: "**{1}** is **{2}**!"
	},
	witchMessage: {
		fr: "Le joueur que les loups-garous ont décidé d'attaquer s'affichera lorsqu'ils auront fait leur choix",
		en: "The player that the werewolves want to attack will be shown once they decided"
	},
	cupidFirst: {
		fr: "Quel joueur souhaites-tu mettre en couple ? (1er joueur)",
		en: "Which player do you want to couple? (1st player)"
	},
	cupidSecond: {
		fr: "Quel joueur souhaites-tu mettre en couple ? (2ème joueur)",
		en: "Which player do you want to couple? (2nd player)"
	},
	cupidAnswer: {
		fr: "**{1}** et **{2}** sont maintenant en couple !",
		en: "**{1}** and **{2}** are now coupled!"
	},
	cupidLovers: {
		fr: "Tu es désormais en couple avec **{1}** ! Son rôle est **{2}**",
		en: "You are now coupled with **{1}**! Their role is **{2}**"
	},
	avengerTitle: {
		fr: "Quel joueur souhaites-tu tuer lors de ta mort ?",
		en: "Which player do you want to kill upon your own death?"
	},
	avengerAnswer: {
		fr: "**{1}** mourra avec toi !",
		en: "**{1}** will die with you!"
	},
	littleGirlTitle: {
		fr: "Espionne les loups-garous !",
		en: "Spy the werewolves!"
	},
	littleGirlDescription: {
		fr: "Le chat des loups-garous s'affichera ici 👀",
		en: "The werewolves' chat will be displayed here 👀"
	},
	uselessTitle: {
		fr: "Rien à faire cette nuit...",
		en: "Nothing to do on this night..."
	},
	uselessDescription: {
		fr: "Fais de beaux rêves 😴",
		en: "Sweet dreams 😴"
	}
};

class Player {
	/** @type {GuildMember} */
	#member;
	/** @type {string} */
	#role;
	/** @type {Game} */
	#game;
	/** @type {boolean} */
	#isAlive;
	/** @type {Player} */
	#couple;
	/** @type {object} */
	#options;

	/**
	 * @param {GuildMember} member The member linked to the player
	 * @param {string} role The role of the player
	 * @param {Game} game The player's game
	 * @param {object} options Additional information about the player
	 */
	constructor(member, role, game, options = {}) {
		this.#member = member;
		this.#role = role;
		this.#game = game;
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
	 * @returns {Game} The player's game
	 */
	get game() { return this.#game; }

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
			case roles.werewolf[this.game.languageCode]:
				this.member.send({
					embed: {
						title: language.werewolfTitle[this.game.languageCode],
						color: this.game.guild.me.displayColor,
						description: language.get(language.werewolfDescription[this.game.languageCode], this.game.werewolvesChannel.toString()),
						footer: {
							text: "🐺 Mayze 🐺"
						}
					}
				}).catch(console.error);
				break;
			case roles.seer[this.game.languageCode]:
				{
					const player = await selectPlayer(this.member, players.filter(p => p.member.id !== this.member.id), language.seerTitle[this.game.languageCode], 30_000, this.game.languageCode).catch(console.error);
					if (!player) return this.member.send(language.tooLate[this.game.languageCode]);
					this.member.send(language.get(language.seerAnswer[this.game.languageCode], player.member.user.username, player.role)).catch(console.error);
				}
				break;
			case roles.witch[this.game.languageCode]:
				this.member.send(language.witchMessage[this.game.languageCode]).catch(console.error);
				break;
			case roles.cupid[this.game.languageCode]:
				if (night !== 1) return;
				if (players.some(player => player.couple)) return;
				const player_1 = await selectPlayer(this.member, players.filter(p => p.member.id !== this.member.id), language.cupidFirst[this.game.languageCode], 30_000, this.game.languageCode).catch(console.error);
				if (!player_1) return this.member.send(language.tooLate[this.game.languageCode]);
				const player_2 = await selectPlayer(this.member, players.filter(p => p.member.id !== this.member.id && p.member.id !== player_1.member.id), language.cupidSecond[this.game.languageCode], 30_000, this.game.languageCode).catch(console.error);
				if (!player_2) return this.member.send(language.tooLate[this.game.languageCode]);
				player_1.setCouple(player_2);
				player_2.setCouple(player_1);
				this.member.send(language.get(language.cupidAnswer[this.game.languageCode], player_1.member.user.username, player_2.member.user.username)).catch(console.error);
				player_1.member.send(language.get(language.cupidLovers[this.game.languageCode], player_2.member.user.username, player_2.role)).catch(console.error);
				player_2.member.send(language.get(language.cupidLovers[this.game.languageCode], player_1.member.user.username, player_1.role)).catch(console.error);
				break;
			case roles.avenger[this.game.languageCode]:
				{
					const player = await selectPlayer(this.member, players.filter(p => p.member.id !== this.member.id), language.avengerTitle[this.game.languageCode], 30_000, this.game.languageCode).catch(console.error);
					if (!player) return this.member.send(language.tooLate[this.game.languageCode]);
					this.setOption("avenge", player);
					this.member.send(language.get(language.avengerAnswer[this.game.languageCode], player.member.user.username)).catch(console.error);
				}
				break;
			case roles.little_girl[this.game.languageCode]:
				this.member.send({
					embed: {
						title: language.littleGirlTitle[this.game.languageCode],
						color: this.game.guild.me.displayColor,
						description: language.littleGirlDescription[this.game.languageCode],
						footer: {
							text: "🐺 Mayze 🐺"
						}
					}
				}).catch(console.error);
				break;
			default:
				this.member.send({
					embed: {
						title: language.uselessTitle[this.game.languageCode],
						color: this.game.guild.me.displayColor,
						description: language.uselessDescription[this.game.languageCode],
						footer: {
							text: "🐺 Mayze 🐺"
						}
					}
				}).catch(console.error);
		}
	}
};

module.exports = Player;