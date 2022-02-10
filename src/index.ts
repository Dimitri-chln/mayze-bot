import Dotenv from "dotenv";
Dotenv.config();

import Util from "./Util";

import Fs from "fs";
import Path from "path";
import Cron from "cron";
import Discord from "discord.js";
import Pg from "pg";
import SpotifyWebApi from "spotify-web-api-node";

import Translations from "./types/structures/Translations";

import Command from "./types/structures/Command";
import MessageResponse from "./types/structures/MessageResponse";
import ReactionCommand from "./types/structures/ReactionCommand";
import Color from "./types/canvas/Color";
import Palette from "./types/canvas/Palette";
import Canvas from "./types/canvas/Canvas";
import runCommand from "./utils/misc/runCommand";
import getLevel from "./utils/misc/getLevel";
import MusicPlayer from "./utils/music/MusicPlayer";
import MusicUtil from "./utils/music/MusicUtil";
import {
	DatabaseColor,
	DatabaseGuildConfig,
	DatabaseLevel,
	DatabaseReminder,
} from "./types/structures/Database";
import parseArgs from "./utils/misc/parseArgs";
import MessageCommand from "./types/structures/MessageCommand";
import runMessageCommand from "./utils/misc/runMessageCommand";

const intents = new Discord.Intents([
	Discord.Intents.FLAGS.DIRECT_MESSAGES,
	Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
	Discord.Intents.FLAGS.GUILDS,
	Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
	Discord.Intents.FLAGS.GUILD_MEMBERS,
	Discord.Intents.FLAGS.GUILD_MESSAGES,
	Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	Discord.Intents.FLAGS.GUILD_PRESENCES,
	Discord.Intents.FLAGS.GUILD_VOICE_STATES,
	Discord.Intents.FLAGS.GUILD_WEBHOOKS,
]);

