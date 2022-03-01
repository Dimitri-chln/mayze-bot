import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import {
	ButtonInteraction,
	CollectorFilter,
	TextChannel,
	User,
} from "discord.js";
import Pokemon, {
	MegaEvolution,
	PokemonVariation,
} from "../../types/pokemon/Pokemon";
import { DatabasePokemon } from "../../types/structures/Database";
import { Variation, VariationType } from "../../utils/pokemon/pokemonInfo";

const command: Command = {
	name: "trade",
	aliases: [],
	description: {
		fr: "Echanger des pokémons avec d'autres utilisateurs",
		en: "Trade pokémons with other users",
	},
	usage: "",
	userPermissions: [],
	botPermissions: ["EMBED_LINKS"],

	options: {
		fr: [
			{
				name: "start",
				description: "Commencer un échange avec un autre utilisateur",
				type: "SUB_COMMAND",
				options: [
					{
						name: "user",
						description: "L'utilisateur avec qui échanger",
						type: "USER",
						required: true,
					},
					{
						name: "offer",
						description: "Les pokémons à offrir",
						type: "STRING",
						required: false,
					},
					{
						name: "demand",
						description: "Les pokémons à demander",
						type: "STRING",
						required: false,
					},
				],
			},
			{
				name: "block",
				description:
					"Bloquer un utilisateur pour l'empêcher d'échanger avec toi",
				type: "SUB_COMMAND",
				options: [
					{
						name: "user",
						description: "L'utilisateur à bloquer",
						type: "USER",
						required: true,
					},
				],
			},
			{
				name: "unblock",
				description: "Débloquer un utilisateur",
				type: "SUB_COMMAND",
				options: [
					{
						name: "user",
						description: "L'utilisateur à débloquer",
						type: "USER",
						required: true,
					},
				],
			},
		],
		en: [
			{
				name: "start",
				description: "Start a trade with another user",
				type: "SUB_COMMAND",
				options: [
					{
						name: "user",
						description: "The user to trade with",
						type: "USER",
						required: true,
					},
					{
						name: "offer",
						description: "The pokémons to offer",
						type: "STRING",
						required: false,
					},
					{
						name: "demand",
						description: "The pokémons to ask for",
						type: "STRING",
						required: false,
					},
				],
			},
			{
				name: "block",
				description: "Block a user to prevent them from trading with you",
				type: "SUB_COMMAND",
				options: [
					{
						name: "user",
						description: "The user to block",
						type: "USER",
						required: true,
					},
				],
			},
			{
				name: "unblock",
				description: "Unblock a user",
				type: "SUB_COMMAND",
				options: [
					{
						name: "user",
						description: "The user to unblock",
						type: "USER",
						required: true,
					},
				],
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const logChannel = interaction.client.channels.cache.get(
			Util.config.TRADE_LOG_CHANNEL_ID,
		) as TextChannel;

		const subCommand = interaction.options.getSubcommand();

		const user = interaction.options.getUser("user", true);
		if (user.id === interaction.user.id)
			return interaction.followUp(translations.strings.same_user());

		switch (subCommand) {
			case "block": {
				Util.database.query(
					`
					INSERT INTO trade_block (user_id, blocked_user_id) VALUES ($1, $2)
					ON CONFLICT (user_id, blocked_user_id)
					DO NOTHING
					`,
					[interaction.user.id, user.id],
				);

				interaction.followUp(translations.strings.blocked(user.tag));
				break;
			}

			case "unblock": {
				Util.database.query(
					"DELETE FROM trade_block WHERE user_id = $1 AND blocked_user_id = $2",
					[interaction.user.id, user.id],
				);

				interaction.followUp(translations.strings.unblocked(user.tag));
				break;
			}

			case "start": {
				const {
					rows: [blocked],
				} = await Util.database.query(
					"SELECT * FROM trade_block WHERE user_id = $1 AND blocked_user_id = $2",
					[user.id, interaction.user.id],
				);

				if (blocked)
					return interaction.followUp(
						translations.strings.not_allowed(user.tag),
					);

				let errors = "";

				const offer: OfferOrDemand[] =
					interaction.options
						.getString("offer")
						?.split(/, */)
						?.map((input): OfferOrDemand => {
							const number = parseInt((input.match(/^(\d+) */) ?? [])[1]) || 1;
							const { pokemon, shiny, pokemonVariation } =
								Util.pokedex.findByNameWithVariation(
									input.replace(/^(\d+) */, ""),
								) ?? {};

							if (pokemon)
								return {
									data: pokemon,
									number,
									shiny: shiny,
									pokemonVariation: pokemonVariation,
								};
							else
								errors += translations.strings.invalid_pokemon(
									input.replace(/^(\d+) */, ""),
								);
						})
						?.filter((p) => p)
						// Filter duplicates
						?.filter(
							(p, i, a) =>
								i ===
								a.findIndex(
									(v) =>
										p.data.nationalId === v.data.nationalId &&
										p.shiny === v.shiny &&
										p.pokemonVariation?.variationType ===
											v.pokemonVariation?.variationType &&
										p.pokemonVariation?.variation ===
											v.pokemonVariation?.variation,
								),
						) ?? [];

				const demand: OfferOrDemand[] =
					interaction.options
						.getString("demand")
						?.split(/, */)
						?.map((input) => {
							const number = parseInt((input.match(/^(\d+) */) ?? [])[1]) || 1;
							const { pokemon, shiny, pokemonVariation } =
								Util.pokedex.findByNameWithVariation(
									input.replace(/^(\d+) */, ""),
								) ?? {};

							if (pokemon)
								return {
									data: pokemon,
									number,
									shiny: shiny,
									pokemonVariation: pokemonVariation,
								};
							else
								errors += translations.strings.invalid_pokemon(
									input.replace(/^(\d+) */, ""),
								);
						})
						?.filter((p) => p)
						// Filter duplicates
						?.filter(
							(p, i, a) =>
								i ===
								a.findIndex(
									(v) =>
										p.data.nationalId === v.data.nationalId &&
										p.shiny === v.shiny &&
										p.pokemonVariation?.variationType ===
											v.pokemonVariation?.variationType &&
										p.pokemonVariation?.variation ===
											v.pokemonVariation?.variation,
								),
						) ?? [];

				if ((!offer || !offer.length) && (!demand || !demand.length))
					return interaction.followUp(translations.strings.empty_trade());

				if (errors) return interaction.followUp(errors);

				errors = await checkValidPokemons(
					interaction.user,
					offer,
					user,
					demand,
				);

				if (errors) return interaction.followUp(errors);

				const trade = (await interaction.followUp({
					content: user.toString(),
					embeds: [
						{
							author: {
								name: translations.strings.author(
									interaction.user.tag,
									user.tag,
								),
								iconURL: interaction.user.displayAvatarURL({
									dynamic: true,
								}),
							},
							color: interaction.guild.me.displayColor,
							// U+00d7 : ×
							fields: [
								{
									name: translations.strings.offer(
										interaction.user.username,
										false,
									),
									value: `\`\`\`\n${
										offer.length
											? offer
													.map(
														(pkm) =>
															`\u00d7${pkm.number} ${pkm.data.formatName(
																translations.language,
																pkm.shiny,
																pkm.pokemonVariation?.variationType,
																pkm.pokemonVariation?.variation,
															)}`,
													)
													.join("\n")
											: "Ø"
									}\n\`\`\``,
									inline: true,
								},
								{
									name: translations.strings.demand(user.username, false),
									value: `\`\`\`\n${
										demand.length
											? demand
													.map(
														(pkm) =>
															`\u00d7${pkm.number} ${pkm.data.formatName(
																translations.language,
																pkm.shiny,
																pkm.pokemonVariation?.variationType,
																pkm.pokemonVariation?.variation,
															)}`,
													)
													.join("\n")
											: "Ø"
									}\n\`\`\``,
									inline: true,
								},
							],
							footer: {
								text: `✨ Mayze ✨ | ${translations.strings.footer()}`,
							},
						},
					],
					components: [
						{
							type: "ACTION_ROW",
							components: [
								{
									type: "BUTTON",
									customId: "accept",
									emoji: Util.config.EMOJIS.check.data,
									style: "SUCCESS",
								},
								{
									type: "BUTTON",
									customId: "deny",
									emoji: Util.config.EMOJIS.cross.data,
									style: "DANGER",
								},
							],
						},
					],
					fetchReply: true,
				})) as Message;

				const filter: CollectorFilter<[ButtonInteraction]> = (
					buttonInteraction,
				) =>
					buttonInteraction.user.id === interaction.user.id ||
					buttonInteraction.user.id === user.id;

				const collector = trade.createMessageComponentCollector({
					filter,
					componentType: "BUTTON",
					time: 120_000,
				});

				let cancelledBy: User;
				let accepted = [false, false];

				collector.on("collect", async (buttonInteraction) => {
					switch (buttonInteraction.customId) {
						case "deny": {
							cancelledBy = buttonInteraction.user;

							await buttonInteraction.update({
								content: trade.content,
								embeds: [
									{
										author: {
											name: translations.strings.author(
												interaction.user.tag,
												user.tag,
											),
											iconURL: interaction.user.displayAvatarURL({
												dynamic: true,
											}),
										},
										color: interaction.guild.me.displayColor,
										// U+00d7 : ×
										fields: [
											{
												name: translations.strings.offer(
													interaction.user.username,
													accepted[0],
												),
												value: `\`\`\`\n${
													offer.length
														? offer
																.map(
																	(pkm) =>
																		`\u00d7${pkm.number} ${pkm.data.formatName(
																			translations.language,
																			pkm.shiny,
																			pkm.pokemonVariation?.variationType,
																			pkm.pokemonVariation?.variation,
																		)}`,
																)
																.join("\n")
														: "Ø"
												}\n\`\`\``,
												inline: true,
											},
											{
												name: translations.strings.demand(
													user.username,
													accepted[1],
												),
												value: `\`\`\`\n${
													demand.length
														? demand
																.map(
																	(pkm) =>
																		`\u00d7${pkm.number} ${pkm.data.formatName(
																			translations.language,
																			pkm.shiny,
																			pkm.pokemonVariation?.variationType,
																			pkm.pokemonVariation?.variation,
																		)}`,
																)
																.join("\n")
														: "Ø"
												}\n\`\`\``,
												inline: true,
											},
										],
										footer: {
											text: `✨ Mayze ✨ | ${translations.strings.footer()}`,
										},
									},
								],
								components: trade.components,
							});

							collector.stop();
							break;
						}

						case "accept": {
							const index =
								buttonInteraction.user.id === interaction.user.id ? 0 : 1;
							accepted[index] = true;

							await buttonInteraction.update({
								content: trade.content,
								embeds: [
									{
										author: {
											name: translations.strings.author(
												interaction.user.tag,
												user.tag,
											),
											iconURL: interaction.user.displayAvatarURL({
												dynamic: true,
											}),
										},
										color: interaction.guild.me.displayColor,
										// U+00d7 : ×
										fields: [
											{
												name: translations.strings.offer(
													interaction.user.username,
													accepted[0],
												),
												value: `\`\`\`\n${
													offer.length
														? offer
																.map(
																	(pkm) =>
																		`\u00d7${pkm.number} ${pkm.data.formatName(
																			translations.language,
																			pkm.shiny,
																			pkm.pokemonVariation?.variationType,
																			pkm.pokemonVariation?.variation,
																		)}`,
																)
																.join("\n")
														: "Ø"
												}\n\`\`\``,
												inline: true,
											},
											{
												name: translations.strings.demand(
													user.username,
													accepted[1],
												),
												value: `\`\`\`\n${
													demand.length
														? demand
																.map(
																	(pkm) =>
																		`\u00d7${pkm.number} ${pkm.data.formatName(
																			translations.language,
																			pkm.shiny,
																			pkm.pokemonVariation?.variationType,
																			pkm.pokemonVariation?.variation,
																		)}`,
																)
																.join("\n")
														: "Ø"
												}\n\`\`\``,
												inline: true,
											},
										],
										footer: {
											text: `✨ Mayze ✨ | ${translations.strings.footer()}`,
										},
									},
								],
								components: trade.components,
							});

							if (accepted.every((v) => v)) collector.stop();
							break;
						}
					}
				});

				collector.once("end", async (collected, reason) => {
					if (reason !== "messageDelete")
						trade.edit({
							content: trade.content,
							embeds: trade.embeds,
							components: [
								{
									type: "ACTION_ROW",
									components: [
										{
											type: "BUTTON",
											customId: "accept",
											emoji: Util.config.EMOJIS.check.data,
											style: "SUCCESS",
											disabled: true,
										},
										{
											type: "BUTTON",
											customId: "deny",
											emoji: Util.config.EMOJIS.cross.data,
											style: "DANGER",
											disabled: true,
										},
									],
								},
							],
						});

					if (!accepted.every((v) => v)) {
						interaction.followUp(
							translations.strings.cancelled(cancelledBy?.username),
						);
						return;
					}

					const errorsNew = await checkValidPokemons(
						interaction.user,
						offer,
						user,
						demand,
					);

					if (errorsNew) {
						interaction.followUp(errorsNew);
						return;
					}

					const offerSuccess: [boolean, boolean][] = [];
					for (const pkm of offer) {
						const defaultUserData = {
							caught: pkm.number,
							favorite: false,
							nickname: null,
						};
						const s: [boolean, boolean] = [false, false];

						Util.database
							.query(
								`
								UPDATE pokemon
								SET users =
									CASE
										WHEN (users -> $1 -> 'caught')::int = $2 THEN users - $1
										ELSE jsonb_set(users, '{${interaction.user.id}, caught}', ((users -> $1 -> 'caught')::int - $2)::text::jsonb)
									END
								WHERE national_id = $3 AND shiny = $4 AND variation_type = $5 AND variation = $6
								`,
								[
									interaction.user.id,
									pkm.number,
									pkm.data.nationalId,
									pkm.shiny,
									pkm.pokemonVariation?.variationType ?? "default",
									pkm.pokemonVariation?.variation ?? "default",
								],
							)
							.then(() => (s[0] = true))
							.catch((err) => {
								console.error(err);
							});

						Util.database
							.query(
								`
								UPDATE pokemon
								SET users =
									CASE
										WHEN users -> $1 IS NULL THEN jsonb_set(users, '{${user.id}}', $3)
										ELSE jsonb_set(users, '{${user.id}, caught}', ((users -> $1 -> 'caught')::int + $2)::text::jsonb)
									END
								WHERE national_id = $4 AND shiny = $5 AND variation_type = $6 AND variation = $7
								`,
								[
									user.id,
									pkm.number,
									defaultUserData,
									pkm.data.nationalId,
									pkm.shiny,
									pkm.pokemonVariation?.variationType ?? "default",
									pkm.pokemonVariation?.variation ?? "default",
								],
							)
							.then(() => (s[1] = true))
							.catch((err) => {
								console.error(err);
							});

						offerSuccess.push(s);
					}

					const demandSuccess: [boolean, boolean][] = [];
					for (const pkm of demand) {
						const defaultUserData = {
							caught: pkm.number,
							favorite: false,
							nickname: null,
						};
						const s: [boolean, boolean] = [false, false];

						Util.database
							.query(
								`
								UPDATE pokemon
								SET users =
									CASE
										WHEN (users -> $1 -> 'caught')::int = $2 THEN users - $1
										ELSE jsonb_set(users, '{${user.id}, caught}', ((users -> $1 -> 'caught')::int - $2)::text::jsonb)
									END
								WHERE national_id = $3 AND shiny = $4 AND variation_type = $5 AND variation = $6
								`,
								[
									user.id,
									pkm.number,
									pkm.data.nationalId,
									pkm.shiny,
									pkm.pokemonVariation?.variationType ?? "default",
									pkm.pokemonVariation?.variation ?? "default",
								],
							)
							.then(() => (s[0] = true))
							.catch((err) => {
								console.error(err);
							});

						Util.database
							.query(
								`
								UPDATE pokemon
								SET users =
									CASE
										WHEN users -> $1 IS NULL THEN jsonb_set(users, '{${interaction.user.id}}', $3)
										ELSE jsonb_set(users, '{${interaction.user.id}, caught}', ((users -> $1 -> 'caught')::int + $2)::text::jsonb)
									END
								WHERE national_id = $4 AND shiny = $5 AND variation_type = $6 AND variation = $7
								`,
								[
									interaction.user.id,
									pkm.number,
									defaultUserData,
									pkm.data.nationalId,
									pkm.shiny,
									pkm.pokemonVariation?.variationType ?? "default",
									pkm.pokemonVariation?.variation ?? "default",
								],
							)
							.then(() => (s[1] = true))
							.catch((err) => {
								console.error(err);
							});

						demandSuccess.push(s);
					}

					// Dummy request to await all other ones
					await Util.database
						.query("SELECT national_id FROM pokemon WHERE national_id = 0")
						.catch(console.error);

					logChannel
						.send({
							embeds: [
								{
									author: {
										name: `${interaction.user.tag} / ${user.tag}`,
										url: trade.url,
										iconURL: interaction.guild.iconURL({
											dynamic: true,
										}),
									},
									color: Util.config.MAIN_COLOR,
									// U+00d7 : ×
									fields: [
										{
											name: "Offer:",
											value: `\`\`\`\n${
												offer.length
													? offer
															.map(
																(pkm, i) =>
																	`\u00d7${pkm.number} ${pkm.data.formatName(
																		translations.language,
																		pkm.shiny,
																		pkm.pokemonVariation?.variationType,
																		pkm.pokemonVariation?.variation,
																	)} - ${offerSuccess[i]
																		.map((s) => (s ? "✅" : "❌"))
																		.join(" ")}`,
															)
															.join("\n")
													: "Ø"
											}\n\`\`\``,
											inline: true,
										},
										{
											name: "Demand:",
											value: `\`\`\`\n${
												demand.length
													? demand
															.map(
																(pkm, i) =>
																	`\u00d7${pkm.number} ${pkm.data.formatName(
																		translations.language,
																		pkm.shiny,
																		pkm.pokemonVariation?.variationType,
																		pkm.pokemonVariation?.variation,
																	)} - ${demandSuccess[i]
																		.map((s) => (s ? "✅" : "❌"))
																		.join(" ")}`,
															)
															.join("\n")
													: "Ø"
											}\n\`\`\``,
											inline: true,
										},
									],
									footer: {
										text: "✨ Mayze ✨",
									},
								},
							],
						})
						.catch(console.error);

					interaction.followUp(translations.strings.trade_complete());
				});
				break;
			}
		}

		async function checkValidPokemons(
			user1: User,
			pokemons1: OfferOrDemand[],
			user2: User,
			pokemons2: OfferOrDemand[],
		) {
			const { rows: user1Pokemons }: { rows: DatabasePokemon[] } =
				await Util.database.query("SELECT * FROM pokemon WHERE users ? $1", [
					user1.id,
				]);

			const { rows: user2Pokemons }: { rows: DatabasePokemon[] } =
				await Util.database.query("SELECT * FROM pokemon WHERE users ? $1", [
					user2.id,
				]);

			const errors1 = [],
				errors2 = [],
				errors1fav = [],
				errors2fav = [];

			for (const pokemon of pokemons1) {
				const pkm = user1Pokemons.find(
					(p) =>
						p.national_id === pokemon.data.nationalId &&
						p.shiny === pokemon.shiny &&
						p.variation_type ===
							(pokemon.pokemonVariation?.variationType ?? "default") &&
						p.variation === (pokemon.pokemonVariation?.variation ?? "default"),
				);
				if (!pkm || pokemon.number > pkm.users[user1.id].caught)
					errors1.push(
						`**${
							pkm
								? (pokemon.number - pkm.users[user1.id].caught).toString()
								: pokemon.number.toString()
						} ${pokemon.data.formatName(
							translations.language,
							pokemon.shiny,
							pokemon.pokemonVariation?.variationType,
							pokemon.pokemonVariation?.variation,
						)}**`,
					);
				if (pkm && pkm.users[user1.id].favorite)
					errors1fav.push(
						`**${pokemon.data.formatName(
							translations.language,
							pokemon.shiny,
							pokemon.pokemonVariation?.variationType,
							pokemon.pokemonVariation?.variation,
						)}**`,
					);
			}

			for (const pokemon of pokemons2) {
				const pkm = user2Pokemons.find(
					(p) =>
						p.national_id === pokemon.data.nationalId &&
						p.shiny === pokemon.shiny &&
						p.variation_type ===
							(pokemon.pokemonVariation?.variationType ?? "default") &&
						p.variation === (pokemon.pokemonVariation?.variation ?? "default"),
				);
				if (!pkm || pokemon.number > pkm.users[user2.id].caught)
					errors2.push(
						`**${
							pkm
								? (pokemon.number - pkm.users[user2.id].caught).toString()
								: pokemon.number.toString()
						} ${pokemon.data.formatName(
							translations.language,
							pokemon.shiny,
							pokemon.pokemonVariation?.variationType,
							pokemon.pokemonVariation?.variation,
						)}**`,
					);
				if (pkm && pkm.users[user2.id].favorite)
					errors2fav.push(
						`**${pokemon.data.formatName(
							translations.language,
							pokemon.shiny,
							pokemon.pokemonVariation?.variationType,
							pokemon.pokemonVariation?.variation,
						)}**`,
					);
			}

			return (
				(errors1.length
					? translations.strings.not_enough(user1.username, errors1.join(", "))
					: "") +
				(errors2.length
					? translations.strings.not_enough(user2.username, errors2.join(", "))
					: "") +
				(errors1fav.length
					? translations.strings.favorite(
							user1.username,
							errors1fav.join(", "),
							errors1fav.length > 1,
					  )
					: "") +
				(errors2fav.length
					? translations.strings.favorite(
							user2.username,
							errors2fav.join(", "),
							errors2fav.length > 1,
					  )
					: "")
			);
		}
	},
};

export default command;

interface OfferOrDemand {
	data: Pokemon;
	number: number;
	shiny: boolean;
	pokemonVariation: PokemonVariation | MegaEvolution;
}
