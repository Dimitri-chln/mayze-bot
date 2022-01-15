import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import LanguageStrings from "../../types/structures/LanguageStrings";
import Util from "../../Util";

import { CollectorFilter, MessageReaction, User } from "discord.js";



const command: Command = {
	name: "color",
	description: {
		fr: "Tester et visualiser des codes couleurs hexadécimaux",
		en: "Test and visualize hexadecimal color codes"
	},
	userPermissions: [],
	botPermissions: ["EMBED_LINKS", "ADD_REACTIONS"],

	options: {
		fr: [
			{
				name: "color",
				description: "Le code hexadécimal de la couleur",
				type: "STRING",
				required: true
			}
		],
		en: [
			{
				name: "color",
				description: "The hexadecimal code of the color",
				type: "STRING",
				required: true
			}
		]
	},

	run: async (interaction: CommandInteraction, languageStrings: LanguageStrings) => {
		const color = hexToRGB(interaction.options.getString("color"));

		const reply = await interaction.reply({
			embeds: [
				{
					author: {
						name: languageStrings.data.title(),
						iconURL: interaction.client.user.displayAvatarURL()
					},
					color: interaction.guild.me.displayColor,
					description: languageStrings.data.description(
						RGBToHex(color),
						color[0].toString(),
						color[1].toString(),
						color[2].toString(),
						RGBToDec(color).toString()
					),
					thumbnail: {
						url: `https://dummyimage.com/100/${ RGBToHex(color).replace("#", "") }/00.png?text=+`
					},
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			],
			fetchReply: true
		}) as Message;

		const emojis = {
			redPlus: "🟥",
			redMinus: "🔴",
			greenPlus: "🟩",
			greeenMinus: "🟢",
			bluePlus: "🟦",
			blueMinus: "🔵",
			exit: "❌"
		};

		Object.values(emojis).forEach(async e => await reply.react(e).catch(console.error));

		const reactionFilter: CollectorFilter<[MessageReaction, User]> = (reaction, user) => user.id === interaction.user.id && Object.values(emojis).includes(reaction.emoji.name);
		const reactionCollector = reply.createReactionCollector({ filter: reactionFilter, idle: 60_000 });
		const messageFilter: CollectorFilter<[Message]> = msg => msg.author.id === interaction.user.id && /^(\+|-)\d+(r|g|b)$/i.test(msg.content);
		const messageCollector = interaction.channel.createMessageCollector({ filter: messageFilter, idle: 60_000 });

		reactionCollector.on("collect", async (reaction, user) => {
			reaction.users.remove(user).catch(console.error);
			
			switch (reaction.emoji.name) {
				case emojis.redPlus:
					color[0] = color[0] === 255 ? 0 : color[0] + 1;
					break;
				case emojis.redMinus:
					color[0] = color[0] === 0 ? 255 : color[0] - 1;
					break;
				case emojis.greenPlus:
					color[1] = color[1] === 255 ? 0 : color[1] + 1;
					break;
				case emojis.greeenMinus:
					color[1] = color[1] === 0 ? 255 : color[1] - 1;
					break;
				case emojis.bluePlus:
					color[2] = color[2] === 255 ? 0 : color[2] + 1;
					break;
				case emojis.blueMinus:
					color[2] = color[2] === 0 ? 255 : color[2] - 1;
					break;
				case emojis.exit:
					reactionCollector.stop();
					break;
			}

			updateReply();
		});

		reactionCollector.on("end", () => {
			messageCollector.stop();
			reply.reactions.removeAll().catch(console.error);
		});

		messageCollector.on("collect", async msg => {
			msg.delete().catch(console.error);
			
			const regex = /^((?:\+|-)\d+)(r|g|b)$/i;
			const [ , value, colorUpdate ] = msg.content.match(regex);
			
			switch(colorUpdate.toLowerCase()) {
				case "r":
					color[0] = color[0] + parseInt(value) >= 0
						? color[0] + parseInt(value) <= 255
							? color[0] + parseInt(value)
							: 255
						: 0;
					break;
				case "g":
					color[1] = color[1] + parseInt(value) >= 0
						? color[1] + parseInt(value) <= 255
							? color[1] + parseInt(value)
							: 255
						: 0;
					break;
				case "b":
					color[2] = color[2] + parseInt(value) >= 0
						? color[2] + parseInt(value) <= 255
							? color[2] + parseInt(value)
							: 255
						: 0;
					break;
			}

			updateReply();
		});



		function hexToRGB(hexColor: string) {
			const hexColorRegex = /#(\d|[a-f]){6}/i;
			
			if (!hexColorRegex.test(hexColor)) return [0, 0, 0];
			
			const red = parseInt(hexColor.slice(1, 3), 16);
			const green = parseInt(hexColor.slice(3, 5), 16);
			const blue = parseInt(hexColor.slice(5), 16);
			
			return [ red, green, blue ];
		}

		function RGBToHex(RGBColor: number[]) {
			if (RGBColor.length !== 3) return "#000000";
			
			return "#"
				+ RGBColor[0].toString(16).replace(/^(.)$/, "0$1")
				+ RGBColor[1].toString(16).replace(/^(.)$/, "0$1")
				+ RGBColor[2].toString(16).replace(/^(.)$/, "0$1");
		}

		function RGBToDec(RGBColor: number[]) {
			if (RGBColor.length !== 3) return 0;
			
			return 256 * 256 * RGBColor[0] + 256 * RGBColor[1] + RGBColor[2];
		}


		async function updateReply() {
			reply.edit({
				embeds: [
					{
						author: {
							name: languageStrings.data.title(),
							iconURL: interaction.client.user.displayAvatarURL()
						},
						color: interaction.guild.me.displayColor,
						description: languageStrings.data.description(
							RGBToHex(color),
							color[0].toString(),
							color[1].toString(),
							color[2].toString(),
							RGBToDec(color).toString()
						),
						thumbnail: {
							url: `https://dummyimage.com/100/${ RGBToHex(color).replace("#", "") }/00.png?text=+`
						},
						footer: {
							text: "✨ Mayze ✨"
						}
					}
				],
			}).catch(console.error);
		}
	}
};



export default command;