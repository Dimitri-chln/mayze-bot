import {
	ApplicationCommandOptionData,
	Collection,
	CommandInteraction,
	PermissionString,
	Snowflake,
} from "discord.js";
import Util from "../../Util";
import Translations from "./Translations";

const t = Util.config.LANGUAGES;

interface CommandDescription {
	fr: string;
	en: string;
}

interface CommandOptions {
	fr: ApplicationCommandOptionData[];
	en: ApplicationCommandOptionData[];
}

export default interface Command {
	readonly name: string;
	readonly description: CommandDescription;
	readonly userPermissions: PermissionString[];
	readonly botPermissions: PermissionString[];
	readonly options: CommandOptions;
	readonly cooldown?: number;
	readonly guildIds?: Snowflake[];
	path?: string;
	category?: string;
	cooldowns?: Collection<Snowflake, number>;
	run(
		interaction: CommandInteraction,
		translations: Translations,
	): Promise<any>;
}
