import { Client, Collection, GuildMember, Intents, Message, MessageReaction, Snowflake, User } from "discord.js";

import Pg from "pg";
import { google as Google } from "googleapis";
import { CronJob } from "cron";

import { Language } from "./types/structures/Translations";
import Command from "./types/structures/Command";
import MessageResponse from "./types/structures/MessageResponse";
import ReactionCommand from "./types/structures/ReactionCommand";
import AutocompleteHandler from "./types/structures/AutocompleteHandler";
import Palette from "./types/canvas/Palette";
import Canvas from "./types/canvas/Canvas";
import Pokedex from "./types/pokemon/Pokedex";

import MusicPlayer from "./types/music/MusicPlayer";
import parseArgs from "./utils/misc/parseArgs";
import findMember from "./utils/misc/findMember";

import config from "./config.json";
import MusicUtil from "./types/music/MusicUtil";
import Game from "./types/werewolf/Game";

export default class Util {
	static readonly prefix = config.PREFIX;
	static readonly config = config;

	static readonly client = new Client({
		intents: new Intents([
			Intents.FLAGS.DIRECT_MESSAGES,
			Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
			Intents.FLAGS.GUILDS,
			Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
			Intents.FLAGS.GUILD_MEMBERS,
			Intents.FLAGS.GUILD_MESSAGES,
			Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
			Intents.FLAGS.GUILD_PRESENCES,
			Intents.FLAGS.GUILD_VOICE_STATES,
			Intents.FLAGS.GUILD_WEBHOOKS,
		]),
		presence: {
			activities: [
				{
					type: "WATCHING",
					name: "le meilleur clan",
				},
			],
		},
		partials: ["MESSAGE", "CHANNEL", "REACTION"],
		allowedMentions: {
			repliedUser: true,
			parse: ["users"],
		},
	});

	static database: Pg.Client;

	static readonly googleAuth = new Google.auth.JWT(
		process.env.GOOGLE_CLIENT_EMAIL,
		null,
		process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
		["https://www.googleapis.com/auth/spreadsheets.readonly"],
	);

	static readonly availableLanguages: Language[] = ["fr", "en"];
	static readonly guildConfigs: Collection<Snowflake, GuildConfig> = new Collection();
	static readonly commands: Collection<string, Command> = new Collection();
	static readonly messageResponses: MessageResponse[] = [];
	static readonly reactionCommands: ReactionCommand[] = [];
	static readonly autocompleteHandlers: Collection<string, AutocompleteHandler> = new Collection();
	static beta: boolean;
	static owner: User;
	static readonly palettes: Collection<string, Palette> = new Collection();
	static readonly canvas: Collection<string, Canvas> = new Collection();
	static roseLobby: CronJob;
	static parseArgs = parseArgs;
	static findMember = findMember;
	static readonly xpMessages: Collection<Snowflake, number> = new Collection();
	static readonly sniping: SnipingData = {
		deletedMessages: new Collection(),
		editedMessages: new Collection(),
		messageReactions: new Collection(),
	};

	static readonly music = MusicUtil;
	static readonly musicPlayer = new MusicPlayer(this.client);

	static pokedex = Pokedex;

	static readonly amongUsGames: Collection<Snowflake, AmongUsGame> = new Collection();
	static readonly russianRouletteGames: Collection<Snowflake, RussianRouletteGame> = new Collection();
	static readonly werewolfGames: Collection<Snowflake, Game> = new Collection();

	static get mainGuild() {
		return this.client.guilds.cache.get(this.config.MAIN_GUILD_ID);
	}

	static get colorRoles() {
		const topRole = this.mainGuild.roles.cache.get("818531980480086086");
		const bottomRole = this.mainGuild.roles.cache.get("735809874205737020");

		const colorRoles = this.mainGuild.roles.cache
			.filter(
				(role) =>
					role.rawPosition > bottomRole.rawPosition &&
					role.rawPosition < topRole.rawPosition &&
					role.name !== "──────────",
			)
			.sort((a, b) => b.rawPosition - a.rawPosition);

		return colorRoles;
	}

	static get colorGroups() {
		const topRole = this.mainGuild.roles.cache.get("818531980480086086");
		const bottomRole = this.mainGuild.roles.cache.get("735809874205737020");

		const colorRoles = this.mainGuild.roles.cache
			.filter((role) => role.rawPosition > bottomRole.rawPosition && role.rawPosition < topRole.rawPosition)
			.sort((a, b) => b.rawPosition - a.rawPosition);

		const colorGroups: typeof colorRoles[] = [];
		let colorGroup: typeof colorRoles = new Collection();

		colorRoles.forEach((role) => {
			if (role.name === "──────────") {
				colorGroups.push(colorGroup);
				colorGroup.clear();
			} else {
				colorGroup.set(role.id, role);
			}
		});

		colorGroups.push(colorGroup);

		return colorGroups;
	}
}

interface GuildConfig {
	language: Language;
	webhookId?: Snowflake;
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
