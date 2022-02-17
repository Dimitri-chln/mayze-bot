import Dotenv from "dotenv";
Dotenv.config();

import Util from "./Util";

import Fs from "fs";
import Path from "path";
import Discord from "discord.js";

import connectDatabase from "./utils/misc/connectDatabase";
import Command from "./types/structures/Command";
import MessageResponse from "./types/structures/MessageResponse";
import ReactionCommand from "./types/structures/ReactionCommand";
import Event from "./types/structures/Event";

import PlayDl from "play-dl";

// Database
connectDatabase();

// Commands
const commandDirectories = Fs.readdirSync(Path.resolve(__dirname, "commands"), {
	withFileTypes: true,
})
	.filter((dirent) => dirent.isDirectory() && dirent.name !== "disabled")
	.map((dirent) => dirent.name);

for (const directory of commandDirectories) {
	const commandFiles = Fs.readdirSync(
		Path.resolve(__dirname, "commands", directory),
	).filter((file) => file.endsWith(".js") && file !== "__base.js");

	commandFiles.forEach(async (file) => {
		const path = Path.resolve(__dirname, "commands", directory, file);
		const command: Command = require(path).default ?? require(path);

		command.category = directory;
		command.path = path;
		command.cooldowns = new Discord.Collection();

		Util.commands.set(command.name, command);
	});
}

// Message responses
const messageResponseFiles = Fs.readdirSync(
	Path.resolve(__dirname, "message-responses"),
).filter((file) => file.endsWith(".js") && file !== "__base.js");

messageResponseFiles.forEach(async (file) => {
	const path = Path.resolve(__dirname, "message-responses", file);
	const messageResponse: MessageResponse =
		require(path).default ?? require(path);

	Util.messageResponses.push(messageResponse);
});

// Reaction commands
const reactionCommandsFiles = Fs.readdirSync(
	Path.resolve(__dirname, "reaction-commands"),
).filter((file) => file.endsWith(".js") && file !== "__base.js");

reactionCommandsFiles.forEach(async (file) => {
	const path = Path.resolve(__dirname, "reaction-commands", file);
	const reactionCommand: ReactionCommand =
		require(path).default ?? require(path);

	Util.reactionCommands.push(reactionCommand);
});

// Events
const eventFiles = Fs.readdirSync(Path.resolve(__dirname, "events")).filter(
	(file) => file.endsWith(".js") && file !== "__base.js",
);

eventFiles.forEach(async (file) => {
	const path = Path.resolve(__dirname, "events", file);
	const event: Event = require(path).default ?? require(path);

	if (event.once) {
		Util.client.once(event.name, (...args) =>
			event.run(...args).catch(console.error),
		);
	} else {
		Util.client.on(event.name, (...args) =>
			event.run(...args).catch(console.error),
		);
	}
});

PlayDl.getFreeClientID().then((soundCloudClientId) => {
	PlayDl.setToken({
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
	}).then(() => {
		Util.client.login(process.env.TOKEN);
	});
});
