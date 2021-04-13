const { Client, Guild, Channel, User, GuildMember, TextChannel, Message, DiscordAPIError } = require("discord.js");
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
			send: async (data) => {
				const url = `https://discord.com/api/v8/webhooks/${this.applicationID}/${this.token}/messages/@original`;
		
				if (typeof data === "string") data = { content: data };
				if (data.embed) {
					data.embeds = [ data.embed ];
					delete data.embed;
				}
		
				const res = await Axios.patch(url, data, { "Content-Type": "application/json" }).catch(console.error);
				
				if (!res.isAxiosError) return new Message(this.client, res.data, this.channel);
				else throw new DiscordAPIError(res.response.path, res.response.data, "patch", res.response.status);
			}
		};
	}

	async acknowledge() {
		const url = `https://discord.com/api/v8/interactions/${this.id}/${this.token}/callback`;

		const res = await Axios.post(url, {
			type: 5,
		}).catch(console.error);

		if (res.isAxiosError) throw new DiscordAPIError(res.response.path, res.response.data, "patch", res.response.status);
	}

	async reply(data) {
		const url = `https://discord.com/api/v8/webhooks/${this.applicationID}/${this.token}/messages/@original`;

		if (typeof data === "string") data = { content: data };
		if (data.embed) {
			data.embeds = [ data.embed ];
			delete data.embed;
		}
		data.content = data.content.replace(/^./, a => a.toUpperCase());

		const res = await Axios.patch(url, data, { "Content-Type": "application/json" }).catch(console.error);

		if (!res.isAxiosError) return new Message(this.client, res.data, this.channel);
		else throw new DiscordAPIError(res.response.path, res.response.data, "patch", res.response.status);
	}
}

module.exports = EnhancedInteraction;