const { Message } = require("discord.js");

const command = {
	name: "test",
	description: "testest",
	aliases: [],
	args: 0,
	usage: "",
	ownerOnly: true,
	/**
	 * 
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options) => {
		// https://discord.com/api/webhooks/800791146456023111/RBX84XUa7V5ni-JSMkrHGYZKimO4VsRn5XGl2HGMXUoM65xo7_gGKNMyi6N5xUtNvbjQ
		const webhooks = await message.guild.fetchWebhooks();
		const webhook = webhooks.get("800791146456023111");
		await webhook.edit({ channel: message.channel.id });
		webhook.send("cc", { avatarURL: message.author.avatarURL(), username: message.member.nickname || message.author.username}).catch(console.error);
	}
};

module.exports = command;