import ReactionCommand from "../types/structures/ReactionCommand";
import Util from "../Util";

const reactionCommand: ReactionCommand = {
	name: "quest",

	run: async (reaction, user, added, translations) => {
		if (!added) return;
		if (reaction.message.channel.id !== "689385764219387905") return;
		if (reaction.message.author.id !== reaction.message.client.user.id) return;

		const questEmbed = reaction.message.embeds[0];
		if (!questEmbed) return;

		const singleVote = questEmbed.footer.text === "⋅";

		if (singleVote) {
			const userReactions = reaction.message.reactions.cache.filter(
				(r) => r.users.cache.has(user.id) && r.emoji !== reaction.emoji,
			);

			userReactions.forEach((r) => r.users.remove(user.id).catch(console.error));
		}
	},
};

export default reactionCommand;
