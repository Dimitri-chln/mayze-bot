import Player from "./Player";

export default class PlayerList {
	private readonly _players: Player[];

	constructor() {
		this._players = [];
	}

	get all() {
		return this._players;
	}

	get villagers() {
		return this._players.filter((player) => player.team === "VILLAGE");
	}

	get werewolves() {
		return this._players.filter((player) => player.team === "WEREWOLVES");
	}

	get alive() {
		return this._players.filter((player) => player.alive);
	}

	get dead() {
		return this._players.filter((player) => !player.alive);
	}

	get attacked() {
		return this._players.find((player) => player.attacked);
	}

	selectListFor(player: Player) {
		return this.alive.filter((p) => player.member.user.id !== p.member.user.id);
	}

	add(player: Player) {
		this._players.push(player);
	}

	shuffle() {
		this._players.sort(() => Math.random() - 0.5);
	}
}
