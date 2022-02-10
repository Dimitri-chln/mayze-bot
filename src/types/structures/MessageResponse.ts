import { Message, Snowflake } from "discord.js";
import Translations, { LanguageTranslationsData } from "./Translations";

export default interface MessageResponse {
	readonly name: string;
	readonly noBot?: boolean;
	readonly noDM?: boolean;
	readonly guildIds?: Snowflake[];
	translations?: Translations;
	run(message: Message, translations: LanguageTranslationsData): Promise<any>;
}
