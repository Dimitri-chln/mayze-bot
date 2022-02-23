import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import { ButtonInteraction, CollectorFilter } from "discord.js";

const command: Command = {
	name: "color",
	aliases: [],
	description: {
		fr: "Tester et visualiser des codes couleurs hexadécimaux",
		en: "Test and visualize hexadecimal color codes",
	},
	usage: "",
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],

	options: {
		fr: [
			{
				name: "color",
				description: "Le code hexadécimal de la couleur",
				type: "STRING",
				required: true,
			},
		],
		en: [
			{
				name: "color",
				description: "The hexadecimal code of the color",
				type: "STRING",
				required: true,
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const color = hexToRGB(interaction.options.getString("color", true));

		const reply = (await interaction.followUp({
			embeds: [
				{
					author: {
						name: translations.strings.author(),
						iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
					},
					color: interaction.guild.me.displayColor,
					description: translations.strings.description(
						RGBToHex(color),
						color[0].toString(),
						color[1].toString(),
						color[2].toString(),
						RGBToDec(color).toString(),
					),
					thumbnail: {
						url: `https://dummyimage.com/100/${RGBToHex(color).replace(
							"#",
							"",
						)}/00.png?text=%20`,
					},
					footer: {
						text: "✨ Mayze ✨",
					},
				},
			],
			// U+2795 ➕
			// U+2796 ➖
			components: [
				{
					type: "ACTION_ROW",
					components: [
						{
							type: "BUTTON",
							customId: "more_red",
							emoji: "\u2795",
							style: "DANGER",
						},
						{
							type: "BUTTON",
							customId: "less_red",
							emoji: "\u2796",
							style: "DANGER",
						},
					],
				},
				{
					type: "ACTION_ROW",
					components: [
						{
							type: "BUTTON",
							customId: "more_green",
							emoji: "\u2795",
							style: "SUCCESS",
						},
						{
							type: "BUTTON",
							customId: "less_green",
							emoji: "\u2796",
							style: "SUCCESS",
						},
					],
				},
				{
					type: "ACTION_ROW",
					components: [
						{
							type: "BUTTON",
							customId: "more_blue",
							emoji: "\u2795",
							style: "PRIMARY",
						},
						{
							type: "BUTTON",
							customId: "less_blue",
							emoji: "\u2796",
							style: "PRIMARY",
						},
					],
				},
			],
		})) as Message;

		const filter: CollectorFilter<[ButtonInteraction]> = (buttonInteraction) =>
			buttonInteraction.user.id === interaction.user.id;

		const collector = reply.createMessageComponentCollector({
			filter,
			idle: 120_000,
		});

		const messageFilter: CollectorFilter<[Message]> = (msg) =>
			msg.author.id === interaction.user.id &&
			/^(r|g|b)\s*=\s*(\d+)$/i.test(msg.content);

		const messageCollector = interaction.channel.createMessageCollector({
			filter: messageFilter,
		});

		collector.on("collect", async (buttonInteraction) => {
			switch (buttonInteraction.customId) {
				case "more_red":
					color[0] = color[0] === 255 ? 0 : color[0] + 1;
					break;
				case "less_red":
					color[0] = color[0] === 0 ? 255 : color[0] - 1;
					break;
				case "more_green":
					color[1] = color[1] === 255 ? 0 : color[1] + 1;
					break;
				case "less_green":
					color[1] = color[1] === 0 ? 255 : color[1] - 1;
					break;
				case "more_blue":
					color[2] = color[2] === 255 ? 0 : color[2] + 1;
					break;
				case "less_blue":
					color[2] = color[2] === 0 ? 255 : color[2] - 1;
					break;
			}

			buttonInteraction.update({
				embeds: [
					{
						author: {
							name: translations.strings.author(),
							iconURL: interaction.client.user.displayAvatarURL(),
						},
						color: interaction.guild.me.displayColor,
						description: translations.strings.description(
							RGBToHex(color),
							color[0].toString(),
							color[1].toString(),
							color[2].toString(),
							RGBToDec(color).toString(),
						),
						thumbnail: {
							url: `https://dummyimage.com/100/${RGBToHex(color).replace(
								"#",
								"",
							)}/00.png?text=%20`,
						},
						footer: {
							text: "✨ Mayze ✨",
						},
					},
				],
				components: reply.components,
			});
		});

		collector.on("end", (collected, reason) => {
			if (reason !== "messageDelete")
				interaction.editReply({
					embeds: reply.embeds,
					components: [
						{
							type: "ACTION_ROW",
							components: [
								{
									type: "BUTTON",
									customId: "more_red",
									emoji: "\u2795",
									style: "DANGER",
									disabled: true,
								},
								{
									type: "BUTTON",
									customId: "less_red",
									emoji: "\u2796",
									style: "DANGER",
									disabled: true,
								},
							],
						},
						{
							type: "ACTION_ROW",
							components: [
								{
									type: "BUTTON",
									customId: "more_green",
									emoji: "\u2795",
									style: "SUCCESS",
									disabled: true,
								},
								{
									type: "BUTTON",
									customId: "less_green",
									emoji: "\u2796",
									style: "SUCCESS",
									disabled: true,
								},
							],
						},
						{
							type: "ACTION_ROW",
							components: [
								{
									type: "BUTTON",
									customId: "more_blue",
									emoji: "\u2795",
									style: "PRIMARY",
									disabled: true,
								},
								{
									type: "BUTTON",
									customId: "less_blue",
									emoji: "\u2796",
									style: "PRIMARY",
									disabled: true,
								},
							],
						},
					],
				});

			messageCollector.stop();
		});

		messageCollector.on("collect", async (msg) => {
			msg.delete().catch(console.error);

			const regex = /^(r|g|b)\s*=\s*(\d+)$/i;
			const [, colorUpdate, value] = msg.content.match(regex);

			switch (colorUpdate.toLowerCase()) {
				case "r":
					color[0] =
						parseInt(value) < 0
							? 0
							: parseInt(value) > 255
							? 255
							: parseInt(value);
					break;
				case "g":
					color[1] =
						parseInt(value) < 0
							? 0
							: parseInt(value) > 255
							? 255
							: parseInt(value);
					break;
				case "b":
					color[2] =
						parseInt(value) < 0
							? 0
							: parseInt(value) > 255
							? 255
							: parseInt(value);
					break;
			}

			interaction.editReply({
				embeds: [
					{
						author: {
							name: translations.strings.author(),
							iconURL: interaction.client.user.displayAvatarURL(),
						},
						color: interaction.guild.me.displayColor,
						description: translations.strings.description(
							RGBToHex(color),
							color[0].toString(),
							color[1].toString(),
							color[2].toString(),
							RGBToDec(color).toString(),
						),
						thumbnail: {
							url: `https://dummyimage.com/100/${RGBToHex(color).replace(
								"#",
								"",
							)}/00.png?text=%20`,
						},
						footer: {
							text: "✨ Mayze ✨",
						},
					},
				],
				components: reply.components,
			});
		});

		function hexToRGB(hexColor: string) {
			const hexColorRegex = /#(\d|[a-f]){6}/i;

			if (!hexColorRegex.test(hexColor)) return [0, 0, 0];

			const red = parseInt(hexColor.slice(1, 3), 16);
			const green = parseInt(hexColor.slice(3, 5), 16);
			const blue = parseInt(hexColor.slice(5), 16);

			return [red, green, blue];
		}

		function RGBToHex(RGBColor: number[]) {
			if (RGBColor.length !== 3) return "#000000";

			return (
				"#" +
				RGBColor[0].toString(16).replace(/^(.)$/, "0$1") +
				RGBColor[1].toString(16).replace(/^(.)$/, "0$1") +
				RGBColor[2].toString(16).replace(/^(.)$/, "0$1")
			);
		}

		function RGBToDec(RGBColor: number[]) {
			if (RGBColor.length !== 3) return 0;

			return 256 * 256 * RGBColor[0] + 256 * RGBColor[1] + RGBColor[2];
		}
	},
};

export default command;
