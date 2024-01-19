import ReactionCommand from "../types/structures/ReactionCommand";
import Util from "../Util";

const reactionCommand: ReactionCommand = {
	name: "rose-lobby",

	run: async (reaction, user, added, translations) => {
		if (reaction.message.channel.id !== "817365433509740554") return;
		if (reaction.emoji.id !== "833620353133707264") return;

		if (added) reaction.message.guild.members.cache.get(user.id).roles.add("833620668066693140").catch(console.error);
		else reaction.message.guild.members.cache.get(user.id).roles.remove("833620668066693140").catch(console.error);
	},
};

export default reactionCommand;
