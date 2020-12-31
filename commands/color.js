const { Message } = require("discord.js");

const command = {
	name: "color",
	description: "Teste des codes couleurs RGB",
	aliases: [],
	args: 0,
	usage: "<couleur>",
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async execute(message, args) {
		const color = hexToDec(args[0] || "");
		const msg = await message.channel.send({
			embed: {
				author: {
					name: message.author.tag,
					icon_url: message.author.avatarURL({ dynamic: true })
				},
				color: "#010101",
				description: `🟥 \`${ color[0] }\` - 🟩 \`${ color[1] }\` - 🟦 \`${ color[2] }\``,
				thumbnail: {
					url: `https://dummyimage.com/100/${ decToHex(color).replace("#", "") }/00.png?text=+`
				},
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);

		/**
		 * @param {string} hexColor An hexadecimal color
		 */
		function hexToDec(hexColor) {
			const hexColorRegex = /#(\d|[a-f]){6}/i;
			if (!hexColorRegex.test(hexColor)) return [0, 0, 0];
			const red = parseInt(hexColor.slice(1, 3), 16);
			const green = parseInt(hexColor.slice(3, 5), 16);
			const blue = parseInt(hexColor.slice(5), 16);
			return [red, green, blue];
		}

		/**
		 * @param {number[]} color An array of red, green and blue color values
		 */
		function decToHex(color) {
			if (color.length !== 3) return "#000000";
			return `#${ color[0].toString(16) }${ color[1].toString(16) }${ color[2].toString(16) }`;
		}
	}
};

module.exports = command;