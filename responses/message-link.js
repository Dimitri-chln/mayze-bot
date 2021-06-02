const { Message } = require("discord.js");

const language = {
    get: (text, ...args) => text
		.replace(/\{\d+?\}/g, a => args[parseInt(a.replace(/[\{\}]/g, "")) - 1])
		.replace(/\[\d+?\?.*?:.*?\]/gs, a => {
			let m = a.match(/\[(\d+?)\?(.*?):(.*?)\]/s);
			if (args[parseInt(m[1]) - 1]) return m[2];
			else return m[3];
		}),
    message_link: {
        fr: "[Aller au message]({1})",
        en: "[Go to message]({1})"
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
	async execute(message) {
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
	    const res = await message.client.pg.query(`SELECT * FROM languages WHERE guild_id = '${message.guild.id}'`).catch(console.error);
	    if (res && res.rows.length) lang = res.rows[0].language_code;

		const embed = {
			embed: {
				author: {
					name: msg.author.tag,
					icon_url: msg.author.avatarURL({ dynamic: true })
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
		};

		if (channelID === message.channel.id) msg.reply(embed);
		else message.channel.send(embed).catch(console.error);
	}
};

module.exports = command;