const { Message } = require("discord.js");

const command = {
    name: "8ball",
    description: {
        fr: "Demander quelque chose à Mayze",
        en: "Ask Mayze something"
    },
    aliases: [],
    args: 1,
    usage: "<question>",
    slashOptions: [
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
        
        message.reply(language.answers[Math.floor(Math.random() * language.answers.length)]).catch(console.error);
    }
};

module.exports = command;