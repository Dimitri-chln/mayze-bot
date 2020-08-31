module.exports = {
  execute(reaction) {
    if (reaction._emoji.id) return;
    const DMGuild = reaction.message.client.guilds.cache.get(
      "744291144946417755"
    );

    if (reaction.message.channel.type === "dm") {
      const channel = DMGuild.channels.cache.find(
        c => c.topic === reaction.message.author.id
      );
      channel.messages.fetch({ limit: 100 }).then(messages => {
        const messageToReact = messages.find(
          m => m.content === reaction.message.content
        );
        messageToReact.react(reaction.emoji.name);
      });
    }

    if (reaction.message.channel.parentID === "744292272300097549") {
      const channel = reaction.message.client.users.cache.get(reaction.message.channel.topic);
      channel.messages.fetch({ limit: 100 }).then(messages => {
        const messageToReact = messages.find(
          m => m.content === reaction.message.content
        );
        messageToReact.react(reaction.emoji.name);
      });
    }
  }
};
