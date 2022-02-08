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
import reactionCommand from "./types/structures/ReactionCommand";
import Color from "./types/canvas/Color";
import Palette from "./types/canvas/Palette";
import Canvas from "./types/canvas/Canvas";
import runApplicationCommand from "./utils/misc/runApplicationCommand";
import getLevel from "./utils/misc/getLevel";
import MusicPlayer from "./utils/music/MusicPlayer";
import MusicUtil from "./utils/music/MusicUtil";
import { DatabaseColor, DatabaseReminder } from "./types/structures/Database";

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

function newDatabaseClient(): Pg.Client {
	const connectionString = {
		connectionString: process.env.DATABASE_URL,
		ssl: process.env.ENVIRONMENT === "PRODUCTION",
	};

	const database = new Pg.Client(connectionString);

	database.on("error", (err) => {
		console.error(err);
		database.end().catch(console.error);
		newDatabaseClient();
	});

	return database;
}

function reconnectDatabase(database: Pg.Client) {
	database.end().catch(console.error);
	database = newDatabaseClient();
	database
		.connect()
		.then(() => {
			console.log("Connected to the database");
		})
		.catch(console.error);
}

Util.database = newDatabaseClient();

Util.database.connect().then(() => {
	console.log("Connected to the database");

	Util.database.query("SELECT * FROM languages").then((res) => {
		for (const row of res.rows) {
			Util.languages.set(row.guild_id, row.language_code);
		}
	});
});

setInterval(() => reconnectDatabase(Util.database), 3600000);

const directories = Fs.readdirSync(Path.resolve(__dirname, "commands"), {
	withFileTypes: true,
})
	.filter((dirent) => dirent.isDirectory() && dirent.name !== "disabled")
	.map((dirent) => dirent.name);

for (const directory of directories) {
	const commandFiles = Fs.readdirSync(
		Path.resolve(__dirname, "commands", directory),
	).filter((file) => file.endsWith(".js"));

	for (const file of commandFiles) {
		const path = Path.resolve(__dirname, "commands", directory, file);
		const command: Command = require(path).default ?? require(path);
		command.category = directory;
		command.path = path;
		command.cooldowns = new Discord.Collection();
		Util.commands.set(command.name, command);
	}
}

// const messageResponseFiles = Fs.readdirSync(Path.resolve(__dirname, "responses"))
// 	.filter(file => file.endsWith(".js"));

// for (const file of messageResponseFiles) {
// 	const messageResponse: MessageResponse = require(Path.resolve(__dirname, "responses", file));
// 	Util.messageResponses.push(messageResponse);
// }

// const reactionCommandsFiles = Fs.readdirSync(Path.resolve(__dirname, "reaction_commands"))
// 	.filter(file => file.endsWith(".js"));

