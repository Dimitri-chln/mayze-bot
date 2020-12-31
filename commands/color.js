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
		const color = hexToRGB(args[0] || "");
		const msg = await message.channel.send({
			embed: {
				author: {
					name: "Sélecteur de couleur",
					icon_url: message.client.user.avatarURL()
				},
				color: "#010101",
				description: `**Hexadécimal :** \`${ RGBToHex(color) }\`\n**RGB :** 🟥 \`${ color[0] }\` 🟩 \`${ color[1] }\` 🟦 \`${ color[2] }\`\n**Décimal :** \`${ RGBToDec(color) }\``,
				thumbnail: {
					url: `https://dummyimage.com/100/${ RGBToHex(color).replace("#", "") }/00.png?text=+`
				},
				footer: {
					text: "✨ Mayze ✨"
				}
			}
		}).catch(console.error);
		const emojis = {
			redPlus: "🟥",
			redMinus: "🔴",
			greenPlus: "🟩",
			greeenMinus: "🟢",
			bluePlus: "🟦",
			blueMinus: "🔵",
			exit: "❌"
		};
		Object.values(emojis).forEach(async e => await msg.react(e).catch(console.error));

		const reactionFilter = (reaction, user) => Object.values(emojis).includes(reaction.emoji.name) && !user.bot;
		const reactionCollector = msg.createReactionCollector(reactionFilter);
		const messageFilter = m => /(r|g|b)[0-2]?\d?\d/i.test(m.content) && !message.author.bot;
		const messageCollector = message.channel.createMessageCollector(messageFilter);

		reactionCollector.on("collect", async (reaction, user) => {

		});

		messageCollector.on("collect", async message => {

		});

		/**
		 * @param {string} hexColor An hexadecimal color
		 */
		function hexToRGB(hexColor) {
			const hexColorRegex = /#(\d|[a-f]){6}/i;
			if (!hexColorRegex.test(hexColor)) return [0, 0, 0];
			const red = parseInt(hexColor.slice(1, 3), 16);
			const green = parseInt(hexColor.slice(3, 5), 16);
			const blue = parseInt(hexColor.slice(5), 16);
			return [red, green, blue];
		}

		/**
		 * @param {number[]} RGBColor An array of red, green and blue color values
		 */
		function RGBToHex(RGBColor) {
			if (RGBColor.length !== 3) return "#000000";
			return `#${ RGBColor[0].toString(16).replace(/^(.)$/, "0$1") }${ RGBColor[1].toString(16).replace(/^(.)$/, "0$1") }${ RGBColor[2].toString(16).replace(/^(.)$/, "0$1") }`;
		}

		/**
		 * @param {number[]} RGBColor 
		 */
		function RGBToDec(RGBColor) {
			if (RGBColor.length !== 3) return 0;
			return 256 * 256 * RGBColor[0] + 256 * RGBColor[1] + RGBColor[2];
		}
	}
};

module.exports = command;