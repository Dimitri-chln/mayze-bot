import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

const command: Command = {
	name: "plato",
	aliases: [],
	description: {
		fr: "Gérer les tournois Plato",
		en: "Manage Plato tournaments",
	},
	usage: "",
	userPermissions: ["ADMINISTRATOR"],
	botPermissions: [],
	guildIds: [Util.config.MAIN_GUILD_ID],

	options: {
		fr: [],
		en: [],
	},

	runInteraction: async (interaction, translations) => {
		interaction.followUp(".");
	},

	runMessage: async (message, args, translations) => {
		const GAMES = [
			"Pool",
			"Ocho",
			"Bowling",
			"Mini Golf",
			"Skeeball",
			"Dominos",
			"Darts",
			"Bounce",
			"Plox",
			"Bataille Navale",
			"Tir à l'arc",
			"Basketball",
			"Rangée de 4",
			"Démineur",
			"Cup Pong",
			"Dots & Boxes",
			"Go Fish",
		];

		const game = GAMES[Math.floor(Math.random() * GAMES.length)];

		message.reply({
			content: `Le jeu sera **${game}** !`,
			allowedMentions: {
				repliedUser: false,
			},
		});
	},
};

export default command;
