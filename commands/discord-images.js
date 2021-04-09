const { Message } = require("discord.js");

const command = {
	name: "discord-images",
	description: "Obtenir toutes les images enregistrées dans le dossier discord-images/",
	aliases: [],
	args: 0,
	usage: "",
	ownerOnly: true,
    /**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
        const Fs = require("fs");

        if (message.channel.id !== "744291145504522252") return;

        Fs.readdir("../discord-images", async (err, files) => {
            if (err) return message.reply("An error occured").catch(console.error);

            for (const file of files.filter(f => !f.endsWith(".txt"))) {
                Fs.readFile(`../discord-images/${file}`, async (err, buffer) => {
                    if (err) return message.reply(`Failed loading ${file}`).catch(console.error);
                    message.channel.send({ files: [ buffer ] }).catch(console.error);
                });
            }
        });
    }
};

module.exports = command;