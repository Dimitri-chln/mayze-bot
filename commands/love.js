const command = {
	name: "love",
	description: "Calcule le pourcentage d'amour entre 2 personnes",
	aliases: [],
	args: 1,
	usage: "<mention/texte> [mention/texte]",
	async execute(message, args) {
		const love1 = message.mentions.users.first() || args[0];
		const love2 = message.mentions.users.first(2)[1] || args[1] || message.author;
		try {
			message.channel.send({
				embed: {
					title: "💕 Love Calculator 💕",
					color: "#010101",
					description: `${love1} + ${love2} = ${Math.round(Math.random() * 100)}%`,
					footer: {
						text: "✨Mayze✨"
					}
				}
			});
		} catch (err) { console.log(err); }
	}
};

module.exports = command;