module.exports = {
  name: "uptime",
  description: "Temps depuis lequel le bot est en ligne",
  aliases: [],
  args: 0,
  usage: "",
  execute(message, args) {
    const uptime = Date.now() - Date.parse(message.client.readyAt);
    const uptimeHumanized = (
      parseInt(uptime / 86400000) +
      "d " +
      new Date(uptime % 86400000)
        .toUTCString()
        .replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, "$1h $2m $3s")
    ).replace(/^0d |00h |00m /g, "");
    message.reply(`je suis en ligne depuis ${uptimeHumanized}!`);
  }
};
