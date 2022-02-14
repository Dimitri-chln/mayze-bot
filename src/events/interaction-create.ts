import Event from "../types/structures/Event";
import Util from "../Util";

import { Interaction } from "discord.js";
import runCommand from "../utils/misc/runCommand";

const event: Event = {
	name: "interactionCreate",
	once: false,

	run: async (interaction: Interaction) => {
		switch (interaction.type) {
			case "PING": {
				break;
			}

			case "APPLICATION_COMMAND": {
				if (interaction.isCommand()) {
					await interaction.deferReply();

					const command = Util.commands.get(interaction.commandName);
					if (command) runCommand(command, interaction).catch(console.error);
				}

				if (interaction.isContextMenu()) {
					// Run
				}
				break;
			}

			case "APPLICATION_COMMAND_AUTOCOMPLETE": {
				break;
			}

			case "MESSAGE_COMPONENT": {
				break;
			}
		}
	},
};

export default event;
