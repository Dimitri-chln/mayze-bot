import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, ComponentType, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import Util from "../../Util";

const command: CommandData = {
	name: "test",
	aliases: [],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField(),

	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: "input",
			description: undefined,
			required: false,
		},
	],

	async run(input, args, localizations) {
		await input.reply({
			embeds: [
				{
					author: {
						name: "Station SSP",
						icon_url: input.client.user.displayAvatarURL(),
					},
					color: 0xff0055,
					title: "Bienvenue sur le salon du bot SSP !",
					description: "Ici, tu peux savoir si la station est occupée par quelqu'un",
					fields: [
						{
							name: "Comment utiliser SSPote ?",
							value: "> Dès que tu te connectes sur la station (directement ou via Parsec), tu verras un bouton",
							inline: true,
						},
					],
				},
			],
		});
	},
};

export default command;
