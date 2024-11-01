import config from "./config.json";

import {
	ActivityType,
	Client,
	Collection,
	GatewayIntentBits,
	Locale,
	Message,
	MessageReaction,
	Partials,
	Snowflake,
	User,
} from "discord.js";
import { Client as DatabaseClient } from "pg";

import Command from "./structures/commands/Command";
import MessageResponse from "./types/MessageResponse";
import ReactionCommand from "./types/ReactionCommand";
import AutocompleteHandler from "./types/AutocompleteHandler";

import Palette from "./structures/canvas/Palette";
import Canvas from "./structures/canvas/Canvas";
import Pokedex from "./structures/pokemons/Pokedex";
import pokemons from "./assets/pokemons.json";
import { PokemonData } from "./structures/pokemons/Pokemon";

export default class Util {
	static readonly config = config;
	static readonly prefix = config.PREFIX;

	static readonly client = new Client({
		intents: [
			GatewayIntentBits.DirectMessages,
			GatewayIntentBits.DirectMessageReactions,
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildEmojisAndStickers,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildMessageReactions,
			GatewayIntentBits.GuildPresences,
			GatewayIntentBits.GuildVoiceStates,
			GatewayIntentBits.GuildWebhooks,
			GatewayIntentBits.MessageContent,
		],
		presence: {
			activities: [
				{
					type: ActivityType.Watching,
					name: "le meilleur clan",
				},
			],
		},
		partials: [Partials.Message, Partials.Channel, Partials.Reaction],
		allowedMentions: {
			repliedUser: true,
			parse: ["users"],
		},
	});

	static owner: User;
	static database: DatabaseClient;

	static readonly commands: Collection<string, Command> = new Collection();
	static readonly messageResponses: MessageResponse[] = [];
	static readonly reactionCommands: ReactionCommand[] = [];
	static readonly autocompleteHandlers: Collection<string, AutocompleteHandler> = new Collection();

	static readonly guildConfigs: Collection<Snowflake, GuildConfig> = new Collection();
	static readonly xpMessages: Collection<Snowflake, number> = new Collection();

	static readonly palettes: Collection<number, Palette> = new Collection();
	static readonly canvas: Collection<number, Canvas> = new Collection();

	static readonly pokedex = new Pokedex(pokemons as PokemonData[]);

	static readonly sniping: SnipingData = {
		deletedMessages: new Collection(),
		editedMessages: new Collection(),
		messageReactions: new Collection(),
	};

	/*
	static readonly music = MusicUtil;
	static readonly musicPlayer = new MusicPlayer(this.client);
	*/
}

interface GuildConfig {
	locale: Locale;
	jailRoleId?: Snowflake;
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
