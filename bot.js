const Fs = require("fs");
const Axios = require("axios").default;
const Path = require("path");
const Cron = require("cron");
const config = require("./config.json");
require('dotenv').config();
const languages = require("./assets/languages");
const chatXP = require("./utils/chatXP");
const voiceXP = require("./utils/voiceXP");

require("./utils/prototypes");

const Discord = require("discord.js");
const intents = new Discord.Intents([ Discord.Intents.NON_PRIVILEGED, "GUILD_MEMBERS", "GUILD_PRESENCES" ]);
const client = new Discord.Client({ presence: { activity: { name: "le meilleur clan", type: "WATCHING" } }, fetchAllMembers: true, partials: ["MESSAGE", "CHANNEL", "REACTION"] , ws: { intents }});

// if (process.env.HOST !== "HEROKU") {
// 	const shellExec = require("./utils/shellExec");
// 	const output = shellExec("heroku pg:credentials:url --app mayze-bot");
// 	const connectionURLregex = /postgres:\/\/(\w+):(\w+)@(.*):(\d+)\/(\w+)/;
// 	const [ connectionURL, user, password, host, port, database ] = output.match(connectionURLregex);
// 	process.env.DATABASE_URL = connectionURL;
// }

const pg = require("pg");
client.pg = newPgClient();

client.pg.connect().then(() => {
	console.log("Connected to the database");

	client.languages = new Discord.Collection();
	client.pg.query(`SELECT * FROM languages`).then(res => {
		for (const row of res.rows) {
			client.languages.set(row.guild_id, row.language_code);
		}
	});
});

setInterval(reconnectPgClient, 3600000);

const imageFiles = Fs.readdirSync("./discord-images");
for (const imageFile of imageFiles) {
	if (imageFile !== "file.txt")
		Fs.unlinkSync(`./discord-images/${imageFile}`, () => {});
}

client.commands = new Discord.Collection();
const commandFiles = Fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}
const musicCommandFiles = Fs.readdirSync("./music_commands").filter(file => file.endsWith(".js"));
for (const file of musicCommandFiles) {
	const command = require(`./music_commands/${file}`);
	client.commands.set(command.name, { ...command, category: "music" });
}

client.responses = [];
const autoresponseFiles = Fs.readdirSync("./responses").filter(file => file.endsWith(".js"));
for (const file of autoresponseFiles) {
	const autoresponse = require(`./responses/${file}`);
	client.responses.push(autoresponse);
}

client.reactionCommands = [];
const reactionCommandsFiles = Fs.readdirSync("./reaction_commands").filter(file => file.endsWith(".js"));
for (const file of reactionCommandsFiles) {
	const reactionCommand = require(`./reaction_commands/${file}`);
	client.reactionCommands.push(reactionCommand);
}

client.componentCommands = new Discord.Collection();
const componentCommandsFiles = Fs.readdirSync("./components").filter(file => file.endsWith(".js"));
for (const file of componentCommandsFiles) {
	const componentCommand = require(`./components/${file}`);
	client.componentCommands.set(componentCommand.name, componentCommand);
}

client.cooldowns = new Discord.Collection();
client.queues = new Discord.Collection();



