import {
	ButtonInteraction,
	Collection,
	CollectorFilter,
	Guild,
	GuildMember,
	Message,
	Role,
	SelectMenuInteraction,
	TextChannel,
	User,
} from "discord.js";
import Player from "./Player";
import selectPlayer from "../../utils/werewolf/selectPlayer";
import composition from "../../assets/werewolf-composition.json";
import Translations, { Language, LanguageTranslationsData } from "../structures/Translations";
import PlayerList from "./PlayerList";
import Util from "../../Util";
import { sleep } from "../../utils/misc/sleep";

export default class Game {
	readonly guild: Guild;
	readonly config: GameConfig;
	readonly language: Language;
	readonly players: PlayerList;
	private readonly _members: Collection<string, GuildMember>;
	night: number;
	day: number;
	ended: boolean;
	private _translations: LanguageTranslationsData;

	constructor(guild: Guild, config: GameConfig, language: Language = "fr", members: Collection<string, GuildMember>) {
		this.guild = guild;
		this.config = config;
		this.language = language;
		this.players = new PlayerList();
		this._members = members;
		this.night = 0;
		this.day = 0;
		this.ended = false;
	}

	async init() {
		this._translations = (await new Translations("ww_game").init()).data[this.language];
		return this;
	}

	async start() {
		this.config.villageChannel
			.send({
				content: this._translations.strings.started_content(this.config.ingameRole.toString()),
				embeds: [
					{
						author: {
							name: this._translations.strings.started_title(),
							iconURL: this.guild.client.user.displayAvatarURL(),
						},
						description: this.players.all.map((player, i) => `\`${i + 1}.\` ${player.role}`).join("\n"),
						color: this.guild.me.displayColor,
						footer: {
							text: "🐺 Mayze 🐺",
						},
					},
				],
			})
			.catch(console.error);

		const setup = composition.setup[this._members.size];
		const werewolves = composition.werewolfRoles[this.language].sort(() => Math.random() - 0.5);
		const villagers = composition.villagerRoles[this.language].sort(() => Math.random() - 0.5);
		let index = 0;

		while (this._members.size) {
			const member = this._members.random();

			let role: string;

			if (index < setup.werewolves) {
				// First players are werewolf
				role = werewolves[index] ?? composition.werewolfRoles[this.language][0];
				await member.roles.add(this.config.werewolvesRole).catch(console.error);
			} else if (index === setup.werewolves) {
				// One (and only one) seer is in each game
				role = composition.roles.seer[this.language];
				await member.roles.add(this.config.villageRole).catch(console.error);
			} else {
				// Other players are villagers
				role = villagers[index] ?? composition.villagerRoles[this.language][0];
				await member.roles.add(this.config.villageRole).catch(console.error);
			}

			// Add a specific permission overwrite for Shaman
			if (role === composition.roles.shaman[this.language]) {
				this.config.deadChannel.permissionOverwrites.create(member.user, { VIEW_CHANNEL: true }).catch(console.error);
			}

			this.players.add(new Player(member, role, this));
			await member.user.send(this._translations.strings.welcome(role)).catch(console.error);
			this._members.delete(member.user.id);
		}

		this.startNight();
	}

	selectPlayer(
		recipient: TextChannel | User,
		allowed: Player[],
		players: Player[],
		embedTitle: string,
		number: number = 1,
		timeout: number = 30_000,
	): Promise<Player[]> {
		return selectPlayer(this, recipient, allowed, players, embedTitle, number, timeout);
	}

	kill(player: Player) {
		if (!player) return [];

		player.alive = false;

		if (player.role === composition.roles.shaman[this.language])
			this.config.deadChannel.permissionOverwrites.cache.get(player.member.user.id).delete().catch(console.error);

		const deadRole = this.guild.roles.cache.find((role) => role.name === player.role);

		if (deadRole) player.member.roles.add(deadRole).catch(console.error);
		player.member.roles.remove(this.config.villageRole).catch(console.error);
		player.member.roles.remove(this.config.werewolvesRole).catch(console.error);

		const dead = [player];

		// Kill the player's lover
		if (player.couple && player.couple.alive) dead.push(...this.kill(player.couple));

		// Kill the avenger's target
		if (player.avenge && player.avenge.alive) dead.push(...this.kill(player.avenge));

		return dead;
	}

