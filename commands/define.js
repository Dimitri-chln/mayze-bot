const { Message } = require("discord.js");

const command = {
	name: "define",
	description: {
		fr: "Obtenir la définition d'un mot",
		en: "Get the definition of a word"
	},
	aliases: ["def", "google"],
	args: 1,
	usage: "<word> [-language <code>]",
	slashOptions: [
		{
			name: "word",
			description: "The word to search",
			type: 3,
			required: true
		},
		{
			name: "language",
			description: "The language to search the word in",
			type: 3,
			required: false
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, language, languageCode) => {
		const Axios = require("axios").default;
		const apiURL = "https://api.dictionaryapi.dev/api/v2/entries";

		const word = args
			? args[0].toLowerCase()
			: options[0].value.toLowerCase();
		const searchLanguage = args
			? args.includes("-language") ? args[args.indexOf("-language") + 1] || languageCode : languageCode
			: options[1] ? options[1].value : languageCode;
		
		message.channel.startTyping(1);
		Axios.get(`${apiURL}/${searchLanguage}/${encodeURIComponent(word)}`)
			.then(async res => {
				if (res.data.title && res.data.title === "No Definitions Found") return message.reply(language.invalid_word).catch(console.error);
				if (res.data.title && res.data.title === "API Rate Limit Exceeded") return message.reply(language.get(language.errors.api_limit, "Disctionary")).catch(console.error);
				message.channel.send(`__**${res.data[0].word.replace(/^./, a => a.toUpperCase())}**__: ${res.data[0].phonetics[0].text ? `(${res.data[0].phonetics[0].text})` : ""}\n${res.data[0].meanings.map(meaning => `> __${meaning.partOfSpeech.replace(/^./, a => a.toUpperCase())}:__ ${meaning.definitions[0].definition}${meaning.definitions[0].synonyms && meaning.definitions[0].synonyms.length ? `\n*${language.synonyms}: ${meaning.definitions[0].synonyms.join(", ")}*` : ""}`).join("\n\n")}`).catch(console.error);
			})
			.catch(async err => {
				console.error(err);
				message.channel.send(language.get(language.errors.api, "Dictionary")).catch(console.error);
				message.channel.stopTyping();
			});
		message.channel.stopTyping();
	}
};

module.exports = command;