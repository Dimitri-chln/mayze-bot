const command = {
	name: "uptime",
	description: "Temps depuis lequel le bot est en ligne",
	aliases: [],
	args: 0,
	usage: "",
	async execute(message, args) {
		const timeToString = require("../modules/timeToString.js");
		const uptime = Date.now() - message.client.readyAt;
		const uptimeString = timeToString(uptime / 1000);
		message.channel.send(`Je suis en ligne depuis ${uptimeString}!`).catch(console.error);
	}
};

module.exports = command;