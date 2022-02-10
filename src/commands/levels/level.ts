import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import getLevel from "../../utils/misc/getLevel";
import { DatabaseLevel } from "../../types/structures/Database";

const command: Command = {
	name: "level",
	aliases: [],
	description: {
		fr: "Obtenir ton niveau sur Mayze",
		en: "Get your chat level with Mayze",
	},
	usage: "",
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],

	options: {
		fr: [
			{
				name: "user",
				description: "L'utilisateur dont tu veux voir le niveau",
				type: "USER",
				required: false,
			},
		],
		en: [
			{
				name: "user",
				description: "The user whose level you want to see",
				type: "USER",
				required: false,
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const barSize = 20,
			xpBar = {
				full: "█",
				empty: "▁",
			};

		const user = interaction.options.getUser("user") ?? interaction.user;

		let { rows: chatLeaderboard }: { rows: DatabaseLevel[] } =
			await Util.database.query("SELECT * FROM level ORDER BY chat_xp DESC");
		let { rows: voiceLeaderboard }: { rows: DatabaseLevel[] } =
			await Util.database.query("SELECT * FROM level ORDER BY voice_xp DESC");

		chatLeaderboard = chatLeaderboard.filter((u) =>
			interaction.guild.members.cache.has(u.user_id),
		);
		voiceLeaderboard = voiceLeaderboard.filter((u) =>
			interaction.guild.members.cache.has(u.user_id),
		);

		const userChatData = chatLeaderboard.find((u) => u.user_id === user.id);
		const chatXp = userChatData ? userChatData.chat_xp : 0;
		const chatRank = chatLeaderboard.indexOf(userChatData) + 1;
		const chatLevel = getLevel(chatXp);

		const userVoiceData = voiceLeaderboard.find((u) => u.user_id === user.id);
		const voiceXp = userVoiceData ? userVoiceData.voice_xp : 0;
		const voiceRank = voiceLeaderboard.indexOf(userVoiceData) + 1;
		const voiceLevel = getLevel(voiceXp);

		interaction.followUp({
			embeds: [
				{
					author: {
						name: user.tag,
						iconURL: user.displayAvatarURL({ dynamic: true }),
					},
					color: interaction.guild.me.displayColor,
					fields: [
						{
							name: translations.strings.chat_title(),
							value: translations.strings.description(
								chatLevel.level.toString(),
								chatRank.toString(),
								xpBar.full.repeat(
									Math.round(
										(chatLevel.currentXP / chatLevel.neededXP) * barSize,
									),
								) +
									xpBar.empty.repeat(
										barSize -
											Math.round(
												(chatLevel.currentXP / chatLevel.neededXP) * barSize,
											),
									),
								chatLevel.currentXP.toString(),
								chatLevel.neededXP.toString(),
							),
							inline: true,
						},
						{
							name: translations.strings.voice_title(),
							value: translations.strings.description(
								voiceLevel.level.toString(),
								voiceRank.toString(),
								xpBar.full.repeat(
									Math.round(
										(voiceLevel.currentXP / voiceLevel.neededXP) * barSize,
									),
								) +
									xpBar.empty.repeat(
										barSize -
											Math.round(
												(voiceLevel.currentXP / voiceLevel.neededXP) * barSize,
											),
									),
								voiceLevel.currentXP.toString(),
								voiceLevel.neededXP.toString(),
							),
							inline: true,
						},
					],
					footer: {
						text: "✨ Mayze ✨",
					},
				},
			],
		});
	},
};

export default command;
