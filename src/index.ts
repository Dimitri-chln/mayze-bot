import "dotenv/config";

import Fs from "fs";
import Path from "path";
import { ClientConfig } from "pg";

import Util from "./Util";
import connectDatabase from "./utils/database/connectDatabase";

import Command, { CommandData } from "./structures/commands/Command";
import MessageResponse from "./types/MessageResponse";
import ReactionCommand from "./types/ReactionCommand";
import AutocompleteHandler from "./types/AutocompleteHandler";
import Event from "./types/Event";

async function main() {
	// Database
	const databaseConfig: ClientConfig = {
		connectionString: process.env.DATABASE_CONNECTION_STRING,
	};
	connectDatabase(databaseConfig);

	// Commands
	const commandDirectories = Fs.readdirSync(Path.resolve(__dirname, "commands"), {
		withFileTypes: true,
	}).filter((dirent) => dirent.isDirectory() && dirent.name !== "disabled");

	for (const directory of commandDirectories) {
		const commandFiles = Fs.readdirSync(Path.resolve(__dirname, "commands", directory.name)).filter((file) =>
			file.endsWith(".js"),
		);

		await Promise.all(
			commandFiles.map(async (file) => {
				const path = Path.resolve(__dirname, "commands", directory.name, file);

				const commandData: CommandData = require(path).default ?? require(path);
				const command = new Command(commandData, path, directory.name);
				await command.localize().catch(console.error);

				Util.commands.set(command.name.default, command);
			}),
		);
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

	// Autocomplete
	const autocompleteHandlerFiles = Fs.readdirSync(Path.resolve(__dirname, "autocomplete-handlers")).filter((file) =>
		file.endsWith(".js"),
	);

	autocompleteHandlerFiles.forEach((file) => {
		const path = Path.resolve(__dirname, "autocomplete-handlers", file);
		const autocompleteHandler: AutocompleteHandler = require(path).default ?? require(path);

		Util.autocompleteHandlers.set(autocompleteHandler.name, autocompleteHandler);
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

	// Music
	// const soundCloudClientId = await PlayDl.getFreeClientID();
	// await PlayDl.setToken({
	// 	youtube: {
	// 		cookie: process.env.YOUTUBE_COOKIE,
	// 	},
	// 	spotify: {
	// 		client_id: process.env.SPOTIFY_CLIENT_ID,
	// 		client_secret: process.env.SPOTIFY_CLIENT_SECRET,
	// 		refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
	// 		market: "FR",
	// 	},
	// 	soundcloud: {
	// 		client_id: soundCloudClientId,
	// 	},
	// });

	// Radio
	// startRadio();

	// Login to Discord
	Util.client.login(process.env.TOKEN);
}

main();

process.on("SIGTERM", () => {
	console.log("Received SIGTERM signal, terminating...");
	process.exit(0);
});
