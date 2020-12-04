const { Message } = require("discord.js");

const command = {
	name: "nick",
	description: "Modifie ou réinitialise ton pseudo sur le serveur",
	aliases: ["name", "rename"],
	args: 0,
	usage: "[pseudo]",
	perms: ["CHANGE_NICKNAME"],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async execute(message, args) {
		message.delete().catch(console.error);
		message.member.setNickname(args.join(" ")).catch(async err => {
			if (err.message === "Missing Permissions") {
				const msg = await message.reply("je n'ai pas la permission de changer ton pseudo").catch(console.error);
				msg.delete({ timeout: 5000 }).catch(console.error);
				return;
			}
			console.error(err);
		});
	}
};

module.exports = command;