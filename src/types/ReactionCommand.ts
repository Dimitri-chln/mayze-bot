import { MessageReaction, User } from "discord.js";

export default interface ReactionCommand {
	readonly name: string;
	// run(reaction: MessageReaction, user: User, added: boolean, translations: LanguageTranslationsData): Promise<any>;
}
