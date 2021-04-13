const command = {
	/**
	 * @param {Discord.Message} message 
	 */
	async execute(message) {
		if (message.author.id !== "432610292342587392") return;
		const Discord = require("discord.js");
		const pagination = require("../utils/pagination");
		const pinRegex = /<:(logo)?pin\d{0,3}:\d{18}>/g;
		if (!pinRegex.test(message.content)) return;

		message.react("🔎").catch(console.error);
		
		var reactUser;
		const filter = (reaction, user) => {
			reactUser = user;
			return reaction.emoji.name === "🔎" && !user.bot;
		};
		
		const collected =  await message.awaitReactions(filter, { max: 1, time: 60000 }).catch(console.error);
		if (!collected.size) return message.reactions.removeAll().catch(console.error);
		
		var msg = message.content;
		if (message.editedTimestamp) {
			try { 
				const newMsg = await message.fetch();
				msg = newMsg.content;
			} catch (err) { console.error(err); }
		};

		var pins = msg.match(/<:(logo)?pin\d{0,3}:\d{18}>/g);
		var pages = [];
		var embed;
		for (i = 0; i < pins.length; i++) {
			embed = new Discord.MessageEmbed()
				.setColor(message.guild.me.displayHexColor)
				.setAuthor(`Mudapins: ${pins[i].match(/(?:logo)?pin\d+/)[0]}`, reactUser.avatarURL({ dynamic: true }))
				.setThumbnail(`https://cdn.discordapp.com/emojis/${pins[i].match(/\d{18}/)}.png`);
			pages.push(embed);
		};
		
		pagination(message, pages, ["⏪", "⏩"], 180000).catch(err => {
			console.error(err);
			message.channel.send(language.errors.paginator).catch(console.error);
		});
	}
};

module.exports = command;