import { MessageReaction, User } from "discord.js";
import Translations, { LanguageTranslationsData } from "./Translations";

export default interface ReactionCommand {
	readonly name: string;
	translations?: Translations;
	run(reaction: MessageReaction, user: User, added: boolean, translations: LanguageTranslationsData): Promise<void>;
}
