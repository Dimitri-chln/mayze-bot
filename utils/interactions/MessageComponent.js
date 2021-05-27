const { Client, Guild, TextChannel, User, GuildMember, Message, DiscordAPIError } = require("discord.js");
const Axios = require("axios").default;

class MessageComponent {
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
	/**@type {Message} */
	message;
	/**@type {string} */
	customID;

	/**
	 * @param {Object} interaction 
	 * @param {Client} client 
	 */
	constructor(interaction, client) {
		this.id = interaction.id;
		this.token = interaction.token;
		this.base = interaction;
		this.client = client;
		this.applicationID = interaction.application_id;
		this.guild = this.client.guilds.cache.get(interaction.guild_id);
		this.member = this.guild.members.cache.get(interaction.member.user.id);
		this.author = this.member.user;
		this.channel = this.client.channels.cache.get(interaction.channel_id);
		this.message = new Message(client, interaction.message, this.channel);
		this.customID = interaction.data.custom_id;
	}

	async acknowledge() {
		const url = `https://discord.com/api/v8/interactions/${this.id}/${this.token}/callback`;

		await Axios.post(url, { type: 6 })
			.catch(err => {
				console.error(err);
				throw new DiscordAPIError(err.response.request.path, err.response.data, "post", err.response.status);
			});
	}
}

module.exports = MessageComponent;