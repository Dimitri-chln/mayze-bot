const command = {
	name: "unbelievaboat-buy",
	description: "Achète un objet de shop Unbelievaboat",
	aliases: ["unb-buy", "buy"],
	args: 1,
	usage: "<objet>",
	async execute(message, args) {
		const { shop } = require("./unbelievaboat-shop.js");
		const input = args.join(" ").toLowerCase();
		const item = shop.find(i => i.name.toLowerCase() === input || i.name.toLowerCase().includes(input));
		if (!item) {
			try { message.reply("cet objet n'existe pas"); }
			catch (err) { console.log(err); }
		}
		const unbAPI = require("unb-api");
		const unbClient = new unbAPI.Client(process.env.UNB_TOKEN);
		
		var user;
		try { user = await unbClient.getUserBalance(message.guild.id, message.author.id);}
		catch (err) {
			console.log(err);
			try { message.channel.send("Quelque chose s'est mal passé en joignant l'API d'UnbelievaBoat :/"); }
			catch (err) { console.log(err); }
			return;
		}
		if (item.price > user.cash) {
			try { message.reply("tu n'as pas assez d'argent pour acheter cet objet"); }
			catch (err) { console.log(err); }
			return;
		}
		try { await unbClient.editUserBalance(message.guild.id, message.author.id, {cash: - item.price, bank: 0}, `Bought '${item.name}'`); }
		catch (err) {
			console.log(err);
			try { message.channel.send("Quelque chose s'est mal passé en joignant l'API d'UnbelievaBoat :/"); }
			catch (err) { console.log(err); }
			return;
		}
		try { item.buy(message); }
		catch (err) {
			console.log(err);
			try { message.channel.send("Quelque chose s'est mal passé en achetant l'objet :/"); }
			catch (err) { console.log(err); }
			return;
		}
		try {
			message.channel.send({
				embed: {
					author: {
						name: `${message.author.username}#${message.author.discriminator}`,
						icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
					},
					color: "#010101",
					description: `${message.author} a acheté "${item.name}" pour ✨${item.price}`,
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			});
		} catch (err) { console.log(err); }
	}
};

module.exports = command;