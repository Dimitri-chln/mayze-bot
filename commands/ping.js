const command = {
	name: "ping",
	description: "Pong!",
	aliases: ["pong"],
	args: 0,
	usage: "",
	async execute(message, args) {
	message.channel.send(`Pong! **${ message.client.ws.ping }**ms`).catch(console.error);
	}
};

module.exports = command;