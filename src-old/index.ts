import Dotenv from "dotenv";
Dotenv.config();

import Util from "./Util";

import Fs from "fs";
import Path from "path";
import Discord from "discord.js";
import PlayDl from "play-dl";

import Command from "./types/structures/Command";
import MessageResponse from "./types/structures/MessageResponse";
import ReactionCommand from "./types/structures/ReactionCommand";
import Event from "./types/structures/Event";
import AutocompleteHandler from "./types/structures/AutocompleteHandler";

import connectDatabase from "./utils/misc/connectDatabase";
import startRadio from "./utils/radio/startRadio";

(async function main() {
	// Database
	connectDatabase();

	// Commands
	const commandDirectories = Fs.readdirSync(Path.resolve(__dirname, "commands"), {
		withFileTypes: true,
	})
		.filter((dirent) => dirent.isDirectory() && dirent.name !== "disabled")
		.map((dirent) => dirent.name);

	for (const directory of commandDirectories) {
		const commandFiles = Fs.readdirSync(Path.resolve(__dirname, "commands", directory)).filter(
			(file) => file.endsWith(".js") && file !== "__base.js",
		);

		commandFiles.forEach((file) => {
			const path = Path.resolve(__dirname, "commands", directory, file);
			const command: Command = require(path).default ?? require(path);

			command.category = directory;
			command.path = path;
			command.cooldowns = new Discord.Collection();

			Util.commands.set(command.name, command);
		});
	}

	// Message responses
	const messageResponseFiles = Fs.readdirSync(Path.resolve(__dirname, "message-responses")).filter((file) =>
		file.endsWith(".js"),
	);

	messageResponseFiles.forEach((file) => {
		const path = Path.resolve(__dirname, "message-responses", file);
		const messageResponse: MessageResponse = require(path).default ?? require(path);

		Util.messageResponses.push(messageResponse);
	});

	// Reaction commands
	const reactionCommandsFiles = Fs.readdirSync(Path.resolve(__dirname, "reaction-commands")).filter((file) =>
		file.endsWith(".js"),
	);

	reactionCommandsFiles.forEach((file) => {
		const path = Path.resolve(__dirname, "reaction-commands", file);
		const reactionCommand: ReactionCommand = require(path).default ?? require(path);

		Util.reactionCommands.push(reactionCommand);
	});

	// Events
	const eventFiles = Fs.readdirSync(Path.resolve(__dirname, "events")).filter((file) => file.endsWith(".js"));

	eventFiles.forEach((file) => {
		const path = Path.resolve(__dirname, "events", file);
		const event: Event = require(path).default ?? require(path);

		if (event.once) {
			Util.client.once(event.name, (...args) => event.run(...args).catch(console.error));
		} else {
			Util.client.on(event.name, (...args) => event.run(...args).catch(console.error));
		}
	});

	// Autocomplete
	const autocompleteHandlerFiles = Fs.readdirSync(Path.resolve(__dirname, "autocomplete-handlers")).filter((file) =>
		file.endsWith(".js"),
	);

	autocompleteHandlerFiles.forEach((file) => {
		const path = Path.resolve(__dirname, "autocomplete-handlers", file);
		const autocompleteHandler: AutocompleteHandler = require(path).default ?? require(path);

		Util.autocompleteHandlers.set(autocompleteHandler.name, autocompleteHandler);
	});

	// Music
	const soundCloudClientId = await PlayDl.getFreeClientID();
	await PlayDl.setToken({
		youtube: {
			cookie: process.env.YOUTUBE_COOKIE,
		},
		spotify: {
			client_id: process.env.SPOTIFY_CLIENT_ID,
			client_secret: process.env.SPOTIFY_CLIENT_SECRET,
			refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
			market: "FR",
		},
		soundcloud: {
			client_id: soundCloudClientId,
		},
	});

	// Login to Discord
	Util.client.login(process.env.TOKEN);

	// Radio
	// startRadio();
})();
