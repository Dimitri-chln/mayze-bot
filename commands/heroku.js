module.exports = {
    name: "heroku",
    description: "Donne des informations sur le \"mode Heroku\"",
    aliases: [],
    args: 0,
    usage: "",
    execute(message) {
        message.channel.send({
            embed: {
                author: {
                    name: "Heroku mode",
                    icon_url: `https://cdn.discordapp.com/avatars/${message.client.user.id}/${message.client.user.avatar}.png`
                },
                color: "#010101",
                description: "Quand le bot est en \"mode Heroku\", il est host sur un serveur et non sur mon ordinateur/téléphone.\nToutes les commandes utilisant la base de données sont donc inutilisables avec ce mode.",
                footer: {
                    text: "✨ Mayze ✨"
                }
            }
        });
    }
};