const { Client, Guild, TextChannel, User, GuildMember, Message, DiscordAPIError } = require("discord.js");
const Axios = require("axios").default;

class SlashCommand {
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
	/**@type {TextChannel} */
	channel;
	/**@type {User} */
	author;
	/**@type {GuildMember} */
	member;
	/**@type {boolean} */
	isInteraction = true;

	/**
	 * @param {Object} interaction 
	 * @param {Client} client 
	 */
	constructor(interaction, client) {
		this.id = interaction.id;
		this.token = interaction.token;
		this.base = interaction;
		this.client = client;
		this.applicationID = this.client.user.id;
		this.guild = this.client.guilds.cache.get(interaction.guild_id);
		this.member = this.guild.members.cache.get(interaction.member.user.id);
		this.author = this.member.user;

		/**@type {TextChannel} */
		let channel = this.client.channels.cache.get(interaction.channel_id);
		this.channel = {
			client: this.client,
			id: channel.id,
			name: channel.name,
			type: channel.type,
			topic: channel.topic,
			send: async (data, { ephemeral = false } = {}) => {
				const url = `https://discord.com/api/v8/webhooks/${this.applicationID}/${this.token}/messages/@original`;
		
				if (typeof data === "string") data = { content: data };
				if (data.embed) {
					data.embeds = [ data.embed ];
					delete data.embed;
				}
				if (ephemeral) data.flags = 64;
		
				const res = await Axios.patch(url, data, { "Content-Type": "application/json" })
					.catch(err => {
						console.error(err);
						throw new DiscordAPIError(err.response.request.path, err.response.data, "patch", err.response.status);
					});
				
				return new Message(this.client, res.data, this.channel);
			},
			createMessageCollector: channel.createMessageCollector,
			awaitMessages: channel.awaitMessages,
			bulkDelete: channel.bulkDelete
		};
	}

	async acknowledge() {
		const url = `https://discord.com/api/v8/interactions/${this.id}/${this.token}/callback`;

		await Axios.post(url, { type: 5 })
			.catch(err => {
				console.error(err);
				throw new DiscordAPIError(err.response.request.path, err.response.data, "post", err.response.status);
			});
	}

	async reply(data, { ephemeral = false } = {}) {
		const url = `https://discord.com/api/v8/webhooks/${this.applicationID}/${this.token}/messages/@original`;

		if (typeof data === "string") data = { content: data };
		if (data.embed) {
			data.embeds = [ data.embed ];
			delete data.embed;
		}
		if (ephemeral) data.flags = 64;

		data.content = data.content.replace(/^./, a => a.toUpperCase());

		const res = await Axios.patch(url, data, { "Content-Type": "application/json" })
			.catch(err => {
				console.error(err);
				throw new DiscordAPIError(err.response.request.path, err.response.data, "patch", err.response.status);
			});

		return new Message(this.client, res.data, this.channel);
	}
}

module.exports = SlashCommand;