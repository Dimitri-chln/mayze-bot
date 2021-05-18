const { Message } = require("discord.js");

const command = {
	name: "view-nav",
	description: {
		fr: "Naviguer dans le canevas, pixel par pixel",
		en: "Navigate in the canvas pixel by pixel"
	},
	aliases: ["viewnav"],
	args: 2,
	usage: "<x> <y>",
	slashOptions: [
		{
			name: "x",
			description: "The x coordinate of the pixel",
			type: 4,
			required: true
		},
		{
			name: "y",
			description: "The y coordinate of the pixel",
			type: 4,
			required: true
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const { rows } = (await message.client.pg.query(`SELECT * FROM boards WHERE user_id = '${message.author.id}'`).catch(console.error)) || {};
		if (!rows) return message.channel.send(language.errors.database).catch(console.error);
		if (!rows.length) return message.reply(language.not_in_board).catch(console.error);
		const { board } = rows[0];

		let x = args
			? parseInt(args[0])
			: options[0].value;
		let y = args
			? parseInt(args[1])
			: options[1].value;
		if (isNaN(x) || isNaN(y) || x < 0 || y < 0 || x >= message.client.boards.get(board).size || y >= message.client.boards.get(board).size)
			return message.reply(language.invalid_coordinates).catch(console.error);

		let grid = await message.client.boards.get(board).viewNav(x, y);
		const blank = message.client.guilds.cache.get("744291144946417755").emojis.cache.find(e => e.name === "blank");

		let content = `**${message.client.boards.get(board).name.replace(/^./, a => a.toUpperCase())} - (${x}, ${y})**\n`;
		for (let i = 0; i < 9; i ++) {
			content += grid[i].map(c => c ? c.emote : blank).join("");
			if (i === 3) content += " ⬆️";
			if (i === 4) content += ` **${y}** (y)`;
			if (i === 5) content += " ⬇️";
			content += "\n";
		}
		content += `${blank}${blank} ⬅️ **${x}** (x) ➡️`;

		const msg = await message.channel.send({
			content,
			embed: {
				author: {
					name: message.author.tag,
					icon_url: message.author.avatarURL({ dynamic: true })
				},
				color: message.guild.me.displayColor,
				description: language.get(language.nav, message.client.boards.get(board).name),
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);

		await msg.react("⬅️").catch(console.error);
		await msg.react("⬆️").catch(console.error);
		await msg.react("⬇️").catch(console.error);
		await msg.react("➡️").catch(console.error);

		const filter = (reaction, user) => user.id === message.author.id && ["⬅️", "⬆️", "⬇️", "➡️"].includes(reaction.emoji.name);
		const collector = msg.createReactionCollector(filter);
		const timeout = 120000;
		let timer = setTimeout(() => collector.stop(), timeout);

		collector.on("collect", async (reaction, user) => {
			reaction.users.remove(user);
			clearTimeout(timer);
			timer = setTimeout(() => collector.stop(), timeout);
			
			switch (reaction.emoji.name) {
				case "⬅️":
					if (x > 0) x--;
					break;
				case "⬆️":
					if (y > 0) y--;
					break;
				case "⬇️":
					if (y < message.client.boards.get(board).size - 1) y++;
					break;
				case "➡️":
					if (x < message.client.boards.get(board).size - 1) x++;
					break;
			}

			grid = await message.client.boards.get(board).viewNav(x, y);

			content = `**${message.client.boards.get(board).name.replace(/^./, a => a.toUpperCase())} - (${x}, ${y})**\n`;
			for (let i = 0; i < 9; i ++) {
				content += grid[i].map(c => c ? c.emote : blank).join("");
				if (i === 3) content += " ⬆️";
				if (i === 4) content += ` **${y}** (y)`;
				if (i === 5) content += " ⬇️";
				content += "\n";
			}
			content += `${blank}${blank} ⬅️ **${x}** (x) ➡️`;

			await msg.edit({
				content,
				embed: {
					author: {
						name: message.author.tag,
						icon_url: message.author.avatarURL({ dynamic: true })
					},
					color: message.guild.me.displayColor,
					description: language.get(language.nav, message.client.boards.get(board).name),
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			}).catch(console.error);
		});

		collector.on("end", () => msg.reactions.removeAll().catch(console.error));
	}
};

module.exports = command;