	async startNight() {
		if (this.night === 0) this.players.shuffle();
		this.night++;

		this.config.villageChannel.permissionOverwrites
			.edit(this.config.ingameRole, { SEND_MESSAGES: false })
			.catch(console.error);

		this.config.werewolvesChannel.permissionOverwrites
			.edit(this.config.werewolvesRole, { SEND_MESSAGES: null })
			.catch(console.error);

		this.config.villageChannel
			.send({
				embeds: [
					{
						title: this._translations.strings.night_start(this.night.toString()),
						color: this.guild.me.displayColor,
						footer: {
							text: "🐺 Mayze 🐺",
						},
					},
				],
			})
			.catch(console.error);

		setTimeout(() => {
			if (!this.ended) this.startDay();
		}, 60_000);

		const filter: CollectorFilter<[Message]> = (message) => !message.author.bot;

		const messageCollector = this.config.werewolvesChannel.createMessageCollector({
			filter: filter,
		});

		const littleGirl = this.players.all.find((player) => player.role === composition.roles.little_girl[this.language]);

		if (littleGirl) {
			messageCollector.on("collect", async (message) => {
				littleGirl.member.send(`- ${message.content}`).catch(console.error);
			});
		}

		this.players.alive.forEach(async (player) => {
			player.night(this.players.selectListFor(player), this.night).catch(console.error);
		});

		const [attackedPlayer] = await this.selectPlayer(
			this.config.werewolvesChannel,
			this.players.alive.filter((player) => player.team === "WEREWOLVES"),
			this.players.alive.filter((player) => player.team !== "WEREWOLVES"),
			this._translations.strings.werewolves_title(),
			1,
			60_000,
		);

		const witch = this.players.all.find(
			(player) => player.role === composition.roles.witch[this.language] && player.alive,
		);

		if (attackedPlayer) {
			attackedPlayer.attacked = true;

			this.config.werewolvesChannel
				.send(this._translations.strings.werewolves_answer(attackedPlayer.member.user.tag))
				.catch(console.error);

			if (witch) {
				if (witch.potion) {
					const message = await witch.member.user
						.send({
							embeds: [
								{
									title: this._translations.strings.witch_title(attackedPlayer.member.user.tag),
									color: this.guild.me.displayColor,
									description: this._translations.strings.witch_description(),
									footer: {
										text: "🐺 Mayze 🐺",
									},
								},
							],
							components: [
								{
									type: "ACTION_ROW",
									components: [
										{
											type: "BUTTON",
											customId: "confirm",
											emoji: Util.config.EMOJIS.check.data,
											style: "SUCCESS",
										},
										{
											type: "BUTTON",
											customId: "cancel",
											emoji: Util.config.EMOJIS.cross.data,
											style: "DANGER",
										},
									],
								},
							],
						})
						.catch(console.error);

					if (message) {
						const filter: CollectorFilter<[ButtonInteraction]> = (buttonInteraction) =>
							buttonInteraction.user.id === witch.member.user.id;

						try {
							const collected = await message.awaitMessageComponent({
								filter: filter,
								time: 30_000,
							});

							switch (collected.customId) {
								case "confirm": {
									attackedPlayer.attacked = false;
									witch.potion = false;

									collected
										.update({
											embeds: [
												{
													title: this._translations.strings.witch_title(attackedPlayer.member.user.tag),
													color: this.guild.me.displayColor,
													description: this._translations.strings.witch_saved(),
													footer: {
														text: "🐺 Mayze 🐺",
													},
												},
											],
											components: [
												{
													type: "ACTION_ROW",
													components: [
														{
															type: "BUTTON",
															customId: "confirm",
															emoji: Util.config.EMOJIS.check.data,
															style: "SUCCESS",
															disabled: true,
														},
														{
															type: "BUTTON",
															customId: "cancel",
															emoji: Util.config.EMOJIS.cross.data,
															style: "DANGER",
															disabled: true,
														},
													],
												},
											],
										})
										.catch(console.error);
									break;
								}

								case "cancel": {
									collected
										.update({
											embeds: [
												{
													title: this._translations.strings.witch_title(attackedPlayer.member.user.tag),
													color: this.guild.me.displayColor,
													description: this._translations.strings.witch_not_saved(),
													footer: {
														text: "🐺 Mayze 🐺",
													},
												},
											],
											components: [
												{
													type: "ACTION_ROW",
													components: [
														{
															type: "BUTTON",
															customId: "confirm",
															emoji: Util.config.EMOJIS.check.data,
															style: "SUCCESS",
															disabled: true,
														},
														{
															type: "BUTTON",
															customId: "cancel",
															emoji: Util.config.EMOJIS.cross.data,
															style: "DANGER",
															disabled: true,
														},
													],
												},
											],
										})
										.catch(console.error);
									break;
								}
							}
						} catch (err) {
							console.error(err);
						}
					}
				} else {
					witch.member.user
						.send({
							embeds: [
								{
									title: this._translations.strings.witch_title(attackedPlayer.member.user.tag),
									color: this.guild.me.displayColor,
									description: this._translations.strings.witch_cant_save(),
									footer: {
										text: "🐺 Mayze 🐺",
									},
								},
							],
						})
						.catch(console.error);
				}
			}
		} else {
			if (witch) {
				witch.member.user.send(this._translations.strings.witch_no_attack()).catch(console.error);
			}
		}
	}

