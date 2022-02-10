import { Collection, Message, PermissionString, Snowflake } from "discord.js";
import Util from "../../Util";
import Translations, { LanguageTranslationsData } from "./Translations";


interface CommandDescription {
	fr: string;
	en: string;
}

export default interface MessageCommand {
	readonly name: string;
	readonly aliases: string[];
	readonly description: CommandDescription;
	readonly userPermissions: PermissionString[];
	readonly botPermissions: PermissionString[];
	readonly usage: string;
	readonly cooldown?: number;
	readonly guildIds?: Snowflake[];
	path?: string;
	category?: string;
	cooldowns?: Collection<Snowflake, number>;
	translations?: Translations;
	available?: Promise<boolean>;
	run(
		message: Message,
		args: string[],
		translations: LanguageTranslationsData,
	): Promise<any>;
}
