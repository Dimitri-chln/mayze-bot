import {
	BaseMessageComponentOptions,
	ButtonInteraction,
	CollectorFilter,
	MessageActionRow,
	MessageActionRowOptions,
	SelectMenuInteraction,
	TextChannel,
	User,
} from "discord.js";
import Translations from "../../types/structures/Translations";
import Game from "../../types/werewolf/Game";
import Player from "../../types/werewolf/Player";
import Util from "../../Util";

export default function selectPlayer(
	game: Game,
	recipient: TextChannel | User,
	allowed: Player[],
	players: Player[],
	embedTitle: string,
	number: number = 1,
	timeout: number = 60_000,
): Promise<Player[]> {
	return new Promise(async (resolve, reject) => {
		if (number > 4) throw new Error("Number must be less or equal to 4");

		const translations = (await new Translations("ww_select-player").init()).data[game.language];

		let selectedPlayers: Player[];

		const message = await recipient.send({
			embeds: [
				{
					title: embedTitle,
					color: game.guild.me.displayColor,
					description: players.map((player, i) => `\`${i + 1}.\` ${player.member.user.tag}`).join("\n"),
					footer: {
						text: translations.strings.footer(Math.round(timeout / 1000).toString()),
					},
				},
			],
			components: [
				...Array.from(
					Array(number),
					(_, i): MessageActionRow | (Required<BaseMessageComponentOptions> & MessageActionRowOptions) => {
						return {
							type: "ACTION_ROW",
							components: [
								{
									type: "SELECT_MENU",
									customId: `player_${i}`,
									placeholder: translations.strings.placeholder(),
									options: players.map((player) => {
										return {
											label: player.member.user.tag,
											value: player.member.user.id,
											default: player.member.user.id === selectedPlayers[i].member.user.id,
										};
									}),
								},
							],
						};
					},
				),
				{
					type: "ACTION_ROW",
					components: [
						{
							type: "BUTTON",
							customId: "confirm",
							emoji: Util.config.EMOJIS.check.data,
							style: "SECONDARY",
							disabled: true,
						},
					],
				},
			],
		});

		const filter: CollectorFilter<[ButtonInteraction]> = (buttonInteraction) =>
			allowed.some((player) => buttonInteraction.user.id === player.member.user.id);

		const collector = message.createMessageComponentCollector({
			componentType: "BUTTON",
			filter: filter,
			time: timeout,
		});

		collector.once("collect", (buttonInteraction) => {
			buttonInteraction.update({
				embeds: [
					{
						title: embedTitle,
						color: game.guild.me.displayColor,
						description: players.map((player, i) => `\`${i + 1}.\` ${player.member.user.tag}`).join("\n"),
						footer: {
							text: translations.strings.footer(Math.round(timeout / 1000).toString()),
						},
					},
				],
				components: [
					...Array.from(
						Array(number),
						(_, i): MessageActionRow | (Required<BaseMessageComponentOptions> & MessageActionRowOptions) => {
							return {
								type: "ACTION_ROW",
								components: [
									{
										type: "SELECT_MENU",
										customId: `player_${i}`,
										placeholder: translations.strings.placeholder(),
										options: players.map((player) => {
											return {
												label: player.member.user.tag,
												value: player.member.user.id,
												default: player.member.user.id === selectedPlayers[i].member.user.id,
											};
										}),
									},
								],
							};
						},
					),
					{
						type: "ACTION_ROW",
						components: [
							{
								type: "BUTTON",
								customId: "confirm",
								emoji: Util.config.EMOJIS.check.data,
								style: "SECONDARY",
								disabled: true,
							},
						],
					},
				],
			});

			collector.stop("done");
			resolve(selectedPlayers);
		});

		collector.once("end", (collected, reason) => {
			selectMenuCollector.stop();
			if (reason !== "done") resolve([]);
		});

		const selectMenuFilter: CollectorFilter<[SelectMenuInteraction]> = (selectMenuInteraction) =>
			allowed.some((player) => selectMenuInteraction.user.id === player.member.user.id);

		const selectMenuCollector = message.createMessageComponentCollector({
			componentType: "SELECT_MENU",
			filter: selectMenuFilter,
		});

		selectMenuCollector.on("collect", (selectMenuInteraction) => {
			const index = parseInt(selectMenuInteraction.customId.match(/d+$/)[0]);

			selectedPlayers[index] = players.find((player) => player.member.user.id === selectMenuInteraction.values[0]);

			selectMenuInteraction.update({
				embeds: [
					{
						title: embedTitle,
						color: game.guild.me.displayColor,
						description: players.map((player, i) => `\`${i + 1}.\` ${player.member.user.tag}`).join("\n"),
						footer: {
							text: translations.strings.footer(Math.round(timeout / 1000).toString()),
						},
					},
				],
				components: [
					...Array.from(
						Array(number),
						(_, i): MessageActionRow | (Required<BaseMessageComponentOptions> & MessageActionRowOptions) => {
							return {
								type: "ACTION_ROW",
								components: [
									{
										type: "SELECT_MENU",
										customId: `player_${i}`,
										placeholder: translations.strings.placeholder(),
										options: players.map((player) => {
											return {
												label: player.member.user.tag,
												value: player.member.user.id,
												default: player.member.user.id === selectedPlayers[i].member.user.id,
											};
										}),
									},
								],
							};
						},
					),
					{
						type: "ACTION_ROW",
						components: [
							{
								type: "BUTTON",
								customId: "confirm",
								emoji: Util.config.EMOJIS.check.data,
								style: "SECONDARY",
							},
						],
					},
				],
			});
		});
	});
}
