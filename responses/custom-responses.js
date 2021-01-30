const { Message } = require("discord.js");

const command = {
	/**
	 * @param {Message} message 
	 */
	execute: async (message) => {
		const trigger_types = {
			0: "MATCH",
			1: "EXACT_MATCH",
			2: "REGEX",
			3: "STARTS_WITH",
			4: "ENDS_WITH"
		}

		const { "rows": responses } = await message.client.pg.query("SELECT * FROM responses").catch(console.error);
		if (!responses) return;

		responses.forEach(response => {
			switch(trigger_types[response.trigger_type]) {
				case "MATCH":
					if (message.content.toLowerCase().includes(response.trigger)) respond(response);
					break;
				case "EXACT_MATCH":
					if (message.content.toLowerCase() === response.trigger) respond(response);
					break;
				case "REGEX":
					if (new RegExp(response.trigger, "i").test(message.content.toLowerCase())) respond(response);
					break;
				case "STARTS_WITH":
					if (message.content.toLowerCase().startsWith(response.trigger)) respond(response);
					break;
				case "ENDS_WITH":
					if (message.content.toLowerCase().endsWith(response.trigger)) respond(response);
					break;
				default:
					throw new Error("Invalid trigger type");
			}
		});

		async function respond(response) {
			const objects = {
				user: {
					id: message.author.id,
					username: message.author.username,
					discriminator: message.author.discriminator,
					tag: message.author.tag,
					mention: `<@${message.author.id}>`
				},
				member: {
					id: message.member.id,
					nickname: message.member.nickname
				},
				channel: {
					id: message.channel.id,
					name: message.channel.name,
					mention: `<#${message.channel.id}>`
				},
				guild: {
					id: message.guild.id,
					name: message.guild.name
				},
				args: { ...message.content.split(" ") },
				mentions: {
					users: {
						...message.mentions.users.map(u => {
							return { id: u.id, username: u.username, discriminator: u.discriminator, tag: u.tag, mention: `<@${u.id}>` };
						})
					},
					members: {
						...message.mentions.members.map(m => {
							return { id: m.id, nickname: m.nickname };
						})
					},
					channels: {
						...message.mentions.channels.map(c => {
							return { id: c.id, name: c.name, mention: `<#${c.id}>` };
						})
					}
				}
			}

			message.channel.send(response.response.replace(/\{.*\}/g, a => parseObject(a.replace(/[\{\}]/g, ""), objects))).catch(console.error);
		}

		/**
		 * @param {string} string 
		 */
		function parseObject(string, objects = {}) {
			const properties = string.split(".");
			if (properties.length === 1) return objects[properties[0]];
			return parseObject(properties.slice(1).join("."), objects[properties[0]]);
		}
	}
};

module.exports = command;