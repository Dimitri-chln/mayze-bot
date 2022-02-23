import {
	CommandInteraction,
	InteractionReplyOptions,
	CollectorFilter,
	Message,
	ButtonInteraction,
	User,
} from "discord.js";

interface PaginationOptions {
	timeout?: number;
	user?: User;
}

export default function pagination(
	interaction: CommandInteraction,
	pages: Page[],
	options?: PaginationOptions,
): Promise<Message>;

export default function pagination(
	message: Message,
	pages: Page[],
	options?: PaginationOptions,
): Promise<Message>;

export default async function pagination(
	interactionOrMessage: CommandInteraction | Message,
	pages: Page[],
	options: PaginationOptions = { timeout: 120_000 },
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

	const currentPage =
		interactionOrMessage instanceof CommandInteraction
			? ((await interactionOrMessage.followUp({
					...pages[page],
					fetchReply: true,
			  })) as Message)
			: await interactionOrMessage.reply(pages[page]);

	const user =
		interactionOrMessage instanceof CommandInteraction
			? interactionOrMessage.user
			: options.user ?? interactionOrMessage.author;

	const filter: CollectorFilter<[ButtonInteraction]> = (buttonInteraction) =>
		buttonInteraction.user.id === user.id;

	const collector = currentPage.createMessageComponentCollector({
		componentType: "BUTTON",
		filter,
		idle: options.timeout,
	});

	collector.on("collect", (buttonInteraction) => {
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

	collector.once("end", (collected, reason) => {
		if (reason !== "messageDelete")
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
