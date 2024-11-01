import Util from "../../Util";

import { DatabaseLocalizations } from "../../types/Database";

import parseDataBaseLocalizations from "../../utils/database/parseDatabaseLocalizations";
import LocalizationItem from "./LocalizationItem";

export default class LocalizationManager<Localizations> {
	readonly path: string;
	strings: Localizations;

	constructor(path: string) {
		this.path = path;
		this.strings = {} as Localizations;
	}

	async fetch() {
		const { rows: localizations }: { rows: DatabaseLocalizations[] } = await Util.database.query(
			`SELECT * FROM localizations WHERE NAME LIKE $1`,
			[`${this.path}.%`],
		);

		this.strings = parseDataBaseLocalizations(localizations, this.path) as Localizations;
	}
}

export class AllLocalizationsManager extends LocalizationManager<AllLocalizations> {
	constructor() {
		super("");
	}
}

export class CommandLocalizationManager extends LocalizationManager<CommandLocalization> {
	constructor(commandName: string) {
		super(`commands.${commandName}`);
	}
}

export class DataLocalizationManager extends LocalizationManager<DataLocalization> {
	constructor() {
		super("data");
	}
}

export class PokemonLocalizationManager extends LocalizationManager<PokemonLocalization> {
	constructor() {
		super("pokemon");
	}
}

export interface LocalizationItemList {
	[K: string]: LocalizationItem;
}

export interface BaseLocalization {
	[K: string]: BaseLocalization | LocalizationItem;
}

export interface AllLocalizations {
	commands: {
		[K: string]: CommandLocalization;
	};
	data: DataLocalization;
	pokemon: PokemonLocalization;
}

export interface CommandLocalization {
	name: LocalizationItem;
	description: LocalizationItem;
	subcommandgroups?: {
		[K: string]: SubCommandGroupLocalization;
	};
	subcommands?: {
		[K: string]: SubCommandLocalization;
	};
	options?: {
		[K: string]: OptionLocalization;
	};
	data?: LocalizationItemList;
}

export interface SubCommandGroupLocalization {
	name: LocalizationItem;
	description: LocalizationItem;
	subcommands: {
		[K: string]: SubCommandLocalization;
	};
}

export interface SubCommandLocalization {
	name: LocalizationItem;
	description: LocalizationItem;
	options?: {
		[K: string]: OptionLocalization;
	};
	data?: LocalizationItemList;
}

export interface OptionLocalization {
	name: LocalizationItem;
	description: LocalizationItem;
	choices?: LocalizationItemList;
	autocomplete?: LocalizationItemList;
}

export type DataLocalization = {
	command_execution: LocalizationItemList & {
		data_type: LocalizationItemList;
	};
	level: LocalizationItemList;
	time_format: LocalizationItemList;
	pagination: LocalizationItemList;
};

export interface PokemonLocalization {
	pokemons: {
		[K: string]: {
			name: LocalizationItem;
			variations?: {
				[K: string]: {
					[K: string]: {
						name: LocalizationItem;
					};
				};
			};
		};
	};
	types: LocalizationItemList;
	mega_stones: LocalizationItemList;
}