client.on("ready", async () => {
	console.log("Connected to Discord");
	if (client.user.id === "740848584882126939") client.beta = true;

	client.user.setPresence({ activity: { name: "le meilleur clan", type: "WATCHING" } }).catch(console.error);

	const { version } = require ("./package.json");
	const logChannel = client.channels.cache.get(config.LOG_CHANNEL_ID);
	try {
		const msg = await logChannel.send({
			embed: {
				author: {
					name: "Démarrage du bot...",
					icon_url: client.user.avatarURL()
				},
				color: 65793,
				description: `• **Version:** \`${version}\`\n• **Ping:** Calcul...`,
				footer: {
					text: "✨ Mayze ✨"
				},
				timestamp: Date.now()
			}
		});
		const embed = msg.embeds[0];
		const editedMsg = await msg.edit(embed);
		msg.edit(embed.setDescription(`• **Version:** \`${version}\`\n• **Ping:** \`${Math.abs(editedMsg.editedTimestamp - editedMsg.createdTimestamp)}ms\``));
	} catch (err) { console.error(err); }

	client.users.fetch(config.OWNER_ID).then(owner => client.owner = owner).catch(console.error);

	// PREFIX
	const mayze = client.users.cache.get("703161067982946334");
	client.prefix = client.beta
		? mayze.presence.status === "offline" ? config.PREFIX : config.PREFIX_BETA
		: config.PREFIX;

	// CANVAS
	const Canvas = require("./utils/canvas/Canvas");
	const Palette = require("./utils/canvas/Palette");
	const { emojis } = client.guilds.cache.get("842836119757914173");

	client.pg.query("SELECT * FROM colors").then(async res => {
		/**@type Discord.Collection<string, Palette> */
		const palettes = new Discord.Collection();

		for (let color of res.rows) {
			let emote = emojis.cache.find(e => e.name === `pl_${color.alias}`);
			if (!emote) {
				let red = Math.floor(color.code / (256 * 256));
				let green = Math.floor((color.code % (256 * 256)) / 256);
				let blue = color.code % 256;
				let hex = red.toString(16).replace(/^(.)$/, "0$1") + green.toString(16).replace(/^(.)$/, "0$1") + blue.toString(16).replace(/^(.)$/, "0$1");
				emote = await emojis.create(`https://dummyimage.com/100/${hex}?text=+`, `pl_${color.alias}`).catch(console.error);
			}

			if (palettes.has(color.palette)) {
				palettes.get(color.palette).add(color.name, color.alias, color.code, emote);
			} else {
				let palette = new Palette(color.palette);
				palette.add(color.name, color.alias, color.code, emote);
				palettes.set(color.palette, palette);
			}
		}

		emojis.cache.forEach(e => {
			if (!res.rows.some(c => e.name === `pl_${c.alias}`)) e.delete().catch(console.error);
		});

		client.palettes = palettes;
		client.boards = new Discord.Collection();

		client.pg.query("SELECT * FROM canvas").then(res => {
			for (let board of res.rows) {
				const canvas = new Canvas(board.name, client, palettes);
				client.boards.set(board.name, canvas);
			}
		});
	});

	if (client.beta) return;

	// SLASH COMMANDS
	const slashGuilds = [ "724530039781326869", "672516066756395031", "689164798264606784", "544545798256590848" ];
	client.slashCommands = new Discord.Collection();
	for (const guildID of slashGuilds) client.slashCommands.set(guildID, new Discord.Collection());

	await Promise.all(slashGuilds.map(async guildID => {
		const { "rows": slashData } = (await client.pg.query(`SELECT * FROM slash_commands WHERE guild_id = '${guildID}'`).catch(console.error)) || {};

		client.commands.forEach(async command => {
			if (command.disableSlash || command.ownerOnly) return;
			if (command.onlyInGuilds && !command.onlyInGuilds.includes(guildID)) return;

			const slashOptions = { name: command.name, description: command.description.en || command.description };
			if (command.slashOptions) slashOptions.options = command.slashOptions;

			const oldSlashCommand = slashData.find(slash => slash.name === command.name);
			if (oldSlashCommand && !slashChanged(oldSlashCommand, slashOptions)) return;

			const slashCommand = await client.api.applications(client.user.id).guilds(guildID).commands.post({ data: slashOptions }).catch(console.error);
			if (!slashCommand) return;

			client.slashCommands.get(guildID).set(slashCommand.name, slashCommand);

			if (slashData.some(slash => slash.name === command.name)) client.pg.query(`UPDATE slash_commands SET id = '${slashCommand.id}', data = '${JSON.stringify(slashCommand).replace(/'/g, "''")}' WHERE name = '${slashCommand.name}' AND guild_id = '${guildID}'`).catch(console.error);
			else client.pg.query(`INSERT INTO slash_commands VALUES ('${slashCommand.id}', '${guildID}', '${slashCommand.name}', '${JSON.stringify(slashCommand).replace(/'/g, "''")}')`).catch(console.error);
		});
	})).catch(console.error);

	console.log("Slash commands created");

	// GIVEAWAYS
	client.giveawayTimers = new Discord.Collection();
	const giveawayChannel = client.channels.cache.get(config.GIVEAWAY_CHANNEL_ID);
	const updateGwaMsg = require("./utils/updateGwaMsg");

	giveawayChannel.messages.fetch({ limit: 100 }).then(async messages => {
		messages = messages.filter(msg => msg.author.id === client.user.id && msg.embeds.length && msg.embeds[0].author.name.startsWith("Giveaway de") && !msg.embeds[0].description.startsWith("Giveaway terminé !"));

		for (const [ id, message ] of messages) {
			if (message.partial) await message.fetch();
			const timer = setInterval(() => updateGwaMsg(message), 10000);
			client.giveawayTimers.set(id, timer);
			console.log(`Restarted giveaway with ID: ${parseInt(id.slice(12)).toString(36).toUpperCase()}`);
		}
	}).catch(console.error);

	// PREDEFINED REMINDERS
		// ACNHReminders();
	testReminders();

	// ROSE LOBBY
	/**@type {Discord.TextChannel} */
	const roseChannel = client.channels.cache.get("856901268445069322");
	roseChannel.messages.fetch({ limit: 1 })
		.then(messages => {
			if (!messages) return;
			const message = messages.first();
			if (!message) return;
			
			const regex = /^\*\*Starting at:\*\* `(.*)`\n\*\*Password:\*\* `(.*)`$/;
			const [ , dateString, password ] = message.content.match(regex) || [];
			const date = new Date(dateString);
			if (!date || !password) return;

			const announcementChannel = client.channels.cache.get("817365433509740554");
			if (client.roseTimer) client.roseTimer.stop();
			client.roseTimer = new Cron.CronJob(date, () => {
				announcementChannel.send(`<@&833620668066693140>\nLa game de roses va démarrer, le mot de passe est \`${password}\``).catch(console.error);
				message.edit(`~~${message.content}~~`).catch(console.error);
			});
			client.roseTimer.start();
			console.log(`Restarted rose lobby at ${date.toUTCString()} with password ${password}`);
		})
		.catch(console.error);

	// REMINDERS, BLOCKS AND MUTES
	setInterval(async () => {
		const { "rows": reminders } = (await client.pg.query("SELECT * FROM reminders").catch(console.error)) || {};
		const { "rows": blocks } = (await client.pg.query("SELECT * FROM trade_block WHERE expires_at IS NOT NULL").catch(console.error)) || {};
		const { "rows": mutes } = (await client.pg.query("SELECT * FROM mutes WHERE expires_at IS NOT NULL").catch(console.error)) || {};

		if (reminders) reminders.forEach(async reminder => {
			const timestamp = new Date(reminder.timestamp).valueOf();
			if (Date.now() > timestamp) {
				client.users.fetch(reminder.user_id).then(user => user.send(`⏰ | ${reminder.content}`).catch(console.error)).catch(console.error);
				client.pg.query(`DELETE FROM reminders WHERE id = ${reminder.id}`).catch(console.error);
			}
		});

		if (blocks) blocks.forEach(async block => {
			const timestamp = new Date(block.expires_at).valueOf();
			if (Date.now() > timestamp) {
				client.pg.query(`DELETE FROM trade_block WHERE id = ${block.id}`).catch(console.error);
			}
		});

		const guild = client.guilds.cache.get("689164798264606784");
		const mutedRole = guild.roles.cache.get("695330946844721312");

		if (mutes) mutes.forEach(async mute => {
			const member = guild.members.cache.get(mute.user_id);
			if (!member) return;

			const timestamp = new Date(mute.expires_at).valueOf();
			if (Date.now() > timestamp) {
				client.pg.query(
					"DELETE FROM mutes WHERE user_id = $1",
					[ mute.user_id ]
				).catch(console.error);

				const jailedRoles = member.roles.cache.filter(role => guild.roles.cache.some(r => r.permissions.has("ADMINISTRATOR") && role.name === r.name + " (Jailed)"));
				const unJailedRoles = guild.roles.cache.filter(role => role.permissions.has("ADMINISTRATOR") && member.roles.cache.some(r => r.name === role.name + " (Jailed)"));
				jailedRoles.set(mutedRole.id, mutedRole);

				await member.roles.add(unJailedRoles).catch(console.error);
				await member.roles.remove(jailedRoles).catch(console.error);
			}
		});
	}, 10000);

	// VOICE CHANNEL XP
	setInterval(() => {
		client.guilds.cache.forEach(guild => {
			guild.members.cache.filter(m => m.voice.channelID && !m.user.bot).forEach(member => {
				let xp = config.BASE_VOICE_XP;
				if (member.voice.channel) xp *= member.voice.channel.members.filter(m => !m.user.bot).size;
				if (member.voice.deaf) xp *= 0;
				if (member.voice.mute) xp *= 0.5;
				if (member.voice.selfVideo) xp *= 5;
				if (member.voice.streaming) xp *= 3;
	
				voiceXP(member, xp, client.languages.get(member.guild.id));
			});
		});
	}, 60000);
});

