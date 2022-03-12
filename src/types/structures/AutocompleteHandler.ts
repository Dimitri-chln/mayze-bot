import { ApplicationCommandOptionChoice, AutocompleteInteraction } from "discord.js";

export default interface AutocompleteHandler {
	name: string;
	options: AutocompleteHandlerOption[];
}

interface AutocompleteHandlerStringOption {
	subCommandGroup: string;
	subCommand: string;
	name: string;
	type: "STRING";
	filterType: "STARTS_WITH" | "CONTAINS";
	run: (interaction: AutocompleteInteraction, value: string) => Promise<ApplicationCommandOptionChoice[]>;
}

interface AutocompleteHandlerNumberOption {
	subCommandGroup: string;
	subCommand: string;
	name: string;
	type: "NUMBER";
	filterType: "STARTS_WITH" | "CONTAINS";
	run: (interaction: AutocompleteInteraction, value: number) => Promise<ApplicationCommandOptionChoice[]>;
}

type AutocompleteHandlerOption = AutocompleteHandlerStringOption | AutocompleteHandlerNumberOption;
