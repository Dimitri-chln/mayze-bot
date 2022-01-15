const { Message } = require("discord.js");

const language = {
	get: require("../utils/parseLanguageText"),
	message_link: {
		fr: "~sAller au message~t({1})",
		en: "~sGo to message~t({1})"
	},
	quoted_by: {
		fr: "Cité par {1}",
		en: "Quoted by {1}"
	}
};

const command = {
	/**
	 * @param {Message} message 
	 */
	async run(message) {
		if (message.channel.type === "dm" || message.author.bot || !["689164798264606784"].includes(message.guild.id)) return;
		
		const regex = /https:\/\/(?:cdn\.)?discord(?:app)?\.com\/channels\/(\d{18})\/(\d{18})\/(\d{18})/;
		if (!regex.test(message.content)) return;

		if (/^\*\s?rose(?:-lobby)?/.test(message.content)) return;
		
		const [ , guildID, channelID, messageID ] = message.content.match(regex);
		if (message.guild.id !== guildID) return;

		const channel = message.client.channels.cache.get(channelID);
		const msg = await channel.messages.fetch(messageID).catch(console.error);
		if (!msg || msg.embeds.length) return;

		let lang = "en";
		const res = await message.client.database.query(`SELECT * FROM languages WHERE guild_id = '${message.guild.id}'`).catch(console.error);
		if (res && res.rows.length) lang = res.rows[0].language_code;

		message.channel.send({
			embed: {
				author: {
					name: msg.author.tag,
					iconURL: msg.author.displayAvatarURL({ dynamic: true })
				},
				title: `#${channel.name}`,
				color: message.guild.me.displayColor,
				description: msg.content,
				fields: [
					{ name: "\u200b", value: language.get(language.message_link[lang], msg.url) }
				],
				image: {
					url: (msg.attachments.first() || {}).url
				},
				footer: {
					text: language.get(language.quoted_by[lang], message.author.username)
				},
				timestamp: msg.createdTimestamp
			}
		}).catch(console.error);
	}
};

module.exports = command;