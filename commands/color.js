const { time } = require("cron");
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
		let color = hexToRGB(args[0] || "");

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
		const messageFilter = m => /^(r|g|b)(\+|-)\d+$/i.test(m.content) && m.author.id === message.author.id;
		const messageCollector = message.channel.createMessageCollector(messageFilter);

		const duration = 120;
		let countdown = duration;
		const timer = setInterval(() => {
			--countdown;
			if (countdown <= 0) reactionCollector.stop();
		}, 1000);

		reactionCollector.on("collect", async (reaction, user) => {
			countdown = duration;
			reaction.users.remove(user).catch(console.error);
			switch (reaction.emoji.name) {
				case emojis.redPlus:
					color[0] = color[0] === 255 ? 0 : ++color[0];
					break;
				case emojis.redMinus:
					color[0] = color[0] === 0 ? 255 : --color[0];
					break;
				case emojis.greenPlus:
					color[1] = color[1] === 255 ? 0 : ++color[1];
					break;
				case emojis.greeenMinus:
					color[1] = color[1] === 0 ? 255 : --color[1];
					break;
				case emojis.bluePlus:
					color[2] = color[2] === 255 ? 0 : ++color[2];
					break;
				case emojis.blueMinus:
					color[2] = color[2] === 0 ? 255 : --color[2];
					break;
				case emojis.exit:
					reactionCollector.stop();
					break;
			}
			updateMsg();
		});

		reactionCollector.on("end", () => {
			messageCollector.stop();
			msg.reactions.removeAll().catch(console.error);
			clearInterval(timer);
		});

		messageCollector.on("collect", async m => {
			countdown = duration;
			m.delete().catch(console.error);
			const regex = /^(r|g|b)((?:\+|-)\d+)$/i;
			const [ , colorUpdate, value ] = m.content.match(regex);
			switch(colorUpdate.toLowerCase()) {
				case "r":
					color[0] = color[0] + parseInt(value, 10) >= 0 ? (color[0] + parseInt(value, 10) <= 255 ? color[0] + parseInt(value, 10) : 255) : 0;
					break;
				case "g":
					color[1] = color[1] + parseInt(value, 10) >= 0 ? (color[1] + parseInt(value, 10) <= 255 ? color[1] + parseInt(value, 10) : 255) : 0;
					break;
				case "b":
					color[2] = color[2] + parseInt(value, 10) >= 0 ? (color[2] + parseInt(value, 10) <= 255 ? color[2] + parseInt(value, 10) : 255) : 0;
					break;
			}
			updateMsg();
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

		async function updateMsg() {
			msg.edit({
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
		}
	}
};

module.exports = command;