module.exports = {
  execute(reaction, user) {
    return;
    
    if (reaction._emoji.id) return;
    const DMGuild = reaction.message.client.guilds.cache.get("744291144946417755");
    
    if (reaction.message.channel.type === "dm") {
      const channel = DMGuild.channels.cache.find(c => c.topic === reaction.message.author.id);
      if (!channel) return;
      channel.messages.fetch({ limit: 100 }).then(messages => {
        const messageToReact = messages.filter(m => m.content === reaction.message.content);
        if (!messageToReact) return;
        messageToReact.sort(function(a, b) {
          if (Math.abs(reaction.message.createdTimestamp - a.createdTimestamp) < 
              Math.abs(reaction.message.createdTimestamp - b.createdTimestamp)) {
            return -1;
          };
          if (Math.abs(reaction.message.createdTimestamp - a.createdTimestamp) < 
              Math.abs(reaction.message.createdTimestamp - b.createdTimestamp)) {
            return 1;
          };
          return 0;
        });
        messageToReact.first().react(reaction.emoji.name);
      });
    };
    
    if (reaction.message.channel.parentID === "744292272300097549") {
      const channel = reaction.message.client.channels.cache.get(reaction.message.channel.topic) ||
        reaction.message.client.channels.fetch(reaction.message.channel.topic);
      if (!channel) return;
      channel.messages.fetch({ limit: 100 }).then(messages => {
        const messageToReact = messages.filter(m => m.content === reaction.message.content);
        if (!messageToReact) return;
        messageToReact.sort(function(a, b) {
          if (Math.abs(reaction.message.createdTimestamp - a.createdTimestamp) < 
              Math.abs(reaction.message.createdTimestamp - b.createdTimestamp)) {
            return -1;
            };
          if (Math.abs(reaction.message.createdTimestamp - a.createdTimestamp) < 
              Math.abs(reaction.message.createdTimestamp - b.createdTimestamp)) {
            return 1;
          };
          return 0;
        });
        messageToReact.first().react(reaction.emoji.name);
      });
    };
  }
};
