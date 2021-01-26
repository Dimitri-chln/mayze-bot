const { Client, Guild, Channel, User, GuildMember } = require("discord.js");

class EnhancedInteraction {
	/**@type {Object} */
	#base;
	/**@type {Client} */
	#client;
	/**@type {Guild} */
	#guild;
	/**@type {Channel} */
	#channel;
	/**@type {User} */
	#author;
	/**@type {GuildMember} */
	#member;

	/**
	 * @param {Object} interaction 
	 * @param {Client} client 
	 */
	constructor(interaction, client) {
		this.#base = interaction;
		this.#client = client;
		if (interaction.guild_id) this.#guild = this.#client.guilds.cache.get(interaction.guild_id);
		if (interaction.channel_id) this.#channel = this.#client.channels.cache.get(interaction.channel_id);
		if (interaction.member) this.#member = this.#guild.members.cache.get(interaction.member.user.id);
		this.#author = this.#member.user;
	}

	get base() { return this.#base; }
	get client() { return this.#client; }
	get guild() { return this.#guild; }
	get channel() { return this.#channel; }
	get author() { return this.#author; }
	get member() { return this.#member; }

	/**
	 * @param {string} content The reply message
	 */
	async reply(content) {
		const message = await this.channel.send(`${this.author}, ${content}`);
		return message;
	}
}

module.exports = EnhancedInteraction;