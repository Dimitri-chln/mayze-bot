import { CommandData } from "../../structures/commands/Command";
import { ApplicationCommandOptionType, Locale, PermissionFlagsBits, PermissionsBitField } from "discord.js";
import Util from "../../Util";

import Axios from "axios";

const command: CommandData = {
	name: "define",
	aliases: ["def"],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField(),

	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: "word",
			description: undefined,
			required: true,
		},
	],

	async run(input, args, localizations) {
		const word = args.get("word") as string;

		switch (input.locale) {
			case Locale.EnglishGB:
			case Locale.EnglishUS: {
				const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;

				Axios.get(url)
					.then(async ({ data }: { data: EnglishDictionaryResult[] }) => {
						input.reply(
							`__**${data[0].word.replace(/^./, (match) => match.toUpperCase())}**__: ${
								data[0].phonetics[0].text ? `(${data[0].phonetics[0].text})` : ""
							}\n${data[0].meanings
								.map(
									(meaning) =>
										`> __${meaning.partOfSpeech.replace(/^./, (match) => match.toUpperCase())}:__ ${
											meaning.definitions[0].definition
										}${
											meaning.definitions[0].synonyms?.length
												? `\n*${localizations.synonyms.format(
														input.locale,
														meaning.definitions[0].synonyms.join(", "),
												  )}*`
												: ""
										}`,
								)
								.join("\n\n")}`,
						);
					})
					.catch(async (err) => {
						if (err.response.data.title === "No Definitions Found") {
							await input.reply(localizations.invalid_word.format(input.locale));
							return;
						}

						console.error(err);
					});
				break;
			}
			case Locale.French: {
				const url = `https://api.dicolink.com/v1/mot/${encodeURIComponent(word)}/definitions`;

				Axios.get(url, { params: { api_key: process.env.DICOLINK_API_KEY, source: "larousse" } })
					.then(async ({ data }: { data: FrenchDictionaryResult[] | FrenchDictionaryError }) => {
						if (isFrenchDictionaryError(data)) {
							await input.reply(localizations.invalid_word.format(input.locale));
							return;
						}

						input.reply(
							`__**${data[0].mot.replace(/^./, (match) => match.toUpperCase())}**__:\n${data
								.map(
									(result) =>
										`> __${result.nature.replace(/^./, (match) => match.toUpperCase())}:__ ${result.definition}`,
								)
								.join("\n\n")}`,
						);
					})
					.catch(async (err) => {
						if (err.response.status === 404) {
							await input.reply(localizations.invalid_word.format(input.locale));
							return;
						}

						console.error(err);
					});
				break;
			}
			default:
				await input.reply(localizations.not_available.format(input.locale));
		}
	},
};

interface EnglishDictionaryResult {
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

interface FrenchDictionaryResult {
	id: "string";
	nature: "string";
	source: "string";
	attributionText: "string";
	attributionUrl: "string";
	mot: "string";
	definition: "string";
	dicolinkUrl: "string";
}
type FrenchDictionaryError = { error: string };

function isFrenchDictionaryError(
	result: FrenchDictionaryResult[] | FrenchDictionaryError,
): result is FrenchDictionaryError {
	return (result as FrenchDictionaryError).error !== undefined;
}

export default command;
