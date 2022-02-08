import { MessageReaction, User } from "discord.js";

export default interface ReactionCommand {
	run(reaction: MessageReaction, user: User, added: boolean): Promise<void>;
}
