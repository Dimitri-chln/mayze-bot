import { GuildMember } from "discord.js";
import selectPlayer from "./selectPlayer";

class Player {
	/**
	 * @type {GuildMember}
	 */
	#member;
	/**
	 * @type {string}
	 */
	#role;
	/**
	 * @type {boolean}
	 */
	#isAlive;
	/**
	 * @type {object}
	 */
	#options;

	/**
	 * @param {GuildMember} member The member linked to the player
	 * @param {object} options Additional information about the player
	 */
	constructor(member, role, options = {}) {
		this.#member = member;
		this.#role = role;
		this.#isAlive = true,
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
	 */
	async action(players) {
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
				const player = await selectPlayer(this.member, players, "De quel joueur souhaites-tu connaître le rôle ?");
				this.member.send(`**${ player.member.user.username }** est **${ player.role }** !`).catch(console.error);
				break;
			case "Sorcière":
				this.member.send("Le joueur que les loups-garous ont décidé d'attaquer s'affichera lorsqu'ils auront fait le choix").catch(console.error);
				break;
			case "Cupidon":
				if (players.some(player => player.options.couple)) return;
				const player_1 = await selectPlayer(this.member, players, "Quel joueur souhaites-tu mettre en couple ? (1er joueur)");
				const player_2 = await selectPlayer(this.member, players, "Quel joueur souhaites-tu mettre en couple ? (2ème joueur)");
				player_1.setOption("couple", player_2);
				player_2.setOption("couple", player_1);
				this.member.send(`**${player_1.member.user.username}** et **${player_2.member.user.username}** sont maintenant en couple !`).catch(console.error);
				break;
			case "Chasseur":
				const player = await selectPlayer(this.member, players, "Quel joueur souhaites-tu tuer lors de ta mort ?");
				this.setOption("avenge", player);
				this.member.send(`**${ player.member.user.username }** mourra avec toi !`).catch(console.error);
				break;
			case "Petite fille":
				this.member.send({
					embed: {
						title: "Espionne les loups-garous !",
						color: "#010101",
						description: "Vas voir <#764767902124474378> pour espionner le chat des loups-garous",
						footer: {
							text: "🐺 Mayze 🐺"
						}
					}
				}).catch(console.error);
				break;
			default:
				this.member.send({
					embed: {
						embed: {
							title: "Rien à faire cette nuit...",
							color: "#010101",
							description: "Fais de beaux rêves 😴",
							footer: {
								text: "🐺 Mayze 🐺"
							}
						}
					}
				}).catch(console.error);
		}
	}
};

export default Player;