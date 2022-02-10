import MessageCommand from "../../types/structures/MessageCommand";
import Util from "../../Util";

const messageCommand: MessageCommand = {
	...Util.commands.get("kick-myself"),
	aliases: ["kickmyself", "kms", "4-4-2", "442"],
	usage: "",

	run: async (message, args, translations) => {
		// Server booster
		if (message.member.premiumSinceTimestamp)
			return message.reply(translations.strings.boosting());

		if (
			message.member.roles.highest.position >=
			message.guild.me.roles.highest.position
		)
			return message.reply(translations.strings.too_high_hierarchy());

		message.member.kick(translations.strings.reason()).then(() => {
			message.reply(translations.strings.kick_message(message.author.tag));
		});
	},
};

export default messageCommand;