client.on("message", async message => {
	if (message.partial) await message.fetch().catch(console.error);
	if (message.channel.type !== "dm" && message.content.toLowerCase().startsWith(client.prefix) && !message.author.bot && message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) {
		const input = message.content.slice(client.prefix.length).trim().split(/ +/g);
		const commandName = input.shift().toLowerCase();
		const args = parseArgs(input.join(" "));
		
		const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (command) processCommand(command, message, args);
	}

	const mayze = client.users.cache.get("703161067982946334");
	if (client.beta && mayze.presence.status !== "offline") return;
	if (client.isDatabaseReconnecting) return;

	if (message.channel.type !== "dm" && !message.author.bot && !message.channel.name.includes("spam")) {
		const bots = message.guild.members.cache.filter(m => m.user.bot);
		const prefixes = bots.map(b => (b.displayName.match(/\[.+\]/) || ["[!]"])[0].replace(/[\[\]]/g, ""));
		if (!prefixes.some(p => message.content.toLowerCase().startsWith(p))) {
			if (!client.xpMessages) client.xpMessages = {};
			if (!client.xpMessages[message.author.id]) {
				client.xpMessages[message.author.id] = 1;
				setTimeout(() => {
					delete client.xpMessages[message.author.id];
				}, 60000);
			}
			const f = x => Math.round(Math.sqrt(message.content.length) * config.XP_MULTIPLIER / x);
			const newXP = f(client.xpMessages[message.author.id]);
			chatXP(message, newXP, client.languages.get(message.guild.id));
			client.xpMessages[message.author.id] ++;
		}
	}

	client.responses.forEach(async autoresponse => autoresponse.execute(message).catch(console.error));

	if (!message.attachments.size) return;
	const download = require("./utils/download");

	message.attachments.forEach(async (attachment, id) => {
		if (![".png", ".jpg", ".jpeg", ".gif"].includes(Path.extname(attachment.url).toLowerCase())) return;
		download(attachment.url, `./discord-images/${message.id}#${id}${Path.extname(attachment.url).toLowerCase()}`);
	});
});

