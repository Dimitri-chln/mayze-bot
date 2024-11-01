import { Message, Snowflake } from "discord.js";

export default interface MessageResponse {
	readonly name: string;
	readonly noBot?: boolean;
	readonly noDM?: boolean;
	readonly guildIds?: Snowflake[];
	// run(message: Message, translations: LanguageTranslationsData): Promise<any>;
}
