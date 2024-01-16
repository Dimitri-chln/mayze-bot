type English = string;
type EnglishGB = string;
type EnglishUS = string;
type French = string;
type TranslationItem = [English, French] | [EnglishGB, EnglishUS, French];

interface OptionsTranslation {
	name: TranslationItem;
	description: TranslationItem;
	choices?: {
		[K: string]: TranslationItem;
	};
	autocomplete?: {
		[K: string]: TranslationItem;
	};
}

interface SubCommandTranslation {
	name: TranslationItem;
	description: TranslationItem;
	options?: {
		[K: string]: OptionsTranslation;
	};
	data?: {
		[K: string]: TranslationItem;
	};
}

interface SubCommandGroupTranslation {
	name: TranslationItem;
	description: TranslationItem;
	subcommands: {
		[K: string]: SubCommandTranslation;
	};
}

interface CommandTranslation {
	name: TranslationItem;
	description: TranslationItem;
	subcommandgroups?: {
		[K: string]: SubCommandGroupTranslation;
	};
	subcommands?: {
		[K: string]: SubCommandTranslation;
	};
	options?: {
		[K: string]: OptionsTranslation;
	};
	data?: {
		[K: string]: TranslationItem;
	};
}

interface AllTranslations {
	commands: {
		[K: string]: CommandTranslation;
	};
}