client.ws.on("INTERACTION_CREATE", async interaction => {
	switch (interaction.type) {
		case 1:
			// Ping
			break;
		case 2: {
			// Slash Command
			const command = client.commands.get(interaction.data.name) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(interaction.data.name));
			const options = interaction.data.options;
			const SlashCommand = require("./utils/interactions/SlashCommand");
			const slashCommand = new SlashCommand(interaction, client);
			slashCommand.acknowledge();

			if (command) processCommand(command, slashCommand, null, options);
			break;
		}
		case 3: {
			// Message Component
			const MessageComponent = require("./utils/interactions/MessageComponent");
			const messageComponent = new MessageComponent(interaction, client);
			messageComponent.acknowledge();

			const command = client.componentCommands.get(messageComponent.customID);
			if (command) command.execute(messageComponent);
			break;
		}
	}
});

/**
 * 
 * @param {object} command 
 * @param {Discord.Message} message 
 * @param {string[]} args 
 * @param {object[]} options 
 */
async function processCommand(command, message, args, options) {
	const language = client.languages.get(message.guild.id);

	if (client.isDatabaseReconnecting) return message.reply(languages.data.errors.database_reconnecting[language], { ephemeral: true }).catch(console.error);
	if (!message.guild.me.permissionsIn(message.channel.id).has("SEND_MESSAGES")) return;


	if (command.onlyInGuilds && !command.onlyInGuilds.includes(message.guild.id)) return; // message.reply(languages.data.unauthorized_guild[language]).catch(console.error);
	if (command.perms && !command.perms.every(perm => message.member.hasPermission(perm) || (message.channel.viewable && message.channel.permissionsFor(message.member).has(perm))) && message.author.id !== config.OWNER_ID) return message.reply(languages.get(languages.data.unauthorized_perms[language], command.perms.join("`, `")), { ephemeral: true }).catch(console.error);
	if (command.ownerOnly) {
		if (command.allowedUsers) {
			if (!command.allowedUsers.includes(message.author.id) && message.author.id !== config.OWNER_ID) return;
		} else if (message.author.id !== config.OWNER_ID) return;
	} else if (command.allowedUsers && !command.allowedUsers.includes(message.author.id)) return;
	if (args && args.length < command.args)	return message.channel.send(languages.get(languages.data.wrong_usage[language], `${client.prefix + command.name} ${command.usage}`), { ephemeral: true }).catch(console.error);
	if (command.botPerms && !command.botPerms.every(perm => message.guild.me.permissionsIn(message.channel.id).has(perm))) return message.channel.send(languages.get(languages.data.bot_missing_perms, command.botPerms.filter(perm => !message.guild.me.permissionsIn(message.channel.id).has(perm)).join("`, `"))).catch(console.error);

	if (!client.cooldowns.has(command.name)) client.cooldowns.set(command.name, new Discord.Collection());
	const now = Date.now();
	const timestamps = client.cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 2) * 1000;
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			const timeLeftHumanized = new Date((timeLeft % 86400) * 1000)
				.toUTCString()
				.replace(/.*(\d{2}):(\d{2}):(\d{2}).*/, "$1h $2m $3s")
				.replace(/00h |00m /g, "");
			return message.reply(languages.get(languages.data.cooldown[language], timeLeftHumanized, client.prefix + command.name), { ephemeral: true }).catch(console.error);
		}
	}

	const languageData = { get: languages.get, errors: pickLanguage(languages.data.errors, language), ...pickLanguage(languages.data[command.name], language) };

	await command.execute(message, args, options, languageData, language)
		.then(() => {
			timestamps.set(message.author.id, now);
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		})
		.catch(err => {
			console.error(err);
			message.channel.send(languages.data.error[language], { ephemeral: true }).catch(console.error);
		});
	return;
}

