const command = {
	name: "unbelievaboat-balance",
	description: "Vérifie combien d'argent tu possèdes sur UnbelieveBoat",
	aliases: ["unb-balance", "unbelievaboat-bal", "balance", "bal"],
	args: 0,
	usage: "",
	async execute(message, args) {
		const unbAPI = require("unb-api");
		const unbClient = new unbAPI.Client(process.env.UNB_TOKEN);
		
		var user;
		try { user = await unbClient.getUserBalance(message.guild.id, message.author.id); }
		catch (err) {
			console.log(err);
			return message.channel.send("Quelque chose s'est mal passé en joignant l'API d'UnbelievaBoat :/").catch(console.error);
		}
		try {
			message.channel.send({
				embed: {
					author: {
						name: `Balance Unbelievaboat de ${message.author.tag}`,
						icon_url: message.author.avatarURL({ dynamic: true })
					},
					color: "#010101",
					description: `• Rang: **#${user.rank.toLocaleString()}**\n• Cash: **✨${user.cash.toLocaleString()}**\n• Bank: **✨${user.bank.toLocaleString()}**\n• Total: **✨${user.total.toLocaleString()}**`,
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			});
		} catch (err) { console.log(err); }
	}
};

module.exports = command;