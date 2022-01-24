import { CommandInteraction, Message } from "discord.js";
import Command from "../../types/structures/Command";
import Translations from "../../types/structures/Translations";
import Util from "../../Util";



const command: Command = {
	name: "canvas",
	description: {
		fr: "Rejoindre un canevas",
		en: "Join a canvas"
	},
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],
	
	options: {
		fr: [
			{
				name: "join",
				description: "Rejoindre un canevas",
				type: "SUB_COMMAND",
				options: [
					{
						name: "canvas",
						description: "Le nom du canevas",
						type: "STRING",
						required: true
					}
				]
			},
			{
				name: "list",
				description: "Obtenir la liste de tous les canevas",
				type: "SUB_COMMAND"
			}
		],
		en: [
			{
				name: "join",
				description: "Join a canvas",
				type: "SUB_COMMAND",
				options: [
					{
						name: "canvas",
						description: "The name of the canvas",
						type: "STRING",
						required: true
					}
				]
			},
			{
				name: "list",
				description: "Get the list of all available canvas",
				type: "SUB_COMMAND"
			}
		]
	},
	
	run: async (interaction: CommandInteraction, translations: Translations) => {
		const subCommand = interaction.options.getSubcommand();
		
		const userCanvas = Util.canvas.filter(canvas =>
			canvas.owner.type === "EVERYONE"
			|| canvas.owner.type === "GUILD" && canvas.owner.id === interaction.guild.id
			|| canvas.owner.type === "CHANNEL" && canvas.owner.id === interaction.channel.id
			|| canvas.owner.type === "USER" && canvas.owner.id === interaction.user.id
		);
		
		switch (subCommand) {
			case "list": {
				interaction.reply({
					embeds: [
						{
							author: {
								name: translations.data.title(),
								iconURL: interaction.client.user.displayAvatarURL()
							},
							color: interaction.guild.me.displayColor,
							description: userCanvas.map(canvas => `\`${canvas.name.replace(/-\d{18}/, "")}\` - **${canvas.size}x${canvas.size}**`).join("\n"),
							footer: {
								text: "✨ Mayze ✨"
							}
						}
					]
				});

				break;
			}

			case "join": {
				const canvasName = interaction.options.getString("canvas").toLowerCase();
				const newCanvas = userCanvas.find(canvas => canvas.name === canvasName); 

				if (!newCanvas) return interaction.reply(translations.data.invalid_canvas());

				newCanvas.addUser(interaction.user);

				interaction.reply({
					content: translations.data.joined(canvasName),
					ephemeral: true
				});

				break;
			}
		}
	}
};



export default command;