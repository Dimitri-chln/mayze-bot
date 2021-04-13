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

		let channel = this.client.channels.cache.get(interaction.channel_id);
		this.channel = {
			id: channel.id,
			name: channel.name,
			type: channel.type,
			send: async (data) => {
				const url = `https://discord.com/api/v8/interactions/${this.id}/${this.token}/callback`;
		
				if (typeof data === "string") data = { content: data };
				if (data.embed) {
					data.embeds = [ data.embed ];
					delete data.embed;
				}
		
				const res = await Axios.post(url, {
					type: 4,
					data
				}).catch(console.error);
			},
			startTyping: channel.startTyping,
			stopTyping: channel.stopTyping
		};
	}

	async reply(data) {
		const url = `https://discord.com/api/v8/interactions/${this.id}/${this.token}/callback`;

		if (typeof data === "string") data = { content: data };
		if (data.embed) {
			data.embeds = [ data.embed ];
			delete data.embed;
		}
		data.content = data.content.replace(/^./, a => a.toUpperCase());

		const res = await Axios.post(url, {
			type: 4,
			data
		}).catch(console.error);
	}
}

module.exports = EnhancedInteraction;