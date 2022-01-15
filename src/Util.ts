import { Collection, Message, MessageReaction, Snowflake, User } from "discord.js";
import Pg from "pg";
import { CronJob } from "cron";
import MusicPlayer from "./utils/music/MusicPlayer";
import SpotifyWebApi from "spotify-web-api-node";

import { Language } from "./types/structures/LanguageStrings";
import Command from "./types/structures/Command";
import MessageResponse from "./types/structures/MessageResponse";
import ReactionCommand from "./types/structures/ReactionCommand";
import Palette from "./types/canvas/Palette";
import Canvas from "./types/canvas/Canvas";
import Pokedex from "./types/pokemon/Pokedex";

import voiceXp from "./utils/misc/voiceXp";
import parseArgs from "./utils/misc/parseArgs";
import chatXp from "./utils/misc/chatXp";
import findMember from "./utils/misc/findMember";
import config from "./config.json";



export default class Util {
	static config = config;
	static database: Pg.Client;
	static languages: Collection<Snowflake, Language> = new Collection();
	static commands: Collection<string, Command> = new Collection();
	static messageResponses: MessageResponse[] = [];
	static reactionCommands: ReactionCommand[] = [];
	static commandCooldowns: Collection<string, Collection<Snowflake, number>> = new Collection();
	static channelCooldowns: Collection<Snowflake, ChannelCooldown> = new Collection();
	static beta: boolean;
	static owner: User;
	static prefix: string;
	static palettes: Collection<string, Palette> = new Collection();
	static canvas: Collection<string, Canvas> = new Collection();
	static roseLobby: CronJob;
	static chatXp = chatXp;
	static voiceXp = voiceXp;
	static parseArgs = parseArgs;
	static xpMessages: Collection<Snowflake, number> = new Collection();
	static sniping: SnipingData = {
		deletedMessages: new Collection(),
		editedMessages: new Collection(),
		messageReactions: new Collection()
	};
	static musicPlayer: MusicPlayer;
	static songDisplays: Collection<Snowflake, Message> = new Collection();
	static spotify: SpotifyWebApi;
	static pokedex = Pokedex;
	static findMember = findMember;

	static amongUsGames: Collection<Snowflake, AmongUsGame> = new Collection();
}



interface ChannelCooldown {
	numberOfMessages: number;
	lastMessageTimestamp: number;
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