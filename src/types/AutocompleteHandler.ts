import { ApplicationCommandOptionChoiceData, AutocompleteInteraction } from "discord.js";

export default interface AutocompleteHandler {
	name: string;
	options: AutocompleteHandlerOption[];
}

interface AutocompleteHandlerOption {
	subCommandGroup: string;
	subCommand: string;
	name: string;
	filterType: "STARTS_WITH" | "CONTAINS";
	run: (interaction: AutocompleteInteraction, value: string) => Promise<ApplicationCommandOptionChoiceData[]>;
}
