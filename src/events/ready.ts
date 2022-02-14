import Event from "../types/structures/Event";
import Util from "../Util";

import {
	ChatInputApplicationCommandData,
	Client,
	TextChannel,
} from "discord.js";
import {
	DatabaseCanvas,
	DatabaseColor,
	DatabaseGuildConfig,
	DatabaseLevel,
	DatabaseReminder,
} from "../types/structures/Database";
import Palette from "../types/canvas/Palette";
import Color from "../types/canvas/Color";
import Canvas from "../types/canvas/Canvas";
import Translations from "../types/structures/Translations";
import getLevel from "../utils/misc/getLevel";
import { CronJob } from "cron";

const event: Event = {
	name: "ready",
	once: true,

	run: async (client: Client) => {
		console.log("Connected to Discord");

		Util.client = client;
		Util.beta = client.user.id === Util.config.BETA_CLIENT_ID;

		const logChannel = client.channels.cache.get(Util.config.LOG_CHANNEL_ID);

		(logChannel as TextChannel)
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
			.then((owner) => (Util.owner = owner))
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

		await Promise.all(
			client.guilds.cache
				.filter((g) => !Util.guildConfigs.has(g.id))
				.map(async (guild) => {
					Util.database
						.query("INSERT INTO guild_config VALUES ($1, $2)", [guild.id, "fr"])
						.then(() =>
							Util.guildConfigs.set(guild.id, {
								language: "fr",
							}),
						);
				}),
		);

		// Application commands
		console.log("Fetching global and admin application commands");
		await client.application.commands.fetch();
		await client.guilds.cache.get(Util.config.ADMIN_GUILD_ID).commands.fetch();
		console.log(
			"Fetched all global and admin application commands successfully",
		);

		await Promise.all(
			Util.commands.map(async (command) => {
				const applicationCommandData: ChatInputApplicationCommandData = {
					type: "CHAT_INPUT",
					name: command.name,
					description: command.description.en,
					options: command.options.en,
				};

				if (Util.beta) {
					const guild = client.guilds.cache.get(Util.config.TEST_GUILD_ID);

					applicationCommandData.defaultPermission = false;

					const applicationCommand = guild.commands.cache.find(
						(cmd) => cmd.name === applicationCommandData.name,
					);

					if (!applicationCommand) {
						console.log(
							`Creating the test application command /${applicationCommandData.name}`,
						);
						guild.commands
							.create(applicationCommandData)
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

					if (
						applicationCommand &&
						!applicationCommand.equals(applicationCommandData)
					) {
						console.log(
							`Editing the test application command /${applicationCommandData.name}`,
						);
						guild.commands
							.edit(applicationCommand.id, applicationCommandData)
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
					// Admin commands
					if (command.category === "admin") {
						const guild = client.guilds.cache.get(Util.config.ADMIN_GUILD_ID);

						applicationCommandData.defaultPermission = false;

						const applicationCommand = guild.commands.cache.find(
							(cmd) => cmd.name === applicationCommandData.name,
						);

						if (!applicationCommand) {
							console.log(
								`Creating the admin application command /${applicationCommandData.name}`,
							);
							guild.commands
								.create(applicationCommandData)
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

						if (
							applicationCommand &&
							!applicationCommand.equals(applicationCommandData)
						) {
							console.log(
								`Editing the admin application command /${applicationCommandData.name}`,
							);
							guild.commands
								.edit(applicationCommand.id, applicationCommandData)
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
								const guild = client.guilds.cache.get(guildId);

								applicationCommandData.description =
									command.description[
										Util.guildConfigs.get(guildId).language
									] ?? command.description.en;
								applicationCommandData.options =
									command.options[Util.guildConfigs.get(guildId).language] ??
									command.options.en;

								await guild.commands.fetch();
								const applicationCommand = client.guilds.cache
									.get(guildId)
									.commands.cache.find(
										(cmd) => cmd.name === applicationCommandData.name,
									);

								if (!applicationCommand) {
									console.log(
										`Creating the application command /${applicationCommandData.name} in the guild: ${guildId}`,
									);
									guild.commands
										.create(applicationCommandData)
										.catch(console.error);
								}

								if (
									applicationCommand &&
									!applicationCommand.equals(applicationCommandData)
								) {
									console.log(
										`Editing the application command /${applicationCommandData.name} in the guild: ${guildId}`,
									);
									guild.commands
										.edit(applicationCommand.id, applicationCommandData)
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

				Util.database
					.query("SELECT name FROM canvas WHERE NOT archived")
					.then(({ rows }: { rows: DatabaseCanvas[] }) => {
						for (const row of rows) {
							const canvas = new Canvas(row.name, client, Util.palettes);
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
									[
										new Date(timestamp.valueOf() + reminder.repeat),
										reminder.id,
									],
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
				const translations = (await new Translations("index_level").init())
					.data[Util.guildConfigs.get(guild.id).language];

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
		const userIds = [
			"408671348005797898",
			"463358584583880704",
			"608623753399762964",
		];

		new CronJob(
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

		new CronJob(
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

		function getMessage(minutes: number) {
			return `Test in ${minutes} minute${minutes > 1 ? "s" : ""}! <t:${
				Math.round(Date.now() / 1000) + 60 * minutes
			}:F>\nIn <#463399799807410176>, **Wednesday 6pm CEST and Sunday 4pm CEST**`;
		}

		// Rose lobbies
		const roseChannel = client.channels.cache.get(
			Util.config.ROSE_LOBBY_LOG_CHANNEL_ID,
		);
		const announcementChannel = client.channels.cache.get(
			Util.config.ROSE_LOBBY_ANNOUNCEMENT_CHANNEL_ID,
		);

		(roseChannel as TextChannel).messages
			.fetch({ limit: 1 })
			.then(([[, logMessage]]) => {
				const regex = /^\*\*Starting at:\*\* `(.*)`\n\*\*Password:\*\* `(.*)`$/;

				const [, dateString, password] = logMessage.content.match(regex) ?? [];
				const date = new Date(dateString);
				if (!date || !password) return;

				if (Util.roseLobby) Util.roseLobby.stop();

				Util.roseLobby = new CronJob(date, () => {
					(announcementChannel as TextChannel)
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
	},
};

export default event;
