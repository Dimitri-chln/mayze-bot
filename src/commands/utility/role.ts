import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField, Role } from "discord.js";
import Util from "../../Util";

const command: CommandData = {
	name: "role",
	aliases: [],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField([PermissionFlagsBits.EmbedLinks]),

	options: [
		{
			type: ApplicationCommandOptionType.Role,
			name: "role",
			description: undefined,
			required: true,
		},
	],

	async run(input, args, localizations) {
		const role = args.get("role") as Role;

		const roleMembers = role.members.map((m) => m.user.tag);

		input.reply({
			embeds: [
				{
					author: {
						name: role.name,
						icon_url: `https://dummyimage.com/50/${role.hexColor.replace("#", "")}/${role.hexColor.replace(
							"#",
							"",
						)}.png?text=%20`,
					},
					color: input.guild.members.me.displayColor,
					description: localizations.description.format(
						input.locale,
						role.id,
						role.hexColor,
						role.color.toString(),
						role.position.toString(),
						roleMembers.length.toString(),
						roleMembers.join(", "),
					),
					footer: {
						text: Util.config.DEFAULT_EMBED_FOOTER_TEXT,
					},
				},
			],
		});
	},
};

export default command;
