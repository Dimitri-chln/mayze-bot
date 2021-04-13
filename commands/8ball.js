const { Message } = require("discord.js");

const command = {
    name: "8ball",
    description: {
        fr: "Demander quelque chose à Mayze",
        en: "Ask Mayze something"
    },
    aliases: ["ask"],
    args: 1,
    usage: "<question>",
    slashoptions: [
        {
            name: "question",
            description: "The question to ask",
            type: 3,
            required: true
        }
    ],
    /**
	* @param {Message} message 
	* @param {string[]} args 
	* @param {Object[]} options
	*/
	execute: async (message, args, options, language, languageCode) => {
        const question = args
            ? args.join(" ")
            : options[0].value;
        
        message.reply(language.anwsers[Math.floor(Math.random() * language.anwsers.length)]).catch(console.error);
    }
};

module.exports = command;