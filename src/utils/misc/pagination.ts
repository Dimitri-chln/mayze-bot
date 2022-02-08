import {
	CommandInteraction,
	InteractionReplyOptions,
	CollectorFilter,
	Message,
	ButtonInteraction,
} from "discord.js";

export default async function pagination(
	interaction: CommandInteraction,
	pages: Page[],
	timeout: number = 120_000,
) {
	const emojis = ["⏪", "⏩"];
	let page = 0;

	pages.forEach((p, i) => {
		if (p.embeds.length)
			p.embeds[0].footer = {
				text: `${i + 1} / ${pages.length}`,
			};

		p.components = [
			{
				type: "ACTION_ROW",
				components: [
					{
						type: "BUTTON",
						customId: "back",
						emoji: emojis[0],
						style: "SECONDARY",
					},
					{
						type: "BUTTON",
						customId: "next",
						emoji: emojis[1],
						style: "SECONDARY",
					},
				],
			},
		];
	});

	const currentPage = (await interaction.followUp({
		...pages[page],
		fetchReply: true,
	})) as Message;

	const filter: CollectorFilter<[ButtonInteraction]> = (buttonInteraction) =>
		buttonInteraction.user.id === interaction.user.id;
	const componentCollector = currentPage.createMessageComponentCollector({
		componentType: "BUTTON",
		filter,
		idle: timeout,
	});

	componentCollector.on("collect", (buttonInteraction) => {
		switch (buttonInteraction.customId) {
			case "back":
				page = page > 0 ? --page : pages.length - 1;
				break;
			case "next":
				page = page + 1 < pages.length ? ++page : 0;
				break;
		}

		buttonInteraction.update(pages[page]).catch(console.error);
	});

	componentCollector.on("end", () => {
		currentPage.edit({
			...pages[page],
			components: [
				{
					type: "ACTION_ROW",
					components: [
						{
							type: "BUTTON",
							customId: "back",
							emoji: emojis[0],
							style: "SECONDARY",
							disabled: true,
						},
						{
							type: "BUTTON",
							customId: "next",
							emoji: emojis[1],
							style: "SECONDARY",
							disabled: true,
						},
					],
				},
			],
		});
	});

	return currentPage;
}

export type Page = InteractionReplyOptions;
