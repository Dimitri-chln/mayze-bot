module.exports = {
  name: "last-quest",
  description: "Modifie le dernier message de vote pour les quêtes WWO",
  aliases: ["lastQuest", "lq"],
  cooldown: 5,
  args: 1,
  usage: "[-image (+ image)] [-everyone/-members] [-single/multiple]",
  perms: ["ADMINISTRATOR"],
  execute(message, args) {
    if (
      !message.member.roles.cache.some(r =>
        ["696751614177837056", "696751852267765872"].includes(r.id)
      )
    )
      return;

    const questChannel = message.client.channels.cache.get(
      "689385764219387905"
    );

    questChannel.messages
      .fetch({ limit: 100 })
      .then(messages => {
        const quests = messages.filter(m => m.embeds.length && m.author.id === message.client.user.id);
        if (!quests.length) return;
        const quest = quests.first();

        var imageURL = quest.embeds[0].image.url;
        if (args.includes("-image") && message.attachments.lenght)
          imageURL = (message.attachments.first() || {}).url;
        var footerFlags = quest.embeds[0].footer.text.split(" - ");
        if (args.includes("-everyone")) footerFlags[0] = "Tout le monde";
        if (args.includes("-members")) footerFlags[0] = "Membres uniquement";
        if (args.includes("-single")) footerFlags[1] = "Un seul vote";
        if (args.includes("-multiple")) footerFlags[1] = "Plusieurs votes";

        quest
          .edit({
            content: quest.content,
            embed: {
              title: "Nouvelles quêtes disponibles",
              color: "#010101",
              image: {
                url: imageURL
              },
              footer: {
                text: footerFlags.join(" - ")
              }
            }
          })
          .then(() => message.react("✅"))
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  }
};
