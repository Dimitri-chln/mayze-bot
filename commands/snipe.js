const { Channel } = require("discord.js");
const { sendDataToProcessId } = require("pm2");

const command = {
    name: "snipe",
    description: "Montre sur le salon le message que quelqu'un vient de supprimer",
    aliases: [],
    args: 0,
    usage: "",
    async execute(message, args) {
        if (!message.client.deletedMessages || !message.client.deletedMessages[message.channel.id]) {
            try { message.reply("il n'y a aucun message à snipe dans ce salon") }
            catch (err) { console.log(err); }
            return;
        }
        const snipedMsg = message.client.deletedMessages[message.channel.id];
        try {
            message.channel.send({
                embed: {
                    author: {
                        name: snipedMsg.author.tag,
                        icon_url: `https://cdn.discordapp.com/avatars/${snipedMsg.author.id}/${snipedMsg.author.avatar}.png`
                    },
                    color: "#010101",
                    description: snipedMsg.content,
                    footer: {
                        text: "✨ Mayze ✨"
                    }
                }
            });
        } catch (err) { console.log(err); }
    }
};

module.exports = command;