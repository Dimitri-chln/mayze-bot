import Util from "../../Util";

import { ButtonInteraction, ButtonStyle, CollectorFilter, ComponentType } from "discord.js";

import { CommandInput } from "../../structures/commands/CommandInput";

export default async function confirmation(
	input: CommandInput,
	message: string,
	confirmMessage: string,
	cancelMessage: string,
): Promise<boolean> {
	const reply = await input.reply({
		content: message,
		components: [
			{
				type: ComponentType.ActionRow,
				components: [
					{
						type: ComponentType.Button,
						customId: "confirm",
						emoji: Util.config.EMOJIS.check.data,
						style: ButtonStyle.Success,
					},
					{
						type: ComponentType.Button,
						customId: "cancel",
						emoji: Util.config.EMOJIS.cross.data,
						style: ButtonStyle.Danger,
					},
				],
			},
		],
	});

	const filter: CollectorFilter<[ButtonInteraction]> = (buttonInteraction) =>
		buttonInteraction.user.id === input.user.id;

	try {
		const buttonInteraction = await reply.awaitMessageComponent({
			filter,
			componentType: ComponentType.Button,
			time: 120_000,
		});

		switch (buttonInteraction.customId) {
			case "confirm":
				message = confirmMessage;
				break;

			case "cancel":
				message = cancelMessage;
				break;

			default:
				throw new Error("InvalidButtonInteraction");
		}

		await buttonInteraction.update({
			content: message,
			components: [
				{
					type: ComponentType.ActionRow,
					components: [
						{
							type: ComponentType.Button,
							customId: "confirm",
							emoji: Util.config.EMOJIS.check.data,
							style: ButtonStyle.Success,
							disabled: true,
						},
						{
							type: ComponentType.Button,
							customId: "cancel",
							emoji: Util.config.EMOJIS.cross.data,
							style: ButtonStyle.Danger,
							disabled: true,
						},
					],
				},
			],
		});

		return buttonInteraction.customId === "confirm";
	} catch (err) {
		await input.editReply({
			content: cancelMessage,
			components: [
				{
					type: ComponentType.ActionRow,
					components: [
						{
							type: ComponentType.Button,
							customId: "confirm",
							emoji: Util.config.EMOJIS.check.data,
							style: ButtonStyle.Success,
							disabled: true,
						},
						{
							type: ComponentType.Button,
							customId: "cancel",
							emoji: Util.config.EMOJIS.cross.data,
							style: ButtonStyle.Danger,
							disabled: true,
						},
					],
				},
			],
		});

		return false;
	}
}