client.on("messageReactionAdd", async (reaction, user) => {
	if (reaction.partial) await reaction.fetch().catch(console.error);
	if (reaction.message.partial) await reaction.message.fetch().catch(console.error);
	if (reaction.partial || reaction.message.partial) return;
	if (user.bot) return;

	for (const reactionCommand of client.reactionCommands) {
		try { reactionCommand.execute(reaction, user, true); }
		catch (err) { console.error(err); }
	}
});

client.on("messageReactionRemove", async (reaction, user) => {
	if (reaction.partial) await reaction.fetch().catch(console.error);
	if (reaction.message.partial) await reaction.message.fetch().catch(console.error);
	if (reaction.partial || reaction.message.partial) return;
	if (user.bot) return;

	for (const reactionCommand of client.reactionCommands) {
		try { reactionCommand.execute(reaction, user, false); }
		catch (err) { console.error(err); }
	}

	if (!client.removedReactions) client.removedReactions = {};
	if (reaction.message.partial) await reaction.message.fetch().catch(console.error);

	client.removedReactions[reaction.message.channel.id] = {
		message: reaction.message,
		user: user,
		author: reaction.message.author,
		emoji: reaction.emoji
	};
	setTimeout(() => { delete client.removedReactions[reaction.message.channel.id] }, 60000);
});

client.on("guildMemberAdd", async member => {
	if (member.guild.id === "689164798264606784") {
		let roles = ["735809874205737020", "735810286719598634", "735810462872109156", "759694957132513300"];

		const { rows } = (await client.pg.query(`SELECT * FROM member_roles WHERE user_id = '${member.id}'`).catch(console.error)) || {};
		if (rows && rows.length) roles = roles.concat(rows[0].roles);
		member.roles.add(member.guild.roles.cache.filter(r => roles.includes(r.id))).catch(console.error);

		if (!rows || !rows.length) {
			member.user.send({
				embed: {
					author: {
						name: member.user.tag,
						icon_url: client.user.avatarURL()
					},
					thumbnail: {
						url: member.user.avatarURL({ dynamic: true })
					},
					title: "Bienvenue sur Mayze !",
					color: member.guild.me.displayColor,
					description: "Amuse-toi bien sur le serveur 😉",
					footer: {
						text: "✨ Mayze ✨"
					}
				}
			}).catch(console.error);
		}

		checkUnpingable(member);
	}

	// EVENT
	// if (member.guild.id === "744291144946417755") {
	// 	client.pg.query(`SELECT * FROM boards WHERE user_id = '${member.id}'`).then(async res => {
	// 		if (!res.rows.length) return;
	// 		if (!/^event-\d{18}$/.test(res.rows[0].board)) return;
			
	// 		let channel = member.guild.channels.cache.find(c => c.topic === member.id && c.parentID === "843817674948476929");
			
	// 		if (!channel) {
	// 			channel = await member.guild.channels.create(member.user.username, "text").catch(console.error);
	// 			await channel.setParent("843817674948476929").catch(console.error);
	// 			channel.setTopic(member.id).catch(console.error);
	// 			channel.createOverwrite(member, { "VIEW_CHANNEL": true }).catch(console.error);
	// 		} else {
	// 			channel.setName(member.user.username).catch(console.error);
	// 		}
	// 	}).catch(console.error);
	// }
});

client.on("guildMemberUpdate", async (oldMember, member) => {
	checkUnpingable(member);
});

client.on("guildMemberRemove", async member => {
	if (member.guild.id === "689164798264606784") {
		const roleIDs = member.roles.cache.filter(role => role.id !== member.guild.id).map(role => role.id);
		const roleString = `'{"${roleIDs.join("\",\"")}"}'`;
		const { rows } = (await client.pg.query(`SELECT * FROM member_roles WHERE user_id = '${member.id}'`).catch(console.error)) || {};
		if (!rows) return;

		if (rows.length) {
			client.pg.query(`UPDATE member_roles SET roles = ${roleString} WHERE user_id = '${member.id}'`).catch(console.error);
		} else {
			client.pg.query(`INSERT INTO member_roles VALUES (${member.id}, ${roleString})`).catch(console.error);
		}
	}

	// EVENT
	// if (member.guild.id === "744291144946417755") {
	// 	let channel = member.guild.channels.cache.find(c => c.topic === member.id && c.parentID === "843817674948476929");
	// 	channel.delete().catch(console.error);
	// }
});

