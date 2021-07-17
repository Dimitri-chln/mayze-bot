const { Message } = require("discord.js");

const command = {
    name: "place-chain",
    description: {
        fr: "Placer plusieurs pixels sur le canevas",
        en: "Place multiple pixels on the canvas"
    },
    aliases: ["placechain"],
    args: 3,
    usage: "<x> <y> <color>",
	botPerms: ["EMBED_LINKS", "ADD_REACTIONS", "MANAGE_MESSAGES", "USE_EXTERNAL_EMOJIS"],
	category: "games",
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
		},
		{
			name: "color",
			description: "The color of the pixel. See *palette",
			type: 3,
			required: true
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const formatContent = require("../utils/canvas/formatContent");

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

		const colorName = args
			? args[2]
			: options[2].value;
		if (message.client.palettes.every(palette => !palette.has(colorName))) return message.reply(language.invalid_color).catch(console.error);
        const color =  message.client.palettes.find(palette => palette.has(colorName)).get(colorName);

        let grid = await message.client.boards.get(board).viewNav(x, y);
		const blank = message.client.guilds.cache.get("744291144946417755").emojis.cache.find(e => e.name === "blank");

		const msg = await message.channel.send({
			content: formatContent(message.client.boards.get(board), grid, x, y, blank),
			embed: {
				author: {
					name: message.author.tag,
					icon_url: message.author.displayAvatarURL({ dynamic: true })
				},
				color: message.guild.me.displayColor,
				description: language.get(language.placing, color.emote, color.alias),
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);

		await msg.react("⬅️").catch(console.error);
		await msg.react("⬆️").catch(console.error);
		await msg.react("⬇️").catch(console.error);
		await msg.react("➡️").catch(console.error);
        await msg.react("✅").catch(console.error);
        await msg.react("❌").catch(console.error);

		const filter = (reaction, user) => user.id === message.author.id && ["⬅️", "⬆️", "⬇️", "➡️", "✅", "❌"].includes(reaction.emoji.name);
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
                case "✅":
                    await message.client.boards.get(board).setPixel(x, y, colorName);
                    break;
                case "❌":
                    clearTimeout(timer);
                    collector.stop();
                    break;
			}

			grid = await message.client.boards.get(board).viewNav(x, y);

			await msg.edit({
				content: formatContent(message.client.boards.get(board), grid, x, y, blank),
				embed: {
					author: {
						name: message.author.tag,
						icon_url: message.author.displayAvatarURL({ dynamic: true })
					},
					color: message.guild.me.displayColor,
					description: language.get(language.placing, color.emote, color.alias),
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