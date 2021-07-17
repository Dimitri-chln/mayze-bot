const { Message } = require("discord.js");

const command = {
	name: "level",
	description: {
		fr: "Obtenir ton niveau sur Mayze",
		en: "Get your chat level with Mayze"
	},
	aliases: ["lvl"],
	args: 0,
	usage: "[<user>]",
	botPerms: ["EMBED_LINKS"],
	category: "levels",
	slashOptions: [
		{
			name: "user",
			description: "The user you want to get the level from",
			type: 6,
			required: false
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const getLevel = require("../utils/getLevel");
		const xpBar = ["█", "▁"], barSize = 20;

		const user = args
			? args.length ? message.mentions.users.first() || message.client.findMember(message.guild, args.join(" "))?.user || message.author : message.author
			: message.client.users.cache.get(options ? options[0].value : null) || message.author;

		let { "rows": chatTop } = (await message.client.pg.query("SELECT * FROM levels ORDER BY chat_xp DESC").catch(console.err)) || {};
		let { "rows": voiceTop } = (await message.client.pg.query("SELECT * FROM levels ORDER BY voice_xp DESC").catch(console.err)) || {};
		if (!chatTop || !voiceTop) return;
		chatTop = chatTop.filter(u => message.guild.members.cache.has(u.user_id));
		voiceTop = voiceTop.filter(u => message.guild.members.cache.has(u.user_id));
		
		const userChatData = chatTop.find(u => u.user_id === user.id);
		const chatXP = userChatData ? userChatData.chat_xp : 0;
		const chatRank = chatTop.indexOf(userChatData) + 1;
		const chatLevel = getLevel(chatXP);

		const userVoiceData = voiceTop.find(u => u.user_id === user.id);
		const voiceXP = userVoiceData ? userVoiceData.voice_xp : 0;
		const voiceRank = voiceTop.indexOf(userVoiceData) + 1;
		const voiceLevel = getLevel(voiceXP);

		message.channel.send({
			embed: {
				author: {
					name: user.tag,
					icon_url: user.displayAvatarURL({ dynamic: true })
				},
				color: message.guild.me.displayColor,
				fields: [
					{
						name: language.chat_title,
						value: language.get(language.chat_description, chatLevel.level, chatRank, xpBar[0].repeat(Math.round(chatLevel.currentXP / chatLevel.neededXP * barSize)) + xpBar[1].repeat(barSize - Math.round(chatLevel.currentXP / chatLevel.neededXP * barSize)), chatLevel.currentXP, chatLevel.neededXP),
						inline: true
					},
					{
						name: language.voice_title,
						value: language.get(language.voice_description, voiceLevel.level, voiceRank, xpBar[0].repeat(Math.round(voiceLevel.currentXP / voiceLevel.neededXP * barSize)) + xpBar[1].repeat(barSize - Math.round(voiceLevel.currentXP / voiceLevel.neededXP * barSize)), voiceLevel.currentXP, voiceLevel.neededXP),
						inline: true
					}
				],
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;