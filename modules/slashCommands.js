const axios = require("axios").default;

class SlashCommands {
	/** @type {string} */
	#token;
	/** @type {string} */
	#clientID;
	/** @type {string} */
	#apiURL;

	constructor(token, clientID) {
		this.#token = token;
		this.#clientID = clientID;
		this.#apiURL = `https://discord.com/api/v8/applications/${this.clientID}`;
	}

	get token() { return this.#token; }
	get clientID() { return this.#clientID; }
	get apiURL() { return this.#apiURL; }

	/**
	 * Creates a new slash command
	 * @param {Object} commandOptions 
	 * @param {string} [guildID] 
	 */
	async create(commandOptions, guildID) {
		const url = guildID ? `${this.apiURL}/guilds/${guildID}/commands` : `${this.apiURL}/commands`;
		const res = await axios.post(url, commandOptions, { headers: { Authorization: `Bot ${this.token}` } });
		return res.data;
	}

	/**
	 * Edits a slash command
	 * @param {string} commandID
	 * @param {Object} commandOptions 
	 * @param {string} [guildID] 
	 */
	async edit(commandID, commandOptions, guildID) {
		const url = guildID ? `${this.apiURL}/guilds/${guildID}/commands/${commandID}` : `${this.apiURL}/commands/${commandID}`;
		const res = await axios.patch(url, commandOptions, { headers: { Authorization: `Bot ${this.token}` } });
		return res.data;
	}

	/**
	 * Deletes a slash command
	 * @param {string} commandID
	 * @param {string} [guildID] 
	 */
	async delete(commandID, guildID) {
		const url = guildID ? `${this.apiURL}/guilds/${guildID}/commands/${commandID}` : `${this.apiURL}/commands/${commandID}`;
		const res = await axios.delete(url, { headers: { Authorization: `Bot ${this.token}` } });
		return res.data;
	}

	/**
	 * Fetches all the slash commands
	 * @param {string} [guildID]
	 */
	async get(guildID) {
		const url = guildID ? `${this.apiURL}/guilds/${guildID}/commands` : `${this.apiURL}/commands`;
		const res = await axios.get(url, { headers: { Authorization: `Bot ${this.token}` } });
		return res.data;
	}
}

module.exports = SlashCommands;