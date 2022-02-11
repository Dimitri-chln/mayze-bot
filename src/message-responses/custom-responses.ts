import MessageResponse from "../types/structures/MessageResponse";
import Util from "../Util";

import {
	DatabaseCustomResponse,
	TriggerType,
} from "../types/structures/Database";
import { TextChannel } from "discord.js";
import parseArgs from "../utils/misc/parseArgs";

const messageResponse: MessageResponse = {
	name: "custom-response",
	noBot: true,
	noDM: true,

	run: async (message, translations) => {
		const customResponseData = {
			user: {
				id: message.author.id,
				username: message.author.username,
				discriminator: message.author.discriminator,
				tag: message.author.tag,
				mention: `<@${message.author.id}>`,
			},
			member: {
				id: message.member.id,
				nickname: message.member.nickname,
				displayName: message.member.displayName,
			},
			channel: {
				id: message.channel.id,
				name: (message.channel as TextChannel).name,
				mention: `<#${message.channel.id}>`,
			},
			guild: {
				id: message.guild.id,
				name: message.guild.name,
			},
			content: message.content,
			args: parseArgs(message.content),
			mentions: {
				users: {
					...message.mentions.users.map((u) => {
						return {
							id: u.id,
							username: u.username,
							discriminator: u.discriminator,
							tag: u.tag,
							mention: `<@${u.id}>`,
						};
					}),
				},
				members: {
					...message.mentions.members.map((m) => {
						return {
							id: m.id,
							nickname: m.nickname,
							displayName: m.displayName,
						};
					}),
				},
				channels: {
					...message.mentions.channels.map((c: TextChannel) => {
						return {
							id: c.id,
							name: c.name,
							mention: `<#${c.id}>`,
						};
					}),
				},
			},
		};

		const { rows: customResponses }: { rows: DatabaseCustomResponse[] } =
			await Util.database.query("SELECT * FROM custom_response");

		customResponses.forEach((customResponse) => {
			switch (customResponse.trigger_type) {
				case TriggerType.CONTAINS: {
					if (message.content.toLowerCase().includes(customResponse.trigger))
						respond(customResponse.response);
					break;
				}

				case TriggerType.EQUAL: {
					if (message.content.toLowerCase() === customResponse.trigger)
						respond(customResponse.response);
					break;
				}

				case TriggerType.REGEX: {
					if (
						new RegExp(customResponse.trigger, "i").test(
							message.content.toLowerCase(),
						)
					)
						respond(customResponse.response);
					break;
				}

				case TriggerType.STARTS_WITH: {
					if (message.content.toLowerCase().startsWith(customResponse.trigger))
						respond(customResponse.response);
					break;
				}

				case TriggerType.ENDS_WITH: {
					if (message.content.toLowerCase().endsWith(customResponse.trigger))
						respond(customResponse.response);
					break;
				}

				default:
					throw new Error("Invalid trigger type");
			}
		});

		async function respond(response: string) {
			message.channel
				.send(
					response.replace(/\{.*?\}/g, (a) =>
						parseMessage(a.replace(/[\{\}]/g, "").split(".")),
					),
				)
				.catch(console.error);
		}

		function parseMessage(
			properties: string[],
			data = customResponseData,
		): string {
			if (properties.length === 1 && typeof data[properties[0]] === "string")
				return data[properties[0]];

			return parseMessage(properties.slice(1), data[properties[0]]);
		}
	},
};

export default messageResponse;
