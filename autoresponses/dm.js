module.exports = {
  execute(message) {
    if (
      message.channel.type === "dm" &&
      message.author.id !== message.client.user.id
    ) {
      message.client.dmChannels.set(message.author.id, message.channel);
      var msg = message.content;
      if (message.attachments) {
        var attachments = message.attachments.array();
        var urls = attachments.map(attachment => attachment.url).join("\n");
        msg = msg + "\n" + urls;
      }
      const DMGuild = message.client.guilds.cache.get("744291144946417755");
      var channel = DMGuild.channels.cache.find(
        c => c.topic === message.author.id
      );
      if (!channel) {
        DMGuild.channels
          .create(message.author.username, "text")
          .then(channel => {
            var category = DMGuild.channels.cache.get("744292272300097549");
            channel.setParent(category.id);
            channel.setTopic(message.author.id);
            channel.send(msg);
          });
      } else {
        channel.setName(message.author.username);
        channel.send(msg);
      }
    } else {
      if (
        message.channel.parentID === "744292272300097549" &&
        message.author.bot === false
      ) {
        var msg = message.content;
        if (message.attachments) {
          var attachments = message.attachments.array();
          var urls = attachments.map(attachment => attachment.url).join("\n");
          msg = msg + "\n" + urls;
        }
        message.client.users.cache.get(message.channel.topic).send(msg);
      }
    }
  }
};
