import {
	Client,
	Collection,
	GuildMember,
	Message,
	MessageReaction,
	Snowflake,
	User,
} from "discord.js";
import Pg from "pg";
import { google as Google } from "googleapis";
import { CronJob } from "cron";
import MusicPlayer from "./utils/music/MusicPlayer";
import SpotifyWebApi from "spotify-web-api-node";

import { Language } from "./types/structures/Translations";
import Command from "./types/structures/Command";
import MessageResponse from "./types/structures/MessageResponse";
import ReactionCommand from "./types/structures/ReactionCommand";
import Palette from "./types/canvas/Palette";
import Canvas from "./types/canvas/Canvas";
import Pokedex from "./types/pokemon/Pokedex";

import parseArgs from "./utils/misc/parseArgs";
import findMember from "./utils/misc/findMember";
import config from "./config.json";
import MessageCommand from "./types/structures/MessageCommand";

export default class Util {
	static readonly prefix = config.PREFIX;
	static readonly config = config;
	static client: Client;
	static database: Pg.Client;
	static readonly googleAuth = new Google.auth.JWT(
		process.env.GOOGLE_CLIENT_EMAIL,
		null,
		process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
		["https://www.googleapis.com/auth/spreadsheets.readonly"],
	);
	static readonly availableLanguages: Language[] = ["fr", "en"];
	static guildConfigs: Collection<Snowflake, GuildConfig> = new Collection();
	static commands: Collection<string, Command> = new Collection();
	static messageCommands: Collection<string, MessageCommand> = new Collection();
	static messageResponses: MessageResponse[] = [];
	static reactionCommands: ReactionCommand[] = [];
	static beta: boolean;
	static owner: User;
	static palettes: Collection<string, Palette> = new Collection();
	static canvas: Collection<string, Canvas> = new Collection();
	static roseLobby: CronJob;
	static parseArgs = parseArgs;
	static xpMessages: Collection<Snowflake, number> = new Collection();
	static sniping: SnipingData = {
		deletedMessages: new Collection(),
		editedMessages: new Collection(),
		messageReactions: new Collection(),
	};
	static musicPlayer: MusicPlayer;
	static songDisplays: Collection<Snowflake, Message> = new Collection();
	static spotify: SpotifyWebApi;
	static pokedex = Pokedex;
	static findMember = findMember;

	static amongUsGames: Collection<Snowflake, AmongUsGame> = new Collection();
	static russianRouletteGames: Collection<Snowflake, RussianRouletteGame> =
		new Collection();
}

interface GuildConfig {
	language: Language;
	webhookId: Snowflake;
}

interface MessageReactionSnipingData {
	reaction: MessageReaction;
	user: User;
}

interface SnipingData {
	deletedMessages: Collection<Snowflake, Message>;
	editedMessages: Collection<Snowflake, Message>;
	messageReactions: Collection<Snowflake, MessageReactionSnipingData>;
}

interface AmongUsGame {
	code: string;
	description: string;
	time: number;
}

interface RussianRouletteGame {
	creator: GuildMember;
	members: Collection<Snowflake, GuildMember>;
}
