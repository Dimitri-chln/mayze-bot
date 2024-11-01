import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import Util from "../../Util";

const command: CommandData = {
	name: "ping",
	aliases: ["pong"],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField(),

	options: [],

	async run(input, args, localizations) {
		input.reply(`Pong! **${input.client.ws.ping}**ms`);
	},
};

export default command;
