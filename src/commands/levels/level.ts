import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import LanguageStrings from "../../types/structures/LanguageStrings";
import Util from "../../Util";

import getLevel from "../../utils/misc/getLevel";



const command: Command = {
	name: "level",
	description: {
		fr: "Obtenir ton niveau sur Mayze",
		en: "Get your chat level with Mayze"
	},
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],
	
	options: {
		fr: [
			{
				name: "user",
				description: "L'utilisateur dont tu veux voir le niveau",
				type: "USER",
				required: false
			}
		],
		en: [
			{
				name: "user",
				description: "The user whose level you want to see",
				type: "USER",
				required: false
			}
		]
	},
	
	run: async (interaction: CommandInteraction, languageStrings: LanguageStrings) => {
		const barSize = 20, xpBar = {
			full: "█",
			empty: "▁"
		};

		const user = interaction.options.getUser("user") ?? interaction.user;

		let { rows: chatLeaderboard } = await Util.database.query(
			"SELECT * FROM levels ORDER BY chat_xp DESC"
		);
		let { rows: voiceLeaderboard } = await Util.database.query(
			"SELECT * FROM levels ORDER BY voice_xp DESC"
		);
		
		chatLeaderboard = chatLeaderboard.filter(u => interaction.guild.members.cache.has(u.user_id));
		voiceLeaderboard = voiceLeaderboard.filter(u => interaction.guild.members.cache.has(u.user_id));
		
		const userChatData = chatLeaderboard.find(u => u.user_id === user.id);
		const chatXp = userChatData ? userChatData.chat_xp : 0;
		const chatRank = chatLeaderboard.indexOf(userChatData) + 1;
		const chatLevel = getLevel(chatXp);

		const userVoiceData = voiceLeaderboard.find(u => u.user_id === user.id);
		const voiceXp = userVoiceData ? userVoiceData.voice_xp : 0;
		const voiceRank = voiceLeaderboard.indexOf(userVoiceData) + 1;
		const voiceLevel = getLevel(voiceXp);

		interaction.reply({
			embeds: [
				{
					author: {
						name: user.tag,
						iconURL: user.displayAvatarURL({ dynamic: true })
					},
					color: interaction.guild.me.displayColor,
					fields: [
						{
							name: languageStrings.data.chat_title(),
							value: languageStrings.data.chat_description(
								chatLevel.level.toString(),
								chatRank.toString(),
								xpBar.full.repeat(Math.round(chatLevel.currentXP / chatLevel.neededXP * barSize)) + xpBar.empty.repeat(barSize - Math.round(chatLevel.currentXP / chatLevel.neededXP * barSize)),
								chatLevel.currentXP.toString(),
								chatLevel.neededXP.toString()
							),
							inline: true
						},
						{
							name: languageStrings.data.voice_title(),
							value: languageStrings.data.voice_description(
								voiceLevel.level.toString(),
								voiceRank.toString(),
								xpBar.full.repeat(Math.round(voiceLevel.currentXP / voiceLevel.neededXP * barSize)) + xpBar.empty.repeat(barSize - Math.round(voiceLevel.currentXP / voiceLevel.neededXP * barSize)),
								voiceLevel.currentXP.toString(),
								voiceLevel.neededXP.toString()
							),
							inline: true
						}
					],
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			]
		});
	}
};



export default command;