// for (const file of reactionCommandsFiles) {
// 	const reactionCommand: reactionCommand = require(Path.resolve(__dirname, "reaction_commands", file));
// 	Util.reactionCommands.push(reactionCommand);
// }

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
					color: 65793,
					description: `• **Ping:** \`${client.ws.ping}\``,
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

	console.log("Fetching all global application commands");
	await client.application.commands.fetch();
	console.log("Fetching all admin application commands");
	await client.guilds.cache.get(Util.config.ADMIN_GUILD_ID).commands.fetch();

	// Slash commands
	await Promise.all(
		Util.commands.map(async (command) => {
			const applicationCommandData: Discord.ChatInputApplicationCommandData =
				{
					type: "CHAT_INPUT",
					name: command.name,
					description: command.description.en,
					options: command.options.en,
				};

			// Admin commands
			if (command.category === "admin") {
				const applicationCommand = client.guilds.cache
					.get(Util.config.ADMIN_GUILD_ID)
					.commands.cache.find(
						(cmd) => cmd.name === applicationCommandData.name,
					);

				try {
					let newApplicationCommand: Discord.ApplicationCommand;

					if (
						applicationCommand &&
						!applicationCommand.equals(applicationCommandData)
					) {
						console.log(
							`Editing the admin application command /${applicationCommandData.name}`,
						);
						newApplicationCommand =
							await client.application.commands.edit(
								applicationCommand.id,
								applicationCommandData,
								Util.config.ADMIN_GUILD_ID,
							);
						newApplicationCommand.permissions.set({
							permissions: [
								{
									id: applicationCommand.guild.id,
									type: "ROLE",
									permission: false,
								},
								{
									id: Util.config.OWNER_ID,
									type: "USER",
									permission: true,
								},
							],
						});
					} else if (!applicationCommand) {
						console.log(
							`Creating the admin application command /${applicationCommandData.name}`,
						);
						newApplicationCommand =
							await client.application.commands.create(
								applicationCommandData,
								Util.config.ADMIN_GUILD_ID,
							);
						newApplicationCommand.permissions.set({
							permissions: [
								{
									id: applicationCommand.guild.id,
									type: "ROLE",
									permission: false,
								},
								{
									id: Util.config.OWNER_ID,
									type: "USER",
									permission: true,
								},
							],
						});
					}
				} catch (err) {
					console.error();
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
								(cmd) =>
									cmd.name === applicationCommandData.name,
							);

						if (
							applicationCommand &&
							!applicationCommand.equals(applicationCommandData)
						) {
							console.log(
								`Editing the application command /${applicationCommandData.name} in the guild: ${guildId}`,
							);
							applicationCommandData.description =
								command.description[
									Util.languages.get(guildId)
								] ?? command.description.en;
							applicationCommandData.options =
								command.options[Util.languages.get(guildId)] ??
								command.options.en;
							client.application.commands
								.edit(
									applicationCommand.id,
									applicationCommandData,
									guildId,
								)
								.catch(console.error);
						} else if (!applicationCommand) {
							console.log(
								`Creating the application command /${applicationCommandData.name} in the guild: ${guildId}`,
							);
							applicationCommandData.description =
								command.description[
									Util.languages.get(guildId)
								] ?? command.description.en;
							applicationCommandData.options =
								command.options[Util.languages.get(guildId)] ??
								command.options.en;
							client.application.commands
								.create(applicationCommandData, guildId)
								.catch(console.error);
						}
					}

					// Global commands
				} else {
					const applicationCommand =
						client.application.commands.cache.find(
							(cmd) => cmd.name === applicationCommandData.name,
						);

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
					} else if (!applicationCommand) {
						console.log(
							`Creating the global application command /${applicationCommandData.name}`,
						);
						client.application.commands
							.create(applicationCommandData)
							.catch(console.error);
					}
				}
			}
		}),
	).catch(console.error);

	// Canvas
	const { emojis } = client.guilds.cache.get(Util.config.CANVAS_GUILD_ID);

	Util.database
		.query("SELECT * FROM colors")
		.then(async ({ rows: colors }: { rows: DatabaseColor[] }) => {
			for (const color of colors) {
				let emoji = emojis.cache.find(
					(e) => e.name === `pl_${color.alias}`,
				);

				if (!emoji) {
					let red = Math.floor(color.code / (256 * 256));
					let green = Math.floor((color.code % (256 * 256)) / 256);
					let blue = color.code % 256;
					let hex =
						red.toString(16).padStart(2, "0") +
						green.toString(16).padStart(2, "0") +
						blue.toString(16).padStart(2, "0");
					emoji = await emojis.create(
						`https://dummyimage.com/256/${hex}?text=+`,
						`pl_${color.alias}`,
					);
				}

				if (!Util.palettes.has(color.palette))
					Util.palettes.set(
						color.palette,
						new Palette(color.palette),
					);

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
			const regex =
				/^\*\*Starting at:\*\* `(.*)`\n\*\*Password:\*\* `(.*)`$/;

			const [, dateString, password] =
				logMessage.content.match(regex) ?? [];
			const date = new Date(dateString);
			if (!date || !password) return;

			if (Util.roseLobby) Util.roseLobby.stop();

			Util.roseLobby = new Cron.CronJob(date, () => {
				(announcementChannel as Discord.TextChannel)
					.send(
						`<@&${Util.config.ROSE_LOBBY_ROLE_ID}>\nLa game de roses va démarrer, le mot de passe est \`${password}\``,
					)
					.catch(console.error);
				logMessage
					.edit(`~~${logMessage.content}~~`)
					.catch(console.error);
			});

			Util.roseLobby.start();

			console.log(
				`Restarted rose lobby at ${date.toUTCString()} with password ${password}`,
			);
		})
		.catch(console.error);

	// Reminders
	setInterval(async () => {
		try {
			const { rows: reminders }: { rows: DatabaseReminder[] } =
				await Util.database.query("SELECT * FROM reminders");

			reminders.forEach(async (reminder) => {
				const timestamp = new Date(reminder.timestamp).valueOf();

				if (Date.now() > timestamp) {
					client.users
						.fetch(reminder.user_id)
						.then((user) => {
							user.send(`⏰ | ${reminder.content}`).catch(
								console.error,
							);
						})
						.catch(console.error);

					Util.database
						.query("DELETE FROM reminders WHERE id = $1", [
							reminder.id,
						])
						.catch(console.error);
				}
			});
		} catch (err) {
			console.error(err);
		}
	}, 10000);

	// Voice xp
	setInterval(() => {
		client.guilds.cache.forEach(async (guild) => {
			const translations = await new Translations(
				"index_levels",
				Util.languages.get(guild.id),
			).init();

			guild.members.cache
				.filter((m) => m.voice.channelId && !m.user.bot)
				.forEach(async (member) => {
					if (member.voice.channel.members.size < 2) return;

					let newXp =
						Util.config.BASE_VOICE_XP *
						member.voice.channel.members.filter((m) => !m.user.bot)
							.size;

					if (member.voice.deaf) newXp *= 0;
					if (member.voice.mute) newXp *= 0.5;
					if (
						member.voice.streaming &&
						member.voice.channel.members.filter((m) => !m.user.bot)
							.size > 1
					)
						newXp *= 3;
					if (
						member.voice.selfVideo &&
						member.voice.channel.members.filter((m) => !m.user.bot)
							.size > 1
					)
						newXp *= 5;

					try {
						const {
							rows: [{ voice_xp: xp }],
						} = await Util.database.query(
							`
						INSERT INTO levels (user_id, voice_xp) VALUES ($1, $2)
						ON CONFLICT (user_id)
						DO UPDATE SET
							voice_xp = levels.voice_xp + $2 WHERE levels.user_id = $1
						RETURNING levels.voice_xp
						`,
							[member.user.id, newXp],
						);

						const levelInfo = getLevel(xp);

						if (
							levelInfo.currentXP < newXp &&
							member.guild.id === Util.config.MAIN_GUILD_ID
						)
							member.user.send(
								translations.data.voice_level_up(
									translations.language,
									levelInfo.level.toString(),
								),
							);
					} catch (err) {
						console.error(err);
					}
				});
		});
	}, 60000);
});

