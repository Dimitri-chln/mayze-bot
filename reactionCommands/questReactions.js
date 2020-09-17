module.exports = {
  execute(reaction, user) {
    reaction.message.channel.messages
      .fetch(reaction.message.id)
      .then(reactionMessage => {
        if (reactionMessage.channel.id !== "689385764219387905") return;
        if (reactionMessage.author.id !== reactionMessage.client.user.id)
          return;
        const questEmbed = reactionMessage.embeds[0];
        if (!questEmbed) return;
        if (questEmbed.title !== "Nouvelles quêtes disponibles!") return;

        const flags = questEmbed.footer.text.split(" - ");
        var membersOnly = false;
        if (flags.includes("Membres uniquement")) membersOnly = true;
        var singleVote = false;
        if (flags.includes("Un seul vote")) singleVote = true;

        if (membersOnly) {
          if (
            !reactionMessage.guild.members.cache
              .get(user.id)
              .roles.cache.some(r => r.id === "689169027922526235")
          )
            try {
              reaction.users.remove(user.id);
            } catch (error) {
              console.error("Failed to remove reaction.");
            }
        }

        if (singleVote) {
          const userReactions = reactionMessage.reactions.cache.filter(
            r =>
              r.users.cache.some(u => u.id === user.id) &&
              r._emoji !== reaction._emoji
          );
          try {
            for (const reaction of userReactions.values()) {
              reaction.users.remove(user.id);
            }
          } catch (error) {
            console.error("Failed to remove reactions.");
          }
        }
      })
      .catch(error => console.log(error));
  }
};
