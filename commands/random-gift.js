const { Message } = require("discord.js");

const command = {
	name: "random-gift",
	description: "Donne un cadeau aléatoire à quelqu'un",
	aliases: ["randomGift", "gift"],
	args: 1,
	usage: "<mention/pseudo>",
	cooldown: 60,
	slashOptions: [
		{
			name: "utilisateur",
			description: "La personne à qui donner un cadeau",
			type: 6,
			required: true
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	async execute(message, args, options) {
		const gifts = require("../assets/gifts.json");
		const user = args
			? message.mentions.users.first() || (message.guild.members.cache.find(member => member.user.username.toLowerCase() === args.join(" ").toLowerCase() || member.user.username.toLowerCase().includes(args.join(" ").toLowerCase())) || {}).user
			: message.guild.members.cache.get(options[0].value).user;
		if (!user) return message.reply("mentionne la personne à qui offrir un cadeau").catch(console.error);
		message.channel.send(`> 🎁 ${user}, tu as reçu __**${getGift(gifts)}**__ de la part de **${message.author.username}**`).catch(console.error);

		function getGift(giftList) {
			const item = giftList[Math.floor(Math.random() * giftList.length)];
			if (typeof(item) === "string") return item;
			if (typeof(item) === "object") {
				const category = Object.keys(item)[0];
				return `${category} ${getGift(item[category])}`;
			}
			return "";
		}
	}
};

module.exports = command;