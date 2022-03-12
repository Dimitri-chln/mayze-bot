import { GuildMember } from "discord.js";
import composition from "../../assets/werewolf-composition.json";
import Game from "./Game";
import Translations from "../structures/Translations";

export default class Player {
	readonly member: GuildMember;
	readonly role: string;
	readonly team: "VILLAGE" | "WEREWOLVES";
	readonly game: Game;
	alive: boolean;

	attacked: boolean;
	couple?: Player;
	/**
	 * For avenger only
	 */
	avenge?: Player;
	/**
	 * For witch only
	 */
	potion?: boolean;

	constructor(member: GuildMember, role: string, game: Game) {
		this.member = member;
		this.role = role;
		this.team = composition.villagerRoles[game.language].includes(role) ? "VILLAGE" : "WEREWOLVES";
		this.game = game;
		this.alive = true;

		this.attacked = false;
		this.couple = null;
		this.avenge = null;
		this.potion = role === composition.roles.witch[game.language] ? true : null;
	}

	async night(players: Player[], night: number) {
		const translations = (await new Translations("ww_player").init()).data[this.game.language];

		switch (this.role) {
			// Werewolf
			case composition.roles.werewolf[this.game.language]: {
				break;
			}

			// Seer
			case composition.roles.seer[this.game.language]: {
				const [selectedPlayer] = await this.game.selectPlayer(
					this.member.user,
					[this],
					players,
					translations.strings.seer_title(),
				);

				if (!selectedPlayer) return this.member.user.send(translations.strings.too_late());

				this.member.user
					.send(translations.strings.seer_answer(selectedPlayer.member.user.tag, selectedPlayer.role))
					.catch(console.error);

				break;
			}

			// Witch
			case composition.roles.witch[this.game.language]: {
				this.member.user.send(translations.strings.witch_message()).catch(console.error);
				break;
			}

			// Cupid
			case composition.roles.cupid[this.game.language]: {
				if (night > 1) return;

				const selectedPlayers = await this.game.selectPlayer(
					this.member.user,
					[this],
					players,
					translations.strings.cupid_title(),
					2,
				);

				if (!selectedPlayers) return this.member.user.send(translations.strings.too_late());

				selectedPlayers[0].couple = selectedPlayers[1];
				selectedPlayers[1].couple = selectedPlayers[0];

				this.member.user
					.send(
						translations.strings.cupid_answer(selectedPlayers[0].member.user.tag, selectedPlayers[1].member.user.tag),
					)
					.catch(console.error);

				selectedPlayers[0].member.user
					.send(translations.strings.cupid_lovers(selectedPlayers[1].member.user.tag, selectedPlayers[1].role))
					.catch(console.error);

				selectedPlayers[1].member.user
					.send(translations.strings.cupid_lovers(selectedPlayers[0].member.user.tag, selectedPlayers[0].role))
					.catch(console.error);
				break;
			}

			case composition.roles.avenger[this.game.language]: {
				const [selectedPlayer] = await this.game.selectPlayer(
					this.member.user,
					[this],
					players,
					translations.strings.avenger_title(),
				);

				if (!selectedPlayer) return this.member.user.send(translations.strings.too_late());

				this.avenge = selectedPlayer;

				this.member.user.send(translations.strings.avenger_answer(selectedPlayer.member.user.tag)).catch(console.error);
				break;
			}

			case composition.roles.little_girl[this.game.language]: {
				this.member.user
					.send({
						embeds: [
							{
								title: translations.strings.little_girl_title(),
								color: this.game.guild.me.displayColor,
								description: translations.strings.little_girl_description(),
								footer: {
									text: "🐺 Mayze 🐺",
								},
							},
						],
					})
					.catch(console.error);
				break;
			}

			default: {
				this.member.user
					.send({
						embeds: [
							{
								title: translations.strings.default_title(),
								color: this.game.guild.me.displayColor,
								description: translations.strings.default_description(),
								footer: {
									text: "🐺 Mayze 🐺",
								},
							},
						],
					})
					.catch(console.error);
			}
		}
	}
}
