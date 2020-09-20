module.exports = {
  name: "until",
  description: "Donne le temps restant avant une date",
  aliases: [],
  args: 1,
  usage: "<date>",
  execute(message, args) {
    const stringToDate = require("../functions/stringToDate.js");
    const UTCOffset = 2;
    const now = Date.now();
    const date = stringToDate(args[0], 2);
    const timeLeft = (date - now) / 1000;
    var days = Math.floor(timeLeft / 86400);
    var hours = Math.floor((timeLeft % 86400) / 3600);
    var minutes = Math.floor((timeLeft % 3600) / 60);
    var seconds = Math.floor(timeLeft % 60 / 1);
    if (days < 10) days = "0" + days;
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    
    const parts = args[0].split("/");
    const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    const dateString = parts[0] + " " + months[parts[1] - 1] + " " + parts[2];
    
    message.channel.send(
      `Il reste **${days}** jours, **${hours}** heures, **${minutes}** minutes et **${seconds}** secondes avant le **${dateString}**`
    );
  }
};