client.on("messageDelete", async message => {
	if (!client.deletedMessages) client.deletedMessages = {};
	if (message.partial) return;
	if (message.author.bot) return;

	client.deletedMessages[message.channel.id] = {
		id: message.id,
		author: {
			id: message.author.id,
			tag: message.author.tag,
			avatar: message.author.avatarURL({ dynamic: true })
		},
		content: message.content,
		attachments: message.attachments.array()
	};

	setTimeout(() => { delete client.deletedMessages[message.channel.id] }, 600000);
});

client.on("messageUpdate", async (oldMessage, newMessage) => {
	if (!client.editedMessages) client.editedMessages = {};
	if (oldMessage.partial) return;
	if (oldMessage.author.bot) return;

	client.editedMessages[oldMessage.channel.id] = {
		id: oldMessage.id,
		author: {
			id: oldMessage.author.id,
			tag: oldMessage.author.tag,
			avatar: oldMessage.author.avatarURL({ dynamic: true })
		},
		content: oldMessage.content
	};

	setTimeout(() => { delete client.editedMessages[oldMessage.channel.id] }, 600000);
});

client.on("error", async err => {
	console.error(err);
});

client.on("presenceUpdate", async (oldMember, newMember) => {
	if (newMember.user.id === "703161067982946334" && client.beta) {
		client.prefix = newMember.user.presence.status === "offline" ? config.PREFIX : config.PREFIX_BETA;
	}
});



client.login(process.env.TOKEN);



/**
 * @param {string} input 
 */
