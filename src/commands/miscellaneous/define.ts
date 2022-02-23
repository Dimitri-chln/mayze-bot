import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import Axios from "axios";

const command: Command = {
	name: "define",
	aliases: [],
	description: {
		fr: "Obtenir la définition d'un mot",
		en: "Get the definition of a word",
	},
	usage: "",
	userPermissions: [],
	botPermissions: [],

	options: {
		fr: [
			{
				name: "word",
				description: "Le mot à rechercher",
				type: "STRING",
				required: true,
			},
			{
				name: "language",
				description: "La langue dans laquelle chercher le mot",
				type: "STRING",
				required: false,
				choices: [
					{
						name: "Français",
						value: "fr",
					},
					{
						name: "Anglais",
						value: "en",
					},
				],
			},
		],
		en: [
			{
				name: "word",
				description: "The word to search",
				type: "STRING",
				required: true,
			},
			{
				name: "language",
				description: "The language to search the word in",
				type: "STRING",
				required: false,
				choices: [
					{
						name: "Français",
						value: "fr",
					},
					{
						name: "Anglais",
						value: "en",
					},
				],
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const apiURL = "https://api.dictionaryapi.dev/api/v2/entries";

		const word = interaction.options.getString("word", true).toLowerCase();
		const searchLanguage =
			interaction.options.getString("language", false) ?? translations.language;

		Axios.get(`${apiURL}/${searchLanguage}/${encodeURIComponent(word)}`)
			.then(async ({ data }: { data: DictionaryResult[] }) => {
				interaction.followUp(
					`__**${data[0].word.replace(/^./, (a: string) =>
						a.toUpperCase(),
					)}**__: ${
						data[0].phonetics[0].text ? `(${data[0].phonetics[0].text})` : ""
					}\n${data[0].meanings
						.map(
							(meaning) =>
								`> __${meaning.partOfSpeech.replace(/^./, (a) =>
									a.toUpperCase(),
								)}:__ ${meaning.definitions[0].definition}${
									meaning.definitions[0].synonyms &&
									meaning.definitions[0].synonyms.length
										? `\n*${translations.strings.synonyms()}: ${meaning.definitions[0].synonyms.join(
												", ",
										  )}*`
										: ""
								}`,
						)
						.join("\n\n")}`,
				);
			})
			.catch(async (err) => {
				if (
					err.response.data.title &&
					err.response.data.title === "No Definitions Found"
				)
					return interaction.followUp(translations.strings.invalid_word());

				console.error(err);
			});
	},
};

interface DictionaryResult {
	word: string;
	phonetics: {
		text: string;
		audio: string;
	}[];
	meanings: {
		partOfSpeech: string;
		definitions: {
			definition: string;
			exemple: string;
			synonyms: string[];
		}[];
	}[];
}

export default command;
