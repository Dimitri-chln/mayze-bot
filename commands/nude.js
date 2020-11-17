const command = {
	name: "nude",
	description: "Miam 😏",
	aliases: ["miam"],
	cooldown: 600,
	args: 0,
	usage: "",
	async execute(message, args) {
		const nudes = require("../assets/nudes.json");
		try { message.react("😏"); }
		catch (err) { console.log(err); }
		try {
			message.author.send({
				embed: {
					title: "Miam 😏",
					color: "#010101",
					image: {
						url: nudes[Math.floor(Math.random() * nudes.length)]
					},
					footer: {
						text: "✨Mayze✨"
					}
				}
			});
		} catch (err) {
			console.log(err);
			try { message.reply("je n'ai pas pu t'envoyer de DM :/ As-tu désactivé les messages privés?"); }
			catch (err) { console.log(err); }
		}
	}
};

module.exports = command;