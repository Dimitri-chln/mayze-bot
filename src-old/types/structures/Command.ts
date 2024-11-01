import {
	ApplicationCommandOption,
	Collection,
	CommandInteraction,
	Message,
	PermissionsString,
	Snowflake,
} from "discord.js";
import { LanguageTranslationsData } from "./Translations";

interface CommandDescription {
	fr: string;
	en: string;
}

interface CommandOptions {
	fr: ApplicationCommandOption[];
	en: ApplicationCommandOption[];
}

export default interface Command {
	readonly name: string;
	readonly aliases?: string[];
	readonly description: CommandDescription;
	readonly userPermissions: PermissionsString[];
	readonly botPermissions: PermissionsString[];
	readonly options: CommandOptions;
	readonly voice?: boolean;
	readonly voicePlaying?: boolean;
	readonly usage?: string;
	readonly cooldown?: number;
	readonly guildIds?: Snowflake[];
	readonly ephemeralReply?: boolean;
	path?: string;
	category?: string;
	cooldowns?: Collection<Snowflake, number>;
	runInteraction(interaction: CommandInteraction, translations: LanguageTranslationsData): Promise<any>;
	runMessage?(message: Message, args: string[], translations: LanguageTranslationsData): Promise<any>;
}