	async startDay() {
		this.day++;

		this.config.villageChannel.permissionOverwrites
			.edit(this.config.ingameRole, { SEND_MESSAGES: null })
			.catch(console.error);

		this.config.werewolvesChannel.permissionOverwrites
			.edit(this.config.werewolvesRole, { SEND_MESSAGES: false })
			.catch(console.error);

		const attackedPlayer = this.players.attacked;
		const deadPlayers = this.kill(attackedPlayer);

		this.config.villageChannel
			.send({
				content: this.config.ingameRole.toString(),
				embeds: [
					{
						title: this._translations.strings.day_start(this.day.toString()),
						color: this.guild.me.displayColor,
						description: deadPlayers.length
							? this._translations.strings.dead_players(
									deadPlayers
										.map((player) => this._translations.strings.dead_player_line(player.member.user.tag, player.role))
										.join("\n"),
							  )
							: this._translations.strings.no_dead(),

						footer: {
							text: "🐺 Mayze 🐺",
						},
					},
				],
			})
			.catch(console.error);

		if (this.ended) return;
		if (!this.endCheck()) setTimeout(() => this.startVote(), 90_000);
	}

	async startVote() {
		const message = await this.config.villageChannel
			.send({
				content: this.config.ingameRole.toString(),
				embeds: [
					{
						title: this._translations.strings.vote_start(),
						color: this.guild.me.displayColor,
						description: this.players.alive
							.map((player, i) => `\`${i + 1}.\` **${player.member.user.tag}**`)
							.join("\n"),
						footer: {
							text: "🐺 Mayze 🐺",
						},
					},
				],
				components: [
					{
						type: "ACTION_ROW",
						components: [
							{
								type: "SELECT_MENU",
								customId: "player",
								placeholder: this._translations.strings.placeholder(),
								options: this.players.alive.map((player) => {
									return {
										label: player.member.user.tag,
										value: player.member.user.id,
									};
								}),
							},
						],
					},
				],
			})
			.catch(console.error);

		if (message) {
			const votes: { [K: string]: string } = {};

			const selectMenuFilter: CollectorFilter<[SelectMenuInteraction]> = (selectMenuInteraction) =>
				this.players.alive.some((player) => selectMenuInteraction.user.id === player.member.user.id);

			const selectMenuCollector = message.createMessageComponentCollector({
				componentType: "SELECT_MENU",
				filter: selectMenuFilter,
				time: 30_000,
			});

			selectMenuCollector.on("collect", (selectMenuInteraction) => {
				votes[selectMenuInteraction.user.id] = selectMenuInteraction.values[0];

				selectMenuInteraction.reply({
					content: this._translations.strings.voted(
						this.players.alive.find((player) => selectMenuInteraction.values[0] === player.member.id).member.user.tag,
					),
					ephemeral: true,
				});
			});

			selectMenuCollector.once("end", async () => {
				if (this.ended) return;

				message.edit({
					content: this.config.ingameRole.toString(),
					embeds: [
						{
							title: this._translations.strings.vote_start(),
							color: this.guild.me.displayColor,
							description: this.players.alive
								.map((player, i) => `\`${i + 1}.\` **${player.member.user.tag}**`)
								.join("\n"),
							footer: {
								text: "🐺 Mayze 🐺",
							},
						},
					],
					components: [
						{
							type: "ACTION_ROW",
							components: [
								{
									type: "SELECT_MENU",
									customId: "player",
									placeholder: this._translations.strings.placeholder(),
									options: this.players.alive.map((player) => {
										return {
											label: player.member.user.tag,
											value: player.member.user.id,
										};
									}),
									disabled: true,
								},
							],
						},
					],
				});

				const results: { [K: string]: number } = this.players.alive.reduce((res, player) => {
					res[player.member.user.id] = Object.values(votes).filter((vote) => player.member.user.id === vote).length;

					return res;
				}, {});

				this.config.villageChannel
					.send({
						embeds: [
							{
								title: this._translations.strings.vote_result(),
								color: this.guild.me.displayColor,
								description: this.players.alive
									.map((player, i) =>
										this._translations.strings.vote_result_line(
											(i + 1).toString(),
											player.member.user.tag,
											results[player.member.user.id].toString(),
											results[player.member.user.id] > 1,
										),
									)
									.join("\n"),
								footer: {
									text: "🐺 Mayze 🐺",
								},
							},
						],
					})
					.catch(console.error);

				const max = Math.max(...Object.values(results));

				const maxPlayers = this.players.alive.filter((player) => results[player.member.user.id] === max);

				await sleep(3_000);

				if (maxPlayers.length > 1) {
					this.config.villageChannel.send(this._translations.strings.no_lynched()).catch(console.error);
				} else {
					const lynched = maxPlayers[0];
					const deadPlayers = this.kill(lynched);

					await this.config.villageChannel
						.send(this._translations.strings.lynched(lynched.member.user.tag, lynched.role))
						.catch(console.error);

					if (lynched.role === composition.roles.angel[this.language]) {
						this.config.villageChannel.send(this._translations.strings.angel_win()).catch(console.error);
						this.end();
						return;
					}

					this.config.villageChannel
						.send({
							embeds: [
								{
									title: this._translations.strings.dead_votes(),
									color: this.guild.me.displayColor,
									description: deadPlayers
										.map((player) => this._translations.strings.dead_player_line(player.member.user.tag, player.role))
										.join("\n"),
									footer: {
										text: "🐺 Mayze 🐺",
									},
								},
							],
						})
						.catch(console.error);

					if (this.ended) return;
					if (!this.endCheck()) setTimeout(() => this.startNight(), 3_000);
				}
			});
		}
	}

