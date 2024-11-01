import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField, User } from "discord.js";
import Util from "../../Util";

import { DatabaseUser } from "../../types/Database";

import getLevel from "../../utils/misc/getLevel";

const command: CommandData = {
	name: "level",
	aliases: ["lvl"],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField([PermissionFlagsBits.EmbedLinks]),

	options: [
		{
			type: ApplicationCommandOptionType.User,
			name: "user",
			description: undefined,
			required: false,
		},
	],

	async run(input, args, localizations) {
		const user = (args.get("user") as User) ?? input.user;

		const barSize = 20;
		const xpBar = {
			full: "█",
			empty: "▁",
		};

		let { rows: chatLeaderboard }: { rows: Pick<DatabaseUser, "id" | "level_chat_xp">[] } = await Util.database.query(
			'SELECT id, level_chat_xp FROM "user" ORDER BY level_chat_xp DESC',
		);
		let { rows: voiceLeaderboard }: { rows: Pick<DatabaseUser, "id" | "level_voice_xp">[] } = await Util.database.query(
			'SELECT id, level_voice_xp FROM "user" ORDER BY level_voice_xp DESC',
		);

		chatLeaderboard = chatLeaderboard.filter((u) => input.guild.members.cache.has(u.id));
		voiceLeaderboard = voiceLeaderboard.filter((u) => input.guild.members.cache.has(u.id));

		const userChatData = chatLeaderboard.find((u) => u.id === user.id);
		const chatXp = userChatData?.level_chat_xp ?? 0;
		const chatRank = chatLeaderboard.indexOf(userChatData) + 1;
		const chatLevel = getLevel(chatXp);

		const userVoiceData = voiceLeaderboard.find((u) => u.id === user.id);
		const voiceXp = userVoiceData?.level_voice_xp ?? 0;
		const voiceRank = voiceLeaderboard.indexOf(userVoiceData) + 1;
		const voiceLevel = getLevel(voiceXp);

		input.reply({
			embeds: [
				{
					author: {
						name: user.tag,
						icon_url: user.displayAvatarURL(),
					},
					color: input.guild.members.me.displayColor,
					fields: [
						{
							name: localizations.text_level.format(input.locale),
							value: localizations.description.format(
								input.locale,
								chatLevel.level.toString(),
								chatRank.toString(),
								xpBar.full.repeat(Math.round((chatLevel.currentXp / chatLevel.neededXp) * barSize)) +
									xpBar.empty.repeat(barSize - Math.round((chatLevel.currentXp / chatLevel.neededXp) * barSize)),
								chatLevel.currentXp.toString(),
								chatLevel.neededXp.toString(),
							),
							inline: true,
						},
						{
							name: localizations.voice_level.format(input.locale),
							value: localizations.description.format(
								input.locale,
								voiceLevel.level.toString(),
								voiceRank.toString(),
								xpBar.full.repeat(Math.round((voiceLevel.currentXp / voiceLevel.neededXp) * barSize)) +
									xpBar.empty.repeat(barSize - Math.round((voiceLevel.currentXp / voiceLevel.neededXp) * barSize)),
								voiceLevel.currentXp.toString(),
								voiceLevel.neededXp.toString(),
							),
							inline: true,
						},
					],
					footer: {
						text: Util.config.DEFAULT_EMBED_FOOTER_TEXT,
					},
				},
			],
		});
	},
};

export default command;
