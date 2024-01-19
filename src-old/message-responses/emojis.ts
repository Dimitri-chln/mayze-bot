import MessageResponse from "../types/structures/MessageResponse";
import Util from "../Util";

const messageResponse: MessageResponse = {
	name: "emojis",
	noBot: true,
	noDM: true,
	guildIds: [Util.config.MAIN_GUILD_ID, "590859421958275092"],

	run: async (message, translations) => {
		if (!Util.guildConfigs.get(message.guild.id).webhookId) return;

		const emojiRegex = /(?<!<a?):[\w-_]+:(?!>)/g;

		if (emojiRegex.test(message.content)) {
			const emojiNames = message.content.match(emojiRegex).map((e) => e.match(/[\w-_]+/)[0]);

			if (
				!emojiNames.every((emojiName) =>
					message.client.emojis.cache.find((emoji) => emoji.name === emojiName && emoji.available),
				)
			)
				return;

			message.delete().catch(console.error);

			const newMsg = message.content
				.replace(
					emojiRegex,
					(a) => `${message.client.emojis.cache.find((e) => e.name === a.match(/[\w-_]+/)[0]).toString()}`,
				)
				.trim();

			const webhook = await message.client.fetchWebhook(Util.guildConfigs.get(message.guild.id).webhookId);

			if (webhook.channelId !== message.channel.id) await webhook.edit({ channel: message.channel.id });

			webhook.send({
				content: newMsg,
				avatarURL: message.author.displayAvatarURL(),
				username: message.member.displayName,
			});
		}
	},
};

export default messageResponse;
