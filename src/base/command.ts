import { CommandData } from "../structures/commands/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import Util from "../Util";

const command: CommandData = {
	name: "",
	aliases: [],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField(),

	options: [],

	async run(input, args, localizations) {},
};

export default command;
