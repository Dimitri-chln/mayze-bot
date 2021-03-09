const { Client, Guild, Channel, User, GuildMember } = require("discord.js");
const Axios = require("axios").default;

class EnhancedInteraction {
	/**@type {string} */
	id;
	/**@type {string} */
	token;
	/**@type {Object} */
	base;
	/**@type {Client} */
	client;
	/**@type {string} */
	applicationID;
	/**@type {Guild} */
	guild;
	/**@type {Channel} */
	channel;
	/**@type {User} */
	author;
	/**@type {GuildMember} */
	member;

	/**
	 * @param {Object} interaction 
	 * @param {Client} client 
	 */
	constructor(interaction, client) {
		this.isInteraction = true;
		this.id = interaction.id;
		this.token = interaction.token;
		this.base = interaction;
		this.client = client;
		this.applicationID = this.client.user.id;
		if (interaction.guild_id) this.guild = this.client.guilds.cache.get(interaction.guild_id);
		if (interaction.channel_id) this.channel = this.client.channels.cache.get(interaction.channel_id);
		if (interaction.member) this.member = this.guild.members.cache.get(interaction.member.user.id);
		this.author = this.member.user;
	}

	/**
	 * @param {string} content The reply message
	 */
	async reply(content) {
		const message = await this.channel.send(`${this.author}, ${content}`);
		return message;
	}

	async acknowledge() {
		const url = `https://discord.com/api/v8/interactions/${this.id}/${this.token}/callback`;

		const res = await Axios.post(url, {
			type: 4,
			data: {
				content: "Command received",
				flags: 64
			}
		}).catch(console.error);

		return res;
	}

	/**
	 * @param {string} content
	 */
	async respond(content) {
		const url = `https://discord.com/api/v8/webhooks/${this.applicationID}/${this.id}/${this.token}/messages/@original`;

		const res = await Axios.patch(url, {
			content,
		}).catch(console.error);

		return res;
	}

	async delete() {
		const url = `https://discord.com/api/v8/webhooks/${this.applicationID}/${this.id}/${this.token}/messages/@original`;

		const res = await Axios.delete(url).catch(console.error);

		return res;
	}
}

module.exports = EnhancedInteraction;