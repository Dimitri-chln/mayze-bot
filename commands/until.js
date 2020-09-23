module.exports = {
  name: "until",
  description: "Donne le temps restant avant une date",
  aliases: [],
  args: 1,
  usage: "<date>",
  execute(message, args) {
    const dateToString = require("../functions/dateToString.js");
    //const UTCOffset = 2;
    const now = Date.now();
    const date = Date.parse(args.join(" ") + " GMT+0200");
    if (isNaN(date)) return message.reply("le format de la date est incorrect (mm/dd/yyyy)");

    const timeLeft = (date - now) / 1000;
    if (timeLeft < 0) return message.reply("la date ne doit pas être dépassée");
    const timeLeftString = dateToString(timeLeft);

    const seconds = Math.floor((date / 1000) % 60);
    const minutes = Math.floor((date / (1000 * 60)) % 60);
    const hours = Math.floor((date / (1000 * 60 * 60)) % 24);
    const days = Math.floor((date / (1000 * 60 * 60 * 24)) % 365);
    const years = Math.floor(date / (1000 * 60 * 60 * 24 * 365));

    const parts = args[0].split("/");
    if (parts.length !== 3) return message.reply("le format de la date est incorrect (mm/dd/yyy)");
    const monthList = [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre"
    ];
    const dateString = parts[1] + " " + monthList[parts[0] - 1] + " " + parts[2] + " à "+ (args[1] || "minuit");

    message.channel.send(
      `Il reste ${timeLeftString} avant le **${dateString}**`
    );
  }
};
