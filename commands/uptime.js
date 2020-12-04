const command = {
	name: "uptime",
	description: "Temps depuis lequel le bot est en ligne",
	aliases: [],
	args: 0,
	usage: "",
	async execute(message, args) {
		const dateToString = require("../modules/dateToString.js");
		const uptime = Date.now() - message.client.readyAt;
		const uptimeString = dateToString(uptime / 1000);
		message.channel.send(`Je suis en ligne depuis ${uptimeString}!`).catch(console.error);
	}
};

module.exports = command;