module.exports = {
    name: "poll",
    description: "Crée un sondage dans le salon actuel",
    aliases: ["ask"],
    args: 1,
    usage: "<question> [proposition]/[proposition]/... [-pin]",
    execute(message, args) {
        var emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
        const question = (args.join(" ").match(/["«][^"»]*["»]/) || [null])[0];
        if (!question) return message.reply("écris ta question entre guillemets");
        var answers = args.join(" ").replace(question + " ", "").split("/");
        if (answers.length < 2) {
            answers = ["Oui", "Non"];
            emojis = ["✅", "❌"];
        };
        message.delete();
        message.channel.send({
            embed: {
                author: {
                    name: message.author.tag,
                    icon_url: `https://cdn.discordapp.com/avatars/${message.client.user.id}/${message.client.user.avatar}.png`
                },
                thumbnail: {
                    url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                },
                title: `« ${question.replace(/["'«»]/g, "")} »`,
                color: "#010101",
                description: answers.map((a, i) => `${emojis[i]} ${a}`).join("\n"),
                footer: {
                    text: "✨ Mayze ✨"
                }
            }
        }).then(msg => {
           emojis.slice(0, answers.length).forEach(async e => {
                await msg.react(e);
            });
        });
    }
};