const client = new Discord.Client({
	intents,
	presence: {
		activities: [
			{
				type: "WATCHING",
				name: "le meilleur clan",
			},
		],
	},
	partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

(async function connectDatabase() {
	const connectionString: Pg.ClientConfig = {
		connectionString: process.env.DATABASE_URL,
		ssl: process.env.ENVIRONMENT === "PRODUCTION",
	};

	Util.database = new Pg.Client(connectionString);

	Util.database.on("error", (err) => {
		console.error(err);
		Util.database.end().then(connectDatabase).catch(console.error);
	});

	Util.database
		.connect()
		.then(() => console.log("Connected to the database"))
		.catch(console.error);

	setTimeout(() => {
		Util.database.end().then(connectDatabase).catch(console.error);
	}, 3_600_000); // 1 hour
})();

const commandDirectories = Fs.readdirSync(Path.resolve(__dirname, "commands"), {
	withFileTypes: true,
})
	.filter((dirent) => dirent.isDirectory() && dirent.name !== "disabled")
	.map((dirent) => dirent.name);

for (const directory of commandDirectories) {
	const commandFiles = Fs.readdirSync(
		Path.resolve(__dirname, "commands", directory),
	).filter((file) => file.endsWith(".js"));

	commandFiles.forEach(async (file) => {
		const path = Path.resolve(__dirname, "commands", directory, file);
		const command: Command = require(path).default ?? require(path);

		command.category = directory;
		command.path = path;
		command.cooldowns = new Discord.Collection();
		command.available = new Promise((resolve, reject) => {
			new Translations(`cmd_${command.name}`)
				.init()
				.then((translations) => {
					command.translations = translations;
					resolve(true);
				})
				.catch((err) => {
					console.error(err);
					resolve(false);
				});
		});

		Util.commands.set(command.name, command);
	});
}

const messageCommandDirectories = Fs.readdirSync(
	Path.resolve(__dirname, "message-commands"),
	{
		withFileTypes: true,
	},
)
	.filter((dirent) => dirent.isDirectory() && dirent.name !== "disabled")
	.map((dirent) => dirent.name);

for (const directory of messageCommandDirectories) {
	const messageCommandFiles = Fs.readdirSync(
		Path.resolve(__dirname, "message-commands", directory),
	).filter((file) => file.endsWith(".js"));

	messageCommandFiles.forEach(async (file) => {
		const path = Path.resolve(__dirname, "message-commands", directory, file);
		const messageCommand: MessageCommand =
			require(path).default ?? require(path);

		messageCommand.category = directory;
		messageCommand.path = path;
		messageCommand.cooldowns = new Discord.Collection();
		messageCommand.available = new Promise((resolve, reject) => {
			new Translations(`cmd_${messageCommand.name}`)
				.init()
				.then((translations) => {
					messageCommand.translations = translations;
					resolve(true);
				})
				.catch((err) => {
					console.error(err);
					resolve(false);
				});
		});

		Util.messageCommands.set(messageCommand.name, messageCommand);
	});
}

const messageResponseFiles = Fs.readdirSync(
	Path.resolve(__dirname, "responses"),
).filter((file) => file.endsWith(".js"));

messageResponseFiles.forEach(async (file) => {
	const messageResponse: MessageResponse =
		require(Path.resolve(__dirname, "responses", file)).default ??
		require(Path.resolve(__dirname, "responses", file));

	messageResponse.translations = await new Translations(
		`resp_${messageResponse.name}`,
	).init();

	Util.messageResponses.push(messageResponse);
});

const reactionCommandsFiles = Fs.readdirSync(
	Path.resolve(__dirname, "reaction-commands"),
).filter((file) => file.endsWith(".js"));

reactionCommandsFiles.forEach(async (file) => {
	const reactionCommand: ReactionCommand =
		require(Path.resolve(__dirname, "reaction-commands", file)).default ??
		require(Path.resolve(__dirname, "reaction-commands", file));

	reactionCommand.translations = await new Translations(
		`reac_${reactionCommand.name}`,
	).init();

	Util.reactionCommands.push(reactionCommand);
});

client.on("ready", async () => {
	console.log("Connected to Discord");

	Util.client = client;
	Util.beta = client.user.id === Util.config.BETA_CLIENT_ID;

	const logChannel = client.channels.cache.get(Util.config.LOG_CHANNEL_ID);

	(logChannel as Discord.TextChannel)
		.send({
			embeds: [
				{
					author: {
						name: "Mayze is starting...",
						iconURL: client.user.displayAvatarURL(),
					},
					color: 0x010101,
					description: `• **Ping:** \`${client.ws.ping}\`ms`,
					footer: {
						text: "✨ Mayze ✨",
					},
					timestamp: Date.now(),
				},
			],
		})
		.catch(console.error);

	client.users
		.fetch(Util.config.OWNER_ID)
		.then((owner: Discord.User) => (Util.owner = owner))
		.catch(console.error);

	// Guild configs
	const { rows: guildConfigs }: { rows: DatabaseGuildConfig[] } =
		await Util.database.query("SELECT * FROM guild_config");
	for (const guildConfig of guildConfigs) {
		Util.guildConfigs.set(guildConfig.guild_id, {
			language: guildConfig.language,
			webhookId: guildConfig.webhook_id,
		});
	}

	console.log("Fetching global and admin application commands");
	await client.application.commands.fetch();
	await client.guilds.cache.get(Util.config.ADMIN_GUILD_ID).commands.fetch();
	console.log("Fetched all global and admin application commands successfully");

	// Slash commands
	await Promise.all(
		Util.commands.map(async (command) => {
			const applicationCommandData: Discord.ChatInputApplicationCommandData = {
				type: "CHAT_INPUT",
				name: command.name,
				description: command.description.en,
				options: command.options.en,
			};

			// Admin commands
			if (command.category === "admin") {
				applicationCommandData.defaultPermission = false;

				const applicationCommand = client.guilds.cache
					.get(Util.config.ADMIN_GUILD_ID)
					.commands.cache.find(
						(cmd) => cmd.name === applicationCommandData.name,
					);

				if (!applicationCommand) {
					console.log(
						`Creating the admin application command /${applicationCommandData.name}`,
					);
					client.application.commands
						.create(applicationCommandData, Util.config.ADMIN_GUILD_ID)
						.then((newApplicationCommand) =>
							newApplicationCommand.permissions.set({
								guild: Util.config.ADMIN_GUILD_ID,
								permissions: [
									{
										id: Util.config.OWNER_ID,
										type: "USER",
										permission: true,
									},
								],
							}),
						)
						.catch(console.error);
				}

				if (
					applicationCommand &&
					!applicationCommand.equals(applicationCommandData)
				) {
					console.log(
						`Editing the admin application command /${applicationCommandData.name}`,
					);
					client.application.commands
						.edit(
							applicationCommand.id,
							applicationCommandData,
							Util.config.ADMIN_GUILD_ID,
						)
						.then((newApplicationCommand) =>
							newApplicationCommand.permissions.set({
								permissions: [
									{
										id: Util.config.OWNER_ID,
										type: "USER",
										permission: true,
									},
								],
							}),
						)
						.catch(console.error);
				}
			} else {
				// Guild commands
				if (command.guildIds) {
					for (const guildId of command.guildIds.filter((id) =>
						client.guilds.cache.has(id),
					)) {
						await client.guilds.cache.get(guildId).commands.fetch();
						const applicationCommand = client.guilds.cache
							.get(guildId)
							.commands.cache.find(
								(cmd) => cmd.name === applicationCommandData.name,
							);

						if (!applicationCommand) {
							console.log(
								`Creating the application command /${applicationCommandData.name} in the guild: ${guildId}`,
							);
							applicationCommandData.description =
								command.description[Util.guildConfigs.get(guildId).language] ??
								command.description.en;
							applicationCommandData.options =
								command.options[Util.guildConfigs.get(guildId).language] ??
								command.options.en;
							client.application.commands
								.create(applicationCommandData, guildId)
								.catch(console.error);
						}

						if (
							applicationCommand &&
							!applicationCommand.equals(applicationCommandData)
						) {
							console.log(
								`Editing the application command /${applicationCommandData.name} in the guild: ${guildId}`,
							);
							applicationCommandData.description =
								command.description[Util.guildConfigs.get(guildId).language] ??
								command.description.en;
							applicationCommandData.options =
								command.options[Util.guildConfigs.get(guildId).language] ??
								command.options.en;
							client.application.commands
								.edit(applicationCommand.id, applicationCommandData, guildId)
								.catch(console.error);
						}
					}

					// Global commands
				} else {
					const applicationCommand = client.application.commands.cache.find(
						(cmd) => cmd.name === applicationCommandData.name,
					);

					if (!applicationCommand) {
						console.log(
							`Creating the global application command /${applicationCommandData.name}`,
						);
						client.application.commands
							.create(applicationCommandData)
							.catch(console.error);
					}

					if (
						applicationCommand &&
						!applicationCommand.equals(applicationCommandData)
					) {
						console.log(
							`Editing the global application command /${applicationCommandData.name}`,
						);
						client.application.commands
							.edit(applicationCommand.id, applicationCommandData)
							.catch(console.error);
					}
				}
			}
		}),
	).catch(console.error);

	// Canvas
	const { emojis } = client.guilds.cache.get(Util.config.CANVAS_GUILD_ID);

	Util.database
		.query("SELECT * FROM color")
		.then(async ({ rows: colors }: { rows: DatabaseColor[] }) => {
			for (const color of colors) {
				let emoji = emojis.cache.find((e) => e.name === `pl_${color.alias}`);

				if (!emoji) {
					let red = Math.floor(color.code / (256 * 256));
					let green = Math.floor((color.code % (256 * 256)) / 256);
					let blue = color.code % 256;
					let hex =
						red.toString(16).padStart(2, "0") +
						green.toString(16).padStart(2, "0") +
						blue.toString(16).padStart(2, "0");
					emoji = await emojis.create(
						`https://dummyimage.com/256/${hex}?text=%20`,
						`pl_${color.alias}`,
					);
				}

				if (!Util.palettes.has(color.palette))
					Util.palettes.set(color.palette, new Palette(color.palette));

				Util.palettes
					.get(color.palette)
					.add(new Color(color.name, color.alias, color.code, emoji));
			}

			emojis.cache.forEach((e) => {
				if (!colors.some((c) => `pl_${c.alias}` === e.name))
					e.delete().catch(console.error);
			});

			Util.database.query("SELECT name FROM canvas").then((res) => {
				for (const row of res.rows) {
					const canvas = new Canvas(
						row.name,
						client,
						Util.database,
						Util.palettes,
					);
					Util.canvas.set(canvas.name, canvas);
				}
			});
		});

	// Reminders
	setInterval(async () => {
		try {
			const { rows: reminders }: { rows: DatabaseReminder[] } =
				await Util.database.query("SELECT * FROM reminder");

			reminders.forEach(async (reminder) => {
				const timestamp = new Date(reminder.timestamp);

				try {
					if (Date.now() > timestamp.valueOf()) {
						client.users.fetch(reminder.user_id).then((user) => {
							user.send(`⏰ | ${reminder.content}`);
						});

						if (reminder.repeat) {
							Util.database.query(
								"UPDATE reminder SET timestamp = $1 WHERE id = $2",
								[new Date(timestamp.valueOf() + reminder.repeat), reminder.id],
							);
						} else {
							Util.database.query("DELETE FROM reminder WHERE id = $1", [
								reminder.id,
							]);
						}
					}
				} catch (err) {
					console.error(err);
				}
			});
		} catch (err) {
			console.error(err);
		}
	}, 10_000);

	// Voice xp
	setInterval(() => {
		client.guilds.cache.forEach(async (guild) => {
			const translations = (await new Translations("index_level").init()).data[
				Util.guildConfigs.get(guild.id).language
			];

			guild.members.cache
				.filter((m) => m.voice.channelId && !m.user.bot)
				.forEach(async (member) => {
					if (member.voice.channel.members.size < 2) return;

					let newXP =
						Util.config.BASE_VOICE_XP *
						member.voice.channel.members.filter((m) => !m.user.bot).size;

					if (member.voice.deaf) newXP *= 0;
					if (member.voice.mute) newXP *= 0.5;
					if (
						member.voice.streaming &&
						member.voice.channel.members.filter((m) => !m.user.bot).size > 1
					)
						newXP *= 3;
					if (
						member.voice.selfVideo &&
						member.voice.channel.members.filter((m) => !m.user.bot).size > 1
					)
						newXP *= 5;

					try {
						const {
							rows: [{ voice_xp: xp }],
						}: { rows: DatabaseLevel[] } = await Util.database.query(
							`
						INSERT INTO level (user_id, voice_xp) VALUES ($1, $2)
						ON CONFLICT (user_id)
						DO UPDATE SET
							voice_xp = level.voice_xp + $2 WHERE level.user_id = $1
						RETURNING level.voice_xp
						`,
							[member.user.id, newXP],
						);

						const levelInfo = getLevel(xp);

						if (
							levelInfo.currentXP < newXP &&
							member.guild.id === Util.config.MAIN_GUILD_ID
						)
							member.user.send(
								translations.strings.voice_level_up(
									translations.language,
									levelInfo.level.toString(),
								),
							);
					} catch (err) {
						console.error(err);
					}
				});
		});
	}, 60_000);

	if (Util.beta) return;

	// Predefined reminders
	testReminders();

	// Rose lobbies
	const roseChannel = client.channels.cache.get(
		Util.config.ROSE_LOBBY_LOG_CHANNEL_ID,
	);
	const announcementChannel = client.channels.cache.get(
		Util.config.ROSE_LOBBY_ANNOUNCEMENT_CHANNEL_ID,
	);

	(roseChannel as Discord.TextChannel).messages
		.fetch({ limit: 1 })
		.then(([[, logMessage]]) => {
			const regex = /^\*\*Starting at:\*\* `(.*)`\n\*\*Password:\*\* `(.*)`$/;

			const [, dateString, password] = logMessage.content.match(regex) ?? [];
			const date = new Date(dateString);
			if (!date || !password) return;

			if (Util.roseLobby) Util.roseLobby.stop();

			Util.roseLobby = new Cron.CronJob(date, () => {
				(announcementChannel as Discord.TextChannel)
					.send(
						`<@&${Util.config.ROSE_LOBBY_ROLE_ID}>\nLa game de roses va démarrer, le mot de passe est \`${password}\``,
					)
					.catch(console.error);
				logMessage.edit(`~~${logMessage.content}~~`).catch(console.error);
			});

			Util.roseLobby.start();

			console.log(
				`Restarted rose lobby at ${date.toUTCString()} with password ${password}`,
			);
		})
		.catch(console.error);
});

client.on("interactionCreate", async (interaction) => {
	switch (interaction.type) {
		case "PING": {
			break;
		}

		case "APPLICATION_COMMAND": {
			if (interaction.isCommand()) {
				await interaction.deferReply();

				const command = Util.commands.get(interaction.commandName);
				if (command) runCommand(command, interaction).catch(console.error);
			}

			if (interaction.isContextMenu()) {
				// Run
			}
			break;
		}

		case "APPLICATION_COMMAND_AUTOCOMPLETE": {
			break;
		}

		case "MESSAGE_COMPONENT": {
			break;
		}
	}
});

client.on("messageCreate", async (message) => {
	// Chat xp
	if (
		message.channel.type !== "DM" &&
		!message.author.bot &&
		!message.channel.name.includes("spam") &&
		message.channel.id !== "865997369745080341" /* #tki */
	) {
		const translations = (await new Translations("index_level").init()).data[
			Util.guildConfigs.get(message.guild.id).language
		];

		const bots = await message.guild.members.fetch().catch(console.error);

		if (bots) {
			const prefixes = bots
				.map((bot) => {
					const [, prefix] = bot.displayName.match(/\[(.+)\]/) ?? [];
					return prefix;
				})
				.filter((p) => p);

			if (!prefixes.some((p) => message.content.toLowerCase().startsWith(p))) {
				if (Util.xpMessages.has(message.author.id)) {
					Util.xpMessages.set(
						message.author.id,
						Util.xpMessages.get(message.author.id) + 1,
					);
				} else {
					Util.xpMessages.set(message.author.id, 1);
					setTimeout(() => {
						Util.xpMessages.delete(message.author.id);
					}, 60_000);
				}

				const newXP = Math.round(
					(Math.sqrt(message.content.length) * Util.config.XP_MULTIPLIER) /
						Util.xpMessages.get(message.author.id),
				);

				try {
					const {
						rows: [{ chat_xp: xp }],
					}: { rows: DatabaseLevel[] } = await Util.database.query(
						`
						INSERT INTO level (user_id, chat_xp) VALUES ($1, $2)
						ON CONFLICT (user_id)
						DO UPDATE SET
							chat_xp = level.chat_xp + $2 WHERE level.user_id = $1
						RETURNING level.chat_xp
						`,
						[message.author.id, newXP],
					);

					const levelInfo = getLevel(xp);

					if (
						levelInfo.currentXP < newXP &&
						message.guild.id === Util.config.MAIN_GUILD_ID
					)
						message.channel.send(
							translations.strings.chat_level_up(
								translations.language,
								message.author.toString(),
								levelInfo.level.toString(),
							),
						);
				} catch (err) {
					console.error(err);
				}
			}
		}
	}

	// Message responses
	const language = Util.guildConfigs.get(message.guild?.id)?.language ?? "fr";

	for (const messageResponse of Util.messageResponses) {
		if (messageResponse.noBot && message.author.bot) continue;
		if (messageResponse.noDM && message.channel.type === "DM") continue;
		if (
			messageResponse.guildIds &&
			!messageResponse.guildIds.includes(message.guild?.id)
		)
			continue;

		messageResponse
			.run(message, messageResponse.translations.data[language])
			.catch(console.error);
	}

	// TEMP: Warn users that message commands are deprecated
	const input = message.content.slice(Util.prefix.length).trim().split(/ +/g);
	const messageCommandName = input.shift().toLowerCase();
	const args = parseArgs(input.join(" "));

	const messageCommand =
		Util.messageCommands.get(messageCommandName) ??
		Util.messageCommands.find(
			(cmd) => cmd.aliases && cmd.aliases.includes(messageCommandName),
		);
	if (messageCommand) runMessageCommand(messageCommand, message, args);
});

client.on("messageDelete", async (message) => {
	if (message.partial) return;
	if (message.author.bot) return;

	Util.sniping.deletedMessages.set(
		message.channel.id,
		message as Discord.Message,
	);

	setTimeout(() => {
		Util.sniping.deletedMessages.delete(message.channel.id);
	}, 600_000);
});

client.on("messageUpdate", async (message, newMessage) => {
	if (message.partial) return;
	if (message.author.bot) return;

	Util.sniping.editedMessages.set(
		message.channel.id,
		message as Discord.Message,
	);

	setTimeout(() => {
		Util.sniping.editedMessages.delete(message.channel.id);
	}, 600_000);
});

client.on("messageReactionAdd", async (reaction, user) => {
	try {
		if (reaction.partial) await reaction.fetch();
		if (reaction.message.partial) await reaction.message.fetch();
	} catch (err) {
		console.error(err);
	}

	if (reaction.partial || reaction.message.partial) return;
	if (user.bot) return;
	if (reaction.message.channel.type === "DM") return;

	// Reaction commands
	const language =
		Util.guildConfigs.get(reaction.message.guild?.id)?.language ?? "fr";

	for (const reactionCommand of Util.reactionCommands) {
		reactionCommand
			.run(
				reaction as Discord.MessageReaction,
				user as Discord.User,
				true,
				reactionCommand.translations[language],
			)
			.catch(console.error);
	}
});

client.on("messageReactionRemove", async (reaction, user) => {
	try {
		if (reaction.message.partial) await reaction.message.fetch();
	} catch (err) {
		console.error(err);
	}

	if (reaction.partial || reaction.message.partial) return;
	if (user.bot) return;
	if (reaction.message.channel.type === "DM") return;

	// Reaction commands
	const language =
		Util.guildConfigs.get(reaction.message.guild?.id)?.language ?? "fr";

	for (const reactionCommand of Util.reactionCommands) {
		reactionCommand
			.run(
				reaction as Discord.MessageReaction,
				user as Discord.User,
				false,
				reactionCommand.translations[language],
			)
			.catch(console.error);
	}

	// Sniping
	Util.sniping.messageReactions.set(reaction.message.channel.id, {
		reaction: reaction as Discord.MessageReaction,
		user: user as Discord.User,
	});

	setTimeout(() => {
		Util.sniping.messageReactions.delete(reaction.message.channel.id);
	}, 60_000);
});

client.on("guildCreate", async (guild) => {
	Util.database.query(
		`
		INSERT INTO guild_config VALUES ($1)
		ON CONFLICT (guild_id)
		DO NOTHING
		`,
		[guild.id],
	);
});

client.on("guildMemberAdd", async (member) => {
	if (member.guild.id !== Util.config.MAIN_GUILD_ID) return;
	if (member.user.bot) return;

	let roleIds = [
		"735809874205737020",
		"735810286719598634",
		"735810462872109156",
		"759694957132513300",
	];

	try {
		const {
			rows: [memberRoles],
		} = await Util.database.query(
			"SELECT * FROM member_roles WHERE user_id = $1",
			[member.user.id],
		);

		if (memberRoles) {
			roleIds = roleIds.concat(memberRoles.roles);
		} else {
			member.user
				.send({
					embeds: [
						{
							author: {
								name: member.user.tag,
								iconURL: client.user.displayAvatarURL(),
							},
							thumbnail: {
								url: member.user.displayAvatarURL({
									dynamic: true,
								}),
							},
							title: "Bienvenue sur Mayze !",
							color: member.guild.me.displayColor,
							description: "Amuse-toi bien sur le serveur 😉",
							footer: {
								text: "✨ Mayze ✨",
							},
						},
					],
				})
				.catch(console.error);
		}
	} catch (err) {
		console.error(err);
	}

	member.roles
		.add(roleIds.map((roleId) => member.guild.roles.cache.get(roleId)))
		.catch(console.error);
});

client.on("guildMemberUpdate", async (member, newMember) => {
	if (newMember.guild.id !== Util.config.MAIN_GUILD_ID) return;
	if (newMember.user.bot) return;

	if (!member.roles.cache.equals(newMember.roles.cache)) {
		Util.database
			.query(
				`
			INSERT INTO member_roles VALUES ($1, $2)
			ON CONFLICT (user_id)
			DO UPDATE SET roles = $2
			WHERE member_roles.user_id = EXCLUDED.user_id
			`,
				[
					member.user.id,
					member.roles.cache
						.filter((role) => role.id !== member.guild.id)
						.map((role) => role.id),
				],
			)
			.catch(console.error);
	}
});

client.on("error", async (err) => {
	console.error(err);
});

client.login(process.env.TOKEN);

// Music module
Util.musicPlayer = new MusicPlayer(client);

client.on("voiceStateUpdate", (oldState, newState) => {
	const queue = Util.musicPlayer.get(oldState.guild.id);

	if (queue && oldState.channel.id === queue.voiceChannel.id) {
		setTimeout(() => {
			if (queue.voiceChannel.members.size <= 1) queue.stop();
		}, 900_000);
	}
});

// Util.musicPlayer
// 	.on("clientDisconnect", (message, queue) => {
// 		const language = Util.languages.get(message.guild.id);
// 		const translations = new Translations(__filename, language);

// 		message.channel.send(translations.strings.music_player_disconnect(queue.connection.channel.toString())).catch(console.error);
// 	})

// 	.on("error", (error, message) => {
// 		const language = Util.languages.get(message.guild.id);
// 		const translations = new Translations(__filename, language);

// 		console.error(error);
// 		message.channel.send(translations.strings.music_player_error(error.toString())).catch(console.error);
// 	})

// 	.on("playlistAdd", (message, queue, playlist) => {
// 		const language = Util.languages.get(message.guild.id);
// 		const translations = new Translations(__filename, language);

// 		message.channel.send(translations.strings.music_player_add_playlist(playlist.videoCount.toString())).catch(console.error);
// 	})

// 	.on("queueEnd", (message, queue) => {
// 		const language = Util.languages.get(message.guild.id);
// 		const translations = new Translations(__filename, language);

// 		const songDisplays = Util.songDisplays.filter(songDisplay => songDisplay.guild.id === message.guild.id);
// 		const lastSong = queue.songs[0];

// 		if (!lastSong) return;

// 		songDisplays.forEach(songDisplay => {
// 			songDisplay.edit({
// 				embeds: [
// 					songDisplay.embeds[0]
// 						.setDescription(translations.strings.song_display_description(
// 							lastSong.name.toString(),
// 							lastSong.url.toString(),
// 							MusicUtil.buildBar(MusicUtil.timeToMilliseconds(lastSong.duration),
// 							MusicUtil.timeToMilliseconds(lastSong.duration), 20, "━", "🔘"),
// 							lastSong.requestedBy as string,
// 							"Ø",
// 							"**0:00**"
// 						))
// 						.setFooter(translations.strings.song_display_footer_end(language))
// 				]
// 			}).catch(console.error);
// 		});
// 	})

// 	.on("songAdd", (message, queue, song) => {
// 		const language = Util.languages.get(message.guild.id);
// 		const translations = new Translations(__filename, language);

// 		message.channel.send(translations.strings.music_player_add_song(
// 			(getQueueDuration(queue) ? MusicUtil.millisecondsToTime(MusicUtil.timeToMilliseconds(getQueueDuration(queue)) - MusicUtil.timeToMilliseconds(song.duration)) : 0).toString(),
// 			song.name
// 		)).catch(console.error);
// 	})

// 	.on("songChanged", (message, newSong, OldSong) => {
// 		const language = Util.languages.get(message.guild.id);
// 		const translations = new Translations(__filename, language);

// 		const songDisplays = Util.songDisplays.filter(songDisplay => songDisplay.guild.id === message.guild.id);

// 		songDisplays.forEach(songDisplay => {
// 			songDisplay.edit({
// 				embeds: [
// 					songDisplay.embeds[0]
// 						.setDescription(translations.strings.song_display_description(
// 							newSong.name.toString(),
// 							newSong.url.toString(),
// 							MusicUtil.buildBar(0, MusicUtil.timeToMilliseconds(newSong.duration), 20, "━", "🔘"),
// 							newSong.requestedBy as string,
// 							newSong.queue.repeatMode
// 								? newSong.name.toString()
// 								: (newSong.queue.songs[1]
// 									? newSong.queue.songs[1].name.toString()
// 									: (newSong.queue.repeatQueue ? newSong.queue.songs[0].name.toString() : "Ø")),
// 							newSong.queue.repeatMode || newSong.queue.repeatQueue ? "♾️" : getQueueDuration(newSong.queue).toString()
// 						))
// 						.setFooter(translations.strings.song_display_footer(language,
// 							Boolean(newSong.queue.repeatMode),
// 							Boolean(newSong.queue.repeatQueue)
// 						))
// 				]
// 			}).catch(console.error);
// 		});
// 	})

// 	.on("songFirst", (message, song) => {
// 		const language = Util.languages.get(message.guild.id);
// 		const translations = new Translations(__filename, language);

// 		message.channel.send(translations.strings.music_player_playing(song.name.toString())).catch(console.error);
// 	})

// setInterval(() => {
// 	Util.songDisplays.forEach(songDisplay => {
// 		const language = Util.languages.get(songDisplay.guild.id);
// 		const translations = new Translations(__filename, language);

// 		if (!player.isPlaying(songDisplay)) return Util.songDisplays.delete(songDisplay.channel.id);

// 		const song = player.nowPlaying(songDisplay);

// 		songDisplay.edit({
// 			embeds: [
// 				songDisplay.embeds[0]
// 					.setDescription(translations.strings.song_display_description(
// 						song.name.toString(),
// 						song.url.toString(),
// 						Util.player.createProgressBar(songDisplay, { size: 20, arrow: "🔘", block: "━" }).toString(),
// 						song.requestedBy as string,
// 						song.queue.repeatMode
// 							? song.name.toString()
// 							: (song.queue.songs[1]
// 								? song.queue.songs[1].name.toString()
// 								: (song.queue.repeatQueue ? song.queue.songs[0].name.toString() : "Ø")),
// 						song.queue.repeatMode || song.queue.repeatQueue ? "♾️" : getQueueDuration(song.queue).toString()
// 					))
// 					.setFooter(translations.strings.song_display_footer(language,
// 						Boolean(song.queue.repeatMode),
// 						Boolean(song.queue.repeatQueue)
// 					))
// 			]
// 		}).catch(console.error);
// 	});
// }, 10_000);

// Spotify API
const spotify = new SpotifyWebApi({
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

Util.spotify = spotify;

(function getSpotifyToken() {
	spotify.clientCredentialsGrant().then((data) => {
		spotify.setAccessToken(data.body.access_token);
		// Refresh the token 60s before the current one expires
		setTimeout(getSpotifyToken, (data.body.expires_in - 60) * 1000);
	});
})();

// Predefined reminders
function testReminders() {
	const userIds = [
		"408671348005797898",
		"463358584583880704",
		"608623753399762964",
	];

	const wednesday = new Cron.CronJob(
		"0 45 15 * * 3",
		() => {
			userIds.forEach((userId) =>
				client.users
					.fetch(userId)
					.then((u) => u.send(getMessage(15)).catch(console.error)),
			);
			setTimeout(
				() =>
					userIds.forEach((userId) =>
						client.users.cache
							.get(userId)
							.send(getMessage(5))
							.catch(console.error),
					),
				600_000,
			);
			setTimeout(
				() =>
					userIds.forEach((userId) =>
						client.users.cache
							.get(userId)
							.send(getMessage(2))
							.catch(console.error),
					),
				780_000,
			);
		},
		null,
		true,
		null,
		null,
		false,
		0,
	);

	const sunday = new Cron.CronJob(
		"0 45 13 * * 0",
		() => {
			userIds.forEach((userId) =>
				client.users
					.fetch(userId)
					.then((userId) => userId.send(getMessage(15)).catch(console.error)),
			);
			setTimeout(
				() =>
					userIds.forEach((userId) =>
						client.users.cache
							.get(userId)
							.send(getMessage(5))
							.catch(console.error),
					),
				600_000,
			);
			setTimeout(
				() =>
					userIds.forEach((userId) =>
						client.users.cache
							.get(userId)
							.send(getMessage(2))
							.catch(console.error),
					),
				780_000,
			);
		},
		null,
		true,
		null,
		null,
		false,
		0,
	);

	return { wednesday, sunday };

	function getMessage(minutes: number) {
		return `Test in ${minutes} minute${minutes > 1 ? "s" : ""}! <t:${
			Math.round(Date.now() / 1000) + 60 * minutes
		}:F>\nIn <#463399799807410176>, **Wednesday 6pm CEST and Sunday 4pm CEST**`;
	}
}