	endCheck() {
		if (this.players.alive.every((player) => player.couple || player.role === composition.roles.cupid[this.language])) {
			this.config.villageChannel.send(this._translations.strings.couple_win()).catch(console.error);
			return this.end();
		}

		if (this.players.werewolves.length >= this.players.villagers.length) {
			this.config.villageChannel.send(this._translations.strings.werewolves_win()).catch(console.error);
			return this.end();
		}

		if (this.players.werewolves.length === 0) {
			this.config.villageChannel.send(this._translations.strings.village_win()).catch(console.error);
			return this.end();
		}

		return false;
	}

	end() {
		this.ended = true;

		this.config.villageChannel.permissionOverwrites
			.edit(this.config.ingameRole, { SEND_MESSAGES: null })
			.catch(console.error);

		this.config.werewolvesChannel.permissionOverwrites
			.edit(this.config.werewolvesRole, { SEND_MESSAGES: false })
			.catch(console.error);

		this.players.all.forEach(async (player) => {
			const deadRole = this.guild.roles.cache.find((role) => role.name === player.role);

			if (deadRole) await player.member.roles.remove(deadRole).catch(console.error);
			await player.member.roles.remove(this.config.villageRole).catch(console.error);
			await player.member.roles.remove(this.config.werewolvesRole).catch(console.error);

			if (player.role === composition.roles.shaman[this.language] && player.alive) {
				this.config.deadChannel.permissionOverwrites.cache.get(player.member.user.id).delete().catch(console.error);
			}
		});

		this.config.villageChannel
			.send({
				embeds: [
					{
						title: this._translations.strings.game_end(),
						color: this.guild.me.displayColor,
						description: this.players.all
							.map((player) =>
								player.alive
									? `${player.member.user.username} - ${player.role}`
									: `~~${player.member.user.username} - ${player.role}~~`,
							)
							.join("\n"),
						footer: {
							text: "🐺 Mayze 🐺",
						},
					},
				],
			})
			.catch(console.error);

		return this.ended;
	}
}

interface GameConfig {
	ingameRole: Role;
	villageRole: Role;
	werewolvesRole: Role;
	villageChannel: TextChannel;
	werewolvesChannel: TextChannel;
	deadChannel: TextChannel;
}
