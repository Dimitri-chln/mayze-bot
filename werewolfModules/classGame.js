import { Channel, Client, Guild, Role } from "discord.js";
import Player from "./classPlayer";
import selectPlayer from "./selectPlayer";

class Game {
	/**
	 * @type {Client}
	 */
	#client;
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
	#littleGirlChannel;
	/**
	 * @type {Channel}
	 */
	#deadChannel;
	/**
	 * @type {Player[]}
	 */
	#players;
	/**
	 * @type {Player[]}
	 */
	#deadThisNight;
	/**
	 * @type {object}
	 */
	#options;

	/**
	 * @param {Client} client The Discord client
	 * @param {Role} roleIngame The role the players have when they are ingame
	 * @param {Role} roleVillage The role all villagers have
	 * @param {Role} roleWerwolves The role all werewolves have
	 * @param {Channel} villageChannel The channel where all the village can chat
	 * @param {Channel} werewolvesChannel The channel where the werewolves can chat
	 * @param {Channel} littleGirlChannel The channel where the little girl can see the werewolves' chat
	 * @param {Channel} deadChannel The channel where the dead players can chat
	 * @param {Player[]} players A list of all the players
	 * @param {object} option Additional information about the game
	 */
	constructor(client, roleIngame, roleVillage, roleWerwolves, villageChannel, werewolvesChannel, littleGirlChannel, deadChannel, players, options = {}) {
		this.#client = client;
		this.#roleIngame = roleIngame;
		this.#roleVillage = roleVillage;
		this.#roleWerwolves = roleWerwolves;
		this.#villageChannel = villageChannel;
		this.#werwolvesChannel = werewolvesChannel;
		this.#littleGirlChannel = littleGirlChannel;
		this.#deadChannel = deadChannel;
		this.#players = players;
		this.#deadThisNight = [];
		this.#option = options;
	}

	/**
	 * @returns {Client} The Discord client
	 */
	get client() { return this.#client; }

	/**
	 * @returns {Role} The role the players have when they are ingame
	 */
	get roleIngame() { return this.#roleIngame; }

	/**
	 * @returns {Role} The role all villagers have
	 */
	get roleVillage() { return this.#roleIngame; }

	/**
	 * @returns {Role} The role all werewolves have
	 */
	get roleWerwolves() { return this.#roleWerwolves; }

	/**
	 * @returns {Channel} The channel where all the village can chat
	 */
	get villageChannel() { return this.#villageChannel; }

	/**
	 * @returns {Channel} The channel where the werewolves can chat
	 */
	get werewolvesChannel() { return this.#werewolvesChannel; }

	/**
	 * @returns {Channel} The channel where the little girl can see the werewolves' chat
	 */
	get littleGirlChannel() { return this.#littleGirlChannel; }

	/**
	 * @returns {Channel} The channel where the dead players can chat
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
	 * @returns {Player[]} The list of the players that died this night
	 */
	get deadThisNight() { return this.#deadThisNight; }

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
	 * @param {Player} player 
	 */
	kill(player) {
		player.setDead();
		this.#deadThisNight.push(player);
		if (player.options.couple) { this.kill(player.options.couple); }
		if (player.options.avenge) { this.kill(player.options.avenge); }
	}

	/**
	 * Sets the beginning of the night
	 */
	async setNight() {
		this.#deadThisNight = [];
		this.villageChannel.updateOverwrite(this.roleIngame, { "SEND_MESSAGES": false });
		this.werewolvesChannel.updateOverwrite(this.roleWerwolves, { "SEND_MESSAGES": null });
		this.villageChannel.send({
			embed: {
				title: "La nuit tombe sur le village...",
				color: "#010101",
				footer: {
					text: "🐺 Mayze 🐺"
				}
			}
		});
		this.littleGirlChannel.send({
			embed: {
				title: "Début de la nuit",
				color: "#010101",
				description: "Espionne les loups-garous !",
				footer: {
					text: "🐺 Mayze 🐺"
				}
			}
		});
		this.alivePlayers.forEach(async player => {
			player.action(this.players);
		});
		const attackedPlayer = await selectPlayer(this.werewolvesChannel, this.players, "Quel joueur souhaitez-vous attaquer cette nuit ?");
		attackedPlayer.setOption("isAttacked", true);
		// witch
		this.kill(attackedPlayer);

		
	}

	/**
	 * Sets the beginning of the day
	 */
	async setDay() {
		this.villageChannel.send({
			embed: {
				title: "Le jour se lève sur le village...",
				color: "#010101",
				description: `Les joueurs qui sont morts cette nuit sont:\n${this.deadThisNight.map(player => `- **${player.member.user.username}** qui était **${player.role}**`).join(", ") || "*Personne !"}`,
				footer: {
					text: "🐺 Mayze 🐺"
				}
			}
		});
	}

	/**
	 * Ends the game
	 */
	async end() {
		const roles = [/*"759699864191107072", */"759701843864584202", "759702019207725089", "759703669221359637", "759703558445727786", "759703743104548894", "759703827133497386", "759703894720380928", "759703955956957205", "759704017570889728", "759704083173998604", "759704177587912704"];
		this.villageChannel.updateOverwrite(this.roleIngame, { "SEND_MESSAGES": null }).catch(console.error);
		this.werewolvesChannel.updateOverwrite(this.roleWerwolves, { "SEND_MESSAGES": false }).catch(console.error);
		this.players.forEach(async player => {
			player.member.roles.remove(this.guild.roles.cache.filter(role => roles.includes(role.id) && player.member.roles.cache.has(role))).catch(console.error);
			if (player.options.channelOverwrite) player.options.channelOverwrite.delete().catch(console.error);
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
	}
};

export default Game;