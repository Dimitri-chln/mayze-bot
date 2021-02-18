const { Message } = require("discord.js");

const command = {
	name: "define",
	description: "Obtenir la définition d'un terme",
	aliases: ["def", "google"],
	args: 1,
	usage: "<mot>",
	slashOptions: [
		{
			name: "mot",
			description: "Le mot à chercher",
			type: 3,
			required: true
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language) => {
		const Axios = require("axios").default;
		const apiURL = "https://api.dicolink.com/v1/mot";

		const word = args
			? args.join(" ").toLowerCase()
			: options[0].value.toLowerCase();
		
		Axios.get(`${apiURL}/${word.replace(/\s/g, "+")}/definitions?limite=1&api_key=${process.env.DICOLINK_API_KEY}`)
		.then(async res => {
			if (!res.data.length) return message.reply("ce mot n'existe pas ou il est mal orthographié").catch(console.error);
			message.channel.send(`__**${word.replace(/^./, a => a.toUpperCase())}**__, ${res.data[0].nature}:\n> ${res.data[0].definition}\n*(source: ${res.data[0].source.replace(/^./, a => a.toUpperCase())})*`).catch(console.error);
		})
		.catch(async err => {
			if (err.message === "Request failed with status code 404") return message.reply("ce mot n'existe pas ou il est mal orthographié").catch(console.error);
			message.channel.send("Quelque chose s'est mal passé en accédant à l'API dicolink :/").catch(console.error);
			console.error(err);
		});
	}
};

module.exports = command;