function parseArgs(input) {
	const argsRegex = /("[^"]*")|([^"\s]*)/g;
	let args = input.match(argsRegex);

	args.forEach((a, i) => {
		if (!/^".*"$/.test(a)) args.splice(i, 1, ...a.split(/ +/g));
	});

	args = args.filter(a => a);
	args = args.map(a => a.replace(/"/g, ""));

	return args;
}



// MUSIC CODE
const Player = require("./utils/music/Player");
const player = new Player(client, {
	leaveOnEnd: true,
	leaveOnStop: true,
    leaveOnEmpty: true,
	deafenOnJoin: true,
    timeout: 900000, // 15min
    quality: "high",
	volume: 35
});
player.nowPlayings = new Discord.Collection();
client.player = player;

const Utils = require("./utils/music/Util");

player.on("clientDisconnect", (message, queue) => {
	const l = message.client.languages.get(message.guild.id);
	message.channel.send(languages.get(languages.music.disconnect[l], queue.connection.channel)).catch(console.error);
});

player.on("error", (error, message) => {
	console.error(error);
	const errorMessage = languages.music.errors[error] || languages.music.error;
	message.reply(languages.get(errorMessage.en, error)).catch(console.error);
});

player.on("playlistAdd", (message, queue, playlist) => {
	const l = message.client.languages.get(message.guild.id);
	message.channel.send(languages.get(languages.music.playlist[l], playlist.videoCount)).catch(console.error);
});

player.on("queueEnd", (message, queue) => {
	const l = message.client.languages.get(message.guild.id);

	const nowPlayings = player.nowPlayings.filter(nowPlaying => nowPlaying.guild.id === message.guild.id);
	const song = queue.songs[0];

	if (queue.stopped) return;

	nowPlayings.forEach(msg => {
		msg.edit({
			embed: {
				author: {
					name: languages.data["now-playing"].now_playing[l],
					icon_url: message.client.user.avatarURL()
				},
				thumbnail: {
					url: song.thumbnail,
				},
				color: message.guild.me.displayColor,
				description: languages.get(languages.data["now-playing"].description[l], song.name, song.url, Utils.buildBar(Utils.TimeToMilliseconds(song.duration), Utils.TimeToMilliseconds(song.duration), 20, "━", "🔘"), song.requestedBy, "Ø", "**0:00**"),
				footer: {
					text: languages.data["now-playing"].footer_end[l]
				}
			}
		}).catch(console.error);
	});
});

player.on("songAdd", (message, queue, song) => {
	const l = message.client.languages.get(message.guild.id);
	message.channel.send(languages.get(languages.music.song[l], queue.duration ? Utils.MillisecondsToTime(Utils.TimeToMilliseconds(queue.duration) - Utils.TimeToMilliseconds(song.duration)) : null, song.name)).catch(console.error);
});

player.on("songChanged", (message, newSong, OldSong) => {
	const l = message.client.languages.get(message.guild.id);

	const nowPlayings = player.nowPlayings.filter(nowPlaying => nowPlaying.guild.id === message.guild.id);

	nowPlayings.forEach(msg => {
		msg.edit({
			embed: {
				author: {
					name: languages.data["now-playing"].now_playing[l],
					icon_url: message.client.user.avatarURL()
				},
				thumbnail: {
					url: newSong.thumbnail,
				},
				color: message.guild.me.displayColor,
				description: languages.get(languages.data["now-playing"].description[l], newSong.name, newSong.url, Utils.buildBar(0, Utils.TimeToMilliseconds(newSong.duration), 20, "━", "🔘"), newSong.requestedBy, newSong.queue.repeatMode ? newSong.name : (newSong.queue.songs[1] ? newSong.queue.songs[1].name : (newSong.queue.repeatQueue ? newSong.queue.songs[0].name : "Ø")), newSong.queue.repeatMode || newSong.queue.repeatQueue || newSong.queue.autoplay ? "♾️" : newSong.queue.duration),
				footer: {
					text: languages.get(languages.data["now-playing"].footer[l], newSong.queue.repeatMode, newSong.queue.repeatQueue, newSong.queue.autoplay)
				}
			}
		}).catch(console.error);
	});
});

player.on("songFirst", (message, song) => {
	const l = message.client.languages.get(message.guild.id);
	message.channel.send(languages.get(languages.music.playing[l], song.name)).catch(console.error);
});

setInterval(() => {
	player.nowPlayings.forEach(message => {
		const l = message.client.languages.get(message.guild.id);

		if (!player.isPlaying(message)) return player.nowPlayings.delete(message.channel.id);

		const song = player.nowPlaying(message);
		
		message.edit({
			embed: {
				author: {
					name: languages.data["now-playing"].now_playing[l],
					icon_url: client.user.avatarURL()
				},
				thumbnail: {
					url: song.thumbnail
				},
				color: message.guild.me.displayColor,
				description: languages.get(languages.data["now-playing"].description[l], song.name, song.url, message.client.player.createProgressBar(message), song.requestedBy, song.queue.repeatMode ? song.name : (song.queue.songs[1] ? song.queue.songs[1].name : (song.queue.repeatQueue ? song.queue.songs[0].name : "Ø")), song.queue.repeatMode || song.queue.repeatQueue || song.queue.autoplay ? "♾️" : song.queue.duration),
				footer: {
					text: languages.get(languages.data["now-playing"].footer[l], song.queue.repeatMode, song.queue.repeatQueue, song.queue.autoplay)
				}
			}
		}).catch(console.error);
	});
}, 10000);

// SPOTIFY API
const SpotifyWebApi = require("spotify-web-api-node");
const spotify = new SpotifyWebApi({
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});
client.spotify = spotify;

(function getSpotifyToken() {
	spotify.clientCredentialsGrant()
		.then(data => {
			spotify.setAccessToken(data.body.access_token);
			// Refresh the token 60s before the current one expires
			setTimeout(getSpotifyToken, (data.body.expires_in - 60) * 1000);
		})
})();

// (async function getSpotifyToken() {
// 	const config = {
// 		grant_type: "client_credentials"
// 	};

// 	const res = await Axios.post("https://accounts.spotify.com/api/token", new URLSearchParams(config), {
// 		headers: {
// 			"Content-Type": "application/x-www-form-urlencoded",
// 			Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64")}`
// 		}
// 	});

// 	client.spotifyToken = res.data.access_token;

// 	// Get a new token 60 seconds before the current one expires
// 	setTimeout(getSpotifyToken, (res.data.expires_in - 60) * 1000);
// })();



// POKEDEX CATCH RATES
const pokedex = require("oakdex-pokedex");
const legendaries = require("./assets/legendaries.json");
const beasts = require("./assets/ultra-beasts.json");
const values = pokedex.allPokemon()
	.sort((a, b) => a.national_id - b.national_id)
	.map((pkm, i, dex) => 
		(legendaries.includes(pkm.names.en) || beasts.includes(pkm.names.en) ? 3 : pkm.catch_rate)
		+ dex.slice(0, i).reduce((sum, p) => sum + (legendaries.includes(p.names.en) || beasts.includes(p.names.en) ? 3 : p.catch_rate), 0)
	);
client.catchRates = values;



/**
 * Returns the first member of the guild corresponding to the string
 * @param {Discord.Guild} guild The guild where to find the member
 * @param {string} string The ID, nickname or username of the member
 */
client.findMember = (guild, string) => guild.members.cache.find(member =>
		member.id === string ||
		member.user.username.toLowerCase() === string.toLowerCase() ||
		member.user.username.toLowerCase().startsWith(string.toLowerCase()) ||
		member.user.username.includes(string.toLowerCase()) ||
		member.displayName.toLowerCase() === string.toLowerCase() ||
		member.displayName.toLowerCase().startsWith(string.toLowerCase()) ||
		member.displayName.toLowerCase().includes(string.toLowerCase())
	) || null;

/**
 * @returns {pg.Client} Un client postgreSQL connecté à la base de données de mayze
 */
function newPgClient() {
	const connectionString = {
		connectionString: process.env.DATABASE_URL,
		ssl: process.env.HOST === "HEROKU"
	};

	client.isDatabaseReconnecting = true;
	const pgClient = new pg.Client(connectionString);

	pgClient.on("error", err => {
		console.error(err);
		client.pg.end().catch(console.error);
		newPgClient();
	});

	client.isDatabaseReconnecting = false;

	return pgClient;
}

function reconnectPgClient() {
	client.isDatabaseReconnecting = true;
	client.pg.end().catch(console.error);
	client.pg = newPgClient();
	client.pg.connect().then(() => console.log("Connected to the database")).catch(console.error);
	client.isDatabaseReconnecting = false;
}

function pickLanguage(data = {}, language = "en") {
	return Object.keys(data)
		.reduce((acc, key) => {
			acc[key] = data[key][language] || data[key].en;
			return acc;
		}, {});
}

function slashChanged(oldSlash, newSlash) {
	if (oldSlash.description !== newSlash.description) return true;
	if (JSON.stringify(oldSlash.options) !== JSON.stringify(newSlash.options).replace(/'/g, "''")) return true;
	return false;
}

/**
 * @param {Discord.GuildMember} member The member to check
 */
function checkUnpingable(member) {
	const regex = /[\w\déèêëàâôîùûç"'\(\)\[\]\{\}&#-_\^@°=\+\$\*%!:\/;\.,\?\\<>]/i;
	if (member.guild.id !== "689164798264606784") return;
	if (!regex.test(member.displayName)) member.setNickname(`.${member.displayName}`, "Unpingable nickname or username").catch(console.error);
}



// REMINDERS

function ACNHReminders() {
	const turnipMorning = new Cron.CronJob("0 0 8 * * 1-6", () => {
		const owner = client.guilds.cache.get("689164798264606784").members.cache.get(config.OWNER_ID).user;
		owner.send("**Rappel :** `Navets Animal Crossing New Horizons`");
	}, null, true, "Europe/Paris");

	const turnipAfternoon = new Cron.CronJob("0 0 14 * * 1-6", () => {
		const owner = client.guilds.cache.get("689164798264606784").members.cache.get(config.OWNER_ID).user;
		owner.send("**Rappel :** `Navets Animal Crossing New Horizons`");
	}, null, true, "Europe/Paris");

	return { turnipMorning, turnipAfternoon };
}

function testReminders() {
	const users = [ "408671348005797898", "463358584583880704", "608623753399762964" ];
	const nubs = [ "408671348005797898" ];

	const wednesday = new Cron.CronJob("0 45 15 * * 3", () => {
		users.forEach(u => client.users.fetch(u).then(u => u.send(getMessage(15, nubs.includes(u.id))).catch(console.error)));
		setTimeout(() => users.forEach(u => client.users.cache.get(u).send(getMessage(5, nubs.includes(u.id))).catch(console.error)), 600000);
		setTimeout(() => users.forEach(u => client.users.cache.get(u).send(getMessage(2, nubs.includes(u.id))).catch(console.error)), 780000);
	}, null, true, null, null, false, 0);

	const sunday = new Cron.CronJob("0 45 13 * * 0", () => {
		users.forEach(u => client.users.fetch(u).then(u => u.send(getMessage(15, nubs.includes(u.id))).catch(console.error)));
		setTimeout(() => users.forEach(u => client.users.cache.get(u).send(getMessage(5, nubs.includes(u.id))).catch(console.error)), 600000);
		setTimeout(() => users.forEach(u => client.users.cache.get(u).send(getMessage(2, nubs.includes(u.id))).catch(console.error)), 780000);
	}, null, true, null, null, false, 0);

	return { wednesday, sunday };

	function getMessage(minutes, nub) {
		return `Test in ${minutes} minute${minutes > 1 ? "s" : ""}! <#463399799807410176>\n**Sunday 4pm CEST, Wednesday 6pm CEST**${nub ? "\nAnd because you are a nub that keeps forgetting it\n- It's __,t Name__" : ""}`;
	}
}