const command = {
	async execute(message) {
		if (message.author.id !== "432610292342587392") return;
		const Discord = require("discord.js");
		const paginationEmbed = require("discord.js-pagination");
		const pinRegex = /<:(logo)?pin\d{0,3}:\d{18}>/g;
		if (!pinRegex.test(message.content)) return;
		if (message.content.replace(pinRegex, "").replace(/\n/g, "") === "") return;
		try { message.react("🔎"); }
		catch (err) { console.log(err); }
		
		var userID;
		const filter = (reaction, user) => {
			userID = user.id;
			return reaction.emoji.name === "🔎" && !user.bot;
		};
		
		try { await message.awaitReactions(filter, {max: 1, time: 60000, errors: ["time"]}) }
		catch (err) { return console.log(err); }
		var msg = message.content;
		if (message.editedTimestamp) {
			try { 
				const newMsg = await message.fetch();
				msg = newMsg.content;
			} catch (err) { console.log(err); }
		};

		var pins = msg.match(/<:(logo)?pin\d{0,3}:\d{18}>/g);
		var pages = [];
		var embed;
		for (i = 0; i < pins.length; i++) {
			embed = new Discord.MessageEmbed()
				.setColor("#010101")
				.setAuthor(`Mudapins: ${pins[i].match(/(?:logo)?pin\d+/)[0]}`, `https://cdn.discordapp.com/avatars/${userID}/${(message.client.users.cache.get(userID) || {}).avatar}.png`)
				.setThumbnail(`https://cdn.discordapp.com/emojis/${pins[i].match(/\d{18}/)}.png`);
			pages.push(embed);
		};
		
		try { paginationEmbed(message, pages, ["⏪", "⏩"], 180000); }
		catch (err) {
			console.log(err);
			try { message.channel.send("Quelque chose s'est mal passé en créant le paginateur :/"); }
			catch (err) { console.log(err); }
		}
	}
};

module.exports = command;