const command = {
	name: "ping",
	description: "Pong!",
	aliases: ["pong"],
	args: 0,
	usage: "",
	async execute(message, args) {
	try { message.channel.send(`Pong! **${ message.client.ws.ping }**ms`); }
	catch (err) { console.log(err); }
	}
};

module.exports = command;