import AutocompleteHandler from "../types/structures/AutocompleteHandler";
import Util from "../Util";

import { CanvasOwnerType } from "../types/structures/Database";

const autocompleteHandler: AutocompleteHandler = {
	name: "canvas",
	options: [
		{
			subCommandGroup: null,
			subCommand: "join",
			name: "canvas",
			type: "STRING",
			filterType: "CONTAINS",
			run: async (interaction, value) => {
				const userCanvas = Util.canvas.filter(
					(canvas) =>
						canvas.owner.type === CanvasOwnerType.EVERYONE ||
						(canvas.owner.type === CanvasOwnerType.GUILD &&
							canvas.owner.id === interaction.guild.id) ||
						(canvas.owner.type === CanvasOwnerType.CHANNEL &&
							canvas.owner.id === interaction.channel.id) ||
						(canvas.owner.type === CanvasOwnerType.USER &&
							canvas.owner.id === interaction.user.id),
				);

				return userCanvas.map((canvas) => {
					return {
						name: canvas.name,
						value: canvas.name,
					};
				});
			},
		},
		{
			subCommandGroup: null,
			subCommand: "place",
			name: "color",
			type: "STRING",
			filterType: "CONTAINS",
			run: async (value) => {
				return Util.palettes
					.map((palette) =>
						palette.all().map((color) => {
							return {
								name: color.name,
								value: color.alias,
							};
						}),
					)
					.flat(1);
			},
		},
	],
};

export default autocompleteHandler;
