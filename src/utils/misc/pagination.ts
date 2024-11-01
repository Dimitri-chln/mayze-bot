import { BaseMessageOptions, ButtonInteraction, ButtonStyle, CollectorFilter, ComponentType } from "discord.js";
import { CommandInput } from "../../structures/commands/CommandInput";
import { DataLocalizationManager } from "../../structures/localizations/LocalizationManager";
import { fillWithDefaults } from "./fillWithDefaults";

const defaultOptions: PaginationOptions = {
	timeout: 120_000,
	emojis: {
		previous: "⏪",
		next: "⏩",
		unrestricted: "✅",
		restricted: "🛑",
	},
};

export default async function pagination(
	input: CommandInput,
	pages: Page[],
	options: Partial<PaginationOptions> = {},
): Promise<void> {
	return new Promise(async (resolve, reject) => {
		const fullOptions = fillWithDefaults(options, defaultOptions);

		const localizations = new DataLocalizationManager();
		await localizations.fetch();

		let page = 0;
		let isRestricted = true;

		// Add page number and buttons
		pages.forEach((page, i) => {
			page.components = [
				{
					type: ComponentType.ActionRow,
					components: [
						{
							type: ComponentType.Button,
							customId: "previous",
							emoji: fullOptions.emojis.previous,
							style: ButtonStyle.Primary,
						},
						{
							type: ComponentType.Button,
							customId: "previous",
							label: `${page} / ${pages.length}`,
							style: ButtonStyle.Secondary,
							disabled: true,
						},
						{
							type: ComponentType.Button,
							customId: "next",
							emoji: fullOptions.emojis.next,
							style: ButtonStyle.Primary,
						},
						{
							type: ComponentType.Button,
							customId: "toggle_restrict",
							emoji: isRestricted ? fullOptions.emojis.restricted : fullOptions.emojis.unrestricted,
							style: isRestricted ? ButtonStyle.Danger : ButtonStyle.Success,
						},
					],
				},
			];
		});

		const currentPage = await input.reply(pages[page]);

		const filter: CollectorFilter<[ButtonInteraction]> = (buttonInteraction) =>
			!isRestricted || buttonInteraction.user.id === input.user.id;

		const collector = currentPage.createMessageComponentCollector({
			componentType: ComponentType.Button,
			filter: filter,
			idle: options.timeout,
		});

		collector.on("collect", (buttonInteraction) => {
			switch (buttonInteraction.customId) {
				case "previous":
					page = page > 0 ? page - 1 : pages.length - 1;
					buttonInteraction.update(pages[page]).catch(console.error);
					break;

				case "next":
					page = page < pages.length - 1 ? page + 1 : 0;
					buttonInteraction.update(pages[page]).catch(console.error);
					break;

				case "toggle_restrict":
					isRestricted = !isRestricted;

					buttonInteraction
						.reply({
							content: isRestricted
								? localizations.strings.pagination.restricted.format(input.locale)
								: localizations.strings.pagination.allowed.format(input.locale),
							ephemeral: true,
						})
						.catch(console.error);
					break;
			}
		});

		collector.once("end", async (collected, reason) => {
			if (reason === "messageDelete") return;

			await currentPage.edit({
				...pages[page],
				components: [
					{
						type: ComponentType.ActionRow,
						components: [
							{
								type: ComponentType.Button,
								customId: "previous",
								emoji: fullOptions.emojis.previous,
								style: ButtonStyle.Primary,
							},
							{
								type: ComponentType.Button,
								customId: "previous",
								label: `${page} / ${pages.length}`,
								style: ButtonStyle.Secondary,
								disabled: true,
							},
							{
								type: ComponentType.Button,
								customId: "next",
								emoji: fullOptions.emojis.next,
								style: ButtonStyle.Primary,
							},
							{
								type: ComponentType.Button,
								customId: "toggle_restrict",
								emoji: isRestricted ? fullOptions.emojis.restricted : fullOptions.emojis.unrestricted,
								style: isRestricted ? ButtonStyle.Danger : ButtonStyle.Success,
							},
						],
					},
				],
			});

			resolve();
		});
	});
}

export type Page = BaseMessageOptions;

interface PaginationOptionsEmojis {
	previous: string;
	next: string;
	unrestricted: string;
	restricted: string;
}

interface PaginationOptions {
	timeout: number;
	emojis: PaginationOptionsEmojis;
}
