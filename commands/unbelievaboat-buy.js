const { Message } = require("discord.js");
const { i } = require("mathjs");
const shop = require("../assets/unb-shop");

const command = {
	name: "unbelievaboat-buy",
	description: "Acheter un objet du shop Unbelievaboat",
	aliases: ["unb-buy", "buy"],
	args: 1,
	usage: "<objet>",
	onlyInGuilds: ["689164798264606784"],
	slashOptions: [
		{
			name: "objet",
			description: "L'objet à acheter",
			type: 3,
			required: true,
			choices: shop.map(i => {
				return { name: i.name, value: i.name }
			})
		}
	],
	/**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
		const item = args
			? shop.find(i => i.name.toLowerCase() === args.join(" ").toLowerCase() || i.name.toLowerCase().includes(args.join(" ").toLowerCase()))
			: shop.find(i => i.name.toLowerCase() === options[0].value);
		if (!item) return message.reply("cet objet n'existe pas").catch(console.error);
		const { Client } = require("unb-api");
		const unbClient = new Client(process.env.UNB_TOKEN);
		
		const user = await unbClient.getUserBalance(message.guild.id, message.author.id).catch(console.error);
		if (!user) return message.reply("Quelque chose s'est mal passé en accédant à l'API d'Unbelieveboat").catch(console.error);

		if (item.price > user.cash) return message.reply("tu n'as pas assez d'argent pour acheter cet objet").catch(console.error);

		try {
			await unbClient.editUserBalance(message.guild.id, message.author.id, {cash: - item.price, bank: 0}, `Bought '${item.name}'`);
		} catch (err) {
			console.error(err);
			return message.channel.send("Quelque chose s'est mal passé en accédant à l'API d'UnbelievaBoat :/").catch(console.error);
		}

		try {
			item.buy(message);
		} catch (err) {
			console.log(err);
			return message.channel.send("Quelque chose s'est mal passé en achetant l'objet :/").catch(console.error);
		}

		message.channel.send({
			embed: {
				author: {
					name: message.author.tag,
					icon_url: message.author.avatarURL({ dynamic: true })
				},
				color: message.guild.me.displayColor,
				description: `${message.author} a acheté "${item.name}" pour ✨${item.price}`,
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);
	}
};

module.exports = command;