client.on("interactionCreate", async (interaction) => {
	switch (interaction.type) {
		case "PING": {
			break;
		}

		case "APPLICATION_COMMAND": {
			if (interaction.isCommand()) {
				interaction.deferReply();

				const command = Util.commands.get(interaction.commandName);
				if (command)
					runApplicationCommand(command, interaction).catch(
						console.error,
					);
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
	if (Util.beta) return;

	const translations = await new Translations(
		"index_levels",
		Util.languages.get(message.guild.id),
	).init();

	// Chat xp
	if (
		message.channel.type !== "DM" &&
		!message.author.bot &&
		!message.channel.name.includes("spam") &&
		message.channel.id !== "865997369745080341" // #tki
	) {
		const bots = await message.guild.members.fetch().catch(console.error);

		if (bots) {
			const prefixes = bots
				.map((bot) => {
					const [, prefix] = bot.displayName.match(/\[(.+)\]/) ?? [];
					return prefix;
				})
				.filter((p) => p);

			if (
				!prefixes.some((p) =>
					message.content.toLowerCase().startsWith(p),
				)
			) {
				if (!Util.xpMessages.has(message.author.id)) {
					Util.xpMessages.set(message.author.id, 0);
					setTimeout(() => {
						Util.xpMessages.delete(message.author.id);
					}, 60000);
				}

				const newXP = Math.round(
					(Math.sqrt(message.content.length) *
						Util.config.XP_MULTIPLIER) /
						Util.xpMessages.get(message.author.id),
				);

				Util.xpMessages.set(
					message.author.id,
					Util.xpMessages.get(message.author.id) + 1,
				);

				try {
					const {
						rows: [{ chat_xp: xp }],
					} = await Util.database.query(
						`
						INSERT INTO levels (user_id, chat_xp) VALUES ($1, $2)
						ON CONFLICT (user_id)
						DO UPDATE SET
							chat_xp = levels.chat_xp + $2 WHERE levels.user_id = $1
						RETURNING levels.chat_xp
						`,
						[message.author.id, newXP],
					);

					const levelInfo = getLevel(xp);

					if (
						levelInfo.currentXP < newXP &&
						message.guild.id === Util.config.MAIN_GUILD_ID
					)
						message.channel.send(
							translations.data.chat_level_up(
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
	Util.messageResponses.forEach(async (messageResponse) =>
		messageResponse.run(message).catch(console.error),
	);
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
	}, 600000);
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
	}, 600000);
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

	for (const reactionCommand of Util.reactionCommands) {
		reactionCommand
			.run(
				reaction as Discord.MessageReaction,
				user as Discord.User,
				true,
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

	for (const reactionCommand of Util.reactionCommands) {
		reactionCommand
			.run(
				reaction as Discord.MessageReaction,
				user as Discord.User,
				false,
			)
			.catch(console.error);
	}

	Util.sniping.messageReactions.set(reaction.message.channel.id, {
		reaction: reaction as Discord.MessageReaction,
		user: user as Discord.User,
	});

	setTimeout(() => {
		Util.sniping.messageReactions.delete(reaction.message.channel.id);
	}, 60000);
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

// 		message.channel.send(translations.data.music_player_disconnect(queue.connection.channel.toString())).catch(console.error);
// 	})

// 	.on("error", (error, message) => {
// 		const language = Util.languages.get(message.guild.id);
// 		const translations = new Translations(__filename, language);

// 		console.error(error);
// 		message.channel.send(translations.data.music_player_error(error.toString())).catch(console.error);
// 	})

// 	.on("playlistAdd", (message, queue, playlist) => {
// 		const language = Util.languages.get(message.guild.id);
// 		const translations = new Translations(__filename, language);

// 		message.channel.send(translations.data.music_player_add_playlist(playlist.videoCount.toString())).catch(console.error);
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
// 						.setDescription(translations.data.song_display_description(
// 							lastSong.name.toString(),
// 							lastSong.url.toString(),
// 							MusicUtil.buildBar(MusicUtil.timeToMilliseconds(lastSong.duration),
// 							MusicUtil.timeToMilliseconds(lastSong.duration), 20, "━", "🔘"),
// 							lastSong.requestedBy as string,
// 							"Ø",
// 							"**0:00**"
// 						))
// 						.setFooter(translations.data.song_display_footer_end(language))
// 				]
// 			}).catch(console.error);
// 		});
// 	})

// 	.on("songAdd", (message, queue, song) => {
// 		const language = Util.languages.get(message.guild.id);
// 		const translations = new Translations(__filename, language);

// 		message.channel.send(translations.data.music_player_add_song(
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
// 						.setDescription(translations.data.song_display_description(
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
// 						.setFooter(translations.data.song_display_footer(language,
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

// 		message.channel.send(translations.data.music_player_playing(song.name.toString())).catch(console.error);
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
// 					.setDescription(translations.data.song_display_description(
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
// 					.setFooter(translations.data.song_display_footer(language,
// 						Boolean(song.queue.repeatMode),
// 						Boolean(song.queue.repeatQueue)
// 					))
// 			]
// 		}).catch(console.error);
// 	});
// }, 10000);

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
				600000,
			);
			setTimeout(
				() =>
					userIds.forEach((userId) =>
						client.users.cache
							.get(userId)
							.send(getMessage(2))
							.catch(console.error),
					),
				780000,
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
					.then((userId) =>
						userId.send(getMessage(15)).catch(console.error),
					),
			);
			setTimeout(
				() =>
					userIds.forEach((userId) =>
						client.users.cache
							.get(userId)
							.send(getMessage(5))
							.catch(console.error),
					),
				600000,
			);
			setTimeout(
				() =>
					userIds.forEach((userId) =>
						client.users.cache
							.get(userId)
							.send(getMessage(2))
							.catch(console.error),
					),
				780000,
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

// import pokedex from "oakdex-pokedex";
// import legendaries from "./assets/legendaries.json";
// import beasts from "./assets/ultra-beasts.json";

// const pokemons = pokedex.allPokemon()
// 	.map(p => {
// 		return {
// 			names: {
// 				en: p.names.en,
// 				fr: p.names.fr
// 			},
// 			national_id: p.national_id,
// 			types: p.types,
// 			abilities: p.abilities,
// 			gender_ratios: p.gender_ratios,
// 			catch_rate: p.catch_rate,
// 			height_eu: p.height_eu,
// 			height_us: p.height_us,
// 			weight_eu: p.weight_eu,
// 			weight_us: p.weight_us,
// 			color: p.color,
// 			base_stats: p.base_stats,
// 			evolution_from: p.evolution_from,
// 			evolutions: p.evolutions.map(evo => evo.to),
// 			mega_evolutions: p.mega_evolutions.map(mega_evolution => {
// 				return {
// 					suffix: mega_evolution.image_suffix ?? "mega",
// 					types: mega_evolution.types,
// 					ability: mega_evolution.ability,
// 					mega_stone: mega_evolution.mega_stone,
// 					height_eu: mega_evolution.height_eu,
// 					height_us: mega_evolution.height_us,
// 					weight_eu: mega_evolution.weight_eu,
// 					weight_us: mega_evolution.weight_us,
// 					base_stats: mega_evolution.base_stats
// 				}
// 			}),
// 			variations: p.variations.map(variation => {
// 				return {
// 					suffix: variation.image_suffix,
// 					names: variation.names,
// 					types: variation.types,
// 					abilities: variation.abilities
// 				}
// 			}),
// 			legendary: legendaries.includes(p.names.en),
// 			ultra_beast: beasts.includes(p.names.en)
// 		}
// 	})
// 	.sort((a, b) => a.national_id - b.national_id);

// Fs.writeFileSync(
// 	Path.resolve(__dirname, "assets", "pokemons.json"),
// 	JSON.stringify(pokemons, null, 4)
// );
