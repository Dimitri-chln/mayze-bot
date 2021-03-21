const Fs = require("fs");
const Axios = require("axios").default;
const Path = require("path");
const Cron = require("cron");
const config = require("./config.json");
require('dotenv').config();
const languages = require("./utils/languages");

const Discord = require("discord.js");
const intents = new Discord.Intents([ Discord.Intents.NON_PRIVILEGED, "GUILD_MEMBERS", "GUILD_PRESENCES" ]);
const client = new Discord.Client({ presence: { activity: { name: "le meilleur clan", type: "WATCHING "} }, fetchAllMembers: true, partials: ["MESSAGE", "CHANNEL", "REACTION"] , ws: { intents }});

if (process.env.HOST !== "HEROKU") {
	const shellExec = require("./utils/shellExec");
	const output = shellExec("heroku pg:credentials:url --app mayze-bot");
	const connectionURLregex = /postgres:\/\/(\w+):(\w+)@(.*):(\d+)\/(\w+)/;
	const [ connectionURL, user, password, host, port, database ] = output.match(connectionURLregex);
	process.env.DATABASE_URL = connectionURL;
}
const pg = require("pg");
client.pg = newPgClient();
client.pg.connect().then(() => console.log("Connected to the database")).catch(console.error);
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

client.cooldowns = new Discord.Collection();
client.queues = new Discord.Collection();

client.on("ready", async () => {
	console.log("Connected to Discord");
	if (client.user.id === "740848584882126939") client.beta = true;

	const { version } = require ("./package.json");
	const logChannel = client.channels.cache.get(config.LOG_CHANNEL_ID);
	try {
		const msg = await logChannel.send({
			embed: {
				author: {
					name: "Démarrage du bot...",
					icon_url: client.user.avatarURL()
				},
				color: "#010101",
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
	const prefix = client.beta ? ( mayze.presence.status === "offline" ? config.PREFIX : config.PREFIX_BETA ) : config.PREFIX;
	client.prefix = prefix;

	if (client.beta) return;

	// SLASH COMMANDS
	const slashGuilds = [ "724530039781326869", "689164798264606784" ];
	client.slashCommands = {};
	for (const guildID of slashGuilds) client.slashCommands[guildID] = new Discord.Collection();

	slashGuilds.forEach(async guildID => {
		const { "rows": slashData } = (await client.pg.query(`SELECT * FROM slash_commands WHERE guild_id = '${guildID}'`).catch(console.error)) || {};

		client.commands.forEach(async command => {
			if (!command.slashOptions || command.disableSlash || command.ownerOnly) return;
			if (command.onlyInGuilds && !command.onlyInGuilds.includes(guildID)) return;

			const slashOptions = { name: command.name, description: command.description.en || command.description };
			if (command.slashOptions) slashOptions.options = command.slashOptions;

			const oldSlashCommand = slashData.find(slash => slash.name === command.name);
			if (oldSlashCommand && !slashChanged(oldSlashCommand, slashOptions)) return;

			const slashCommand = await client.api.applications(client.user.id).guilds(guildID).commands.post({ data: slashOptions }).catch(console.error);

			client.slashCommands[guildID].set(slashCommand.name, slashCommand);

			if (slashData.some(slash => slash.name === command.name)) client.pg.query(`UPDATE slash_commands SET id = '${slashCommand.id}', data = '${JSON.stringify(slashCommand).replace(/'/g, "U+0027")}' WHERE name = '${slashCommand.name}' AND guild_id = '${guildID}'`).catch(console.error);
			else client.pg.query(`INSERT INTO slash_commands VALUES ('${slashCommand.id}', '${guildID}', '${slashCommand.name}', '${JSON.stringify(slashCommand).replace(/'/g, "U+0027")}')`).catch(console.error);
		});
	});
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
		}
	}).catch(console.error);

	// REMINDERS
	ACNHReminders();
	testReminders();
});

client.on("message", async message => {
	if (message.partial) await message.fetch().catch(console.error);
	if (message.author.id === client.user.id) return;
	if (message.channel.type !== "dm" && message.content.toLowerCase().startsWith(client.prefix) && !message.author.bot) {
		const input = message.content.slice(client.prefix.length).trim().split(/ +/g);
		const commandName = input.shift().toLowerCase();
		const args = parseArgs(input.join(" "));
		
		const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (command) processCommand(command, message, args);
	}

	const mayze = client.users.cache.get("703161067982946334");
	if (client.beta && mayze.presence.status !== "offline") return;

	const chatXP = require("./utils/chatXP");
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
			chatXP(message, newXP);
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
	const command = client.commands.get(interaction.data.name) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(interaction.data.name));
	const options = interaction.data.options;
	const EnhancedInteraction = require("./utils/EnhancedInteraction");
	const enhancedInteraction = new EnhancedInteraction(interaction, client);

	console.log(`${enhancedInteraction.author.tag} used /${enhancedInteraction.base.data.name} in #${enhancedInteraction.channel.name}\n${JSON.stringify(enhancedInteraction.base.data, null, 4)}`);
	enhancedInteraction.acknowledge();
	
	if (command) await processCommand(command, enhancedInteraction, null, options);
	// setTimeout(enhancedInteraction.delete, 5000);
});

/**
 * 
 * @param {object} command 
 * @param {Discord.Message} message 
 * @param {string[]} args 
 * @param {object[]} options 
 */
async function processCommand(command, message, args, options) {
	let language = "fr";
	const res = await message.client.pg.query(`SELECT * FROM languages WHERE guild_id = '${message.guild.id}'`).catch(console.error);
	if (res && res.rows.length) language = res.rows[0].language_code;

	if (command.onlyInGuilds && !command.onlyInGuilds.includes(message.guild.id)) return message.reply(languages.data.unauthorized_guild[language]).catch(console.error);
	if (command.perms && !command.perms.every(perm => message.member.hasPermission(perm) || message.channel.permissionsFor(message.member).has(perm)) && message.author.id !== config.OWNER_ID) return message.reply(languages.get(languages.data.unauthorized_perms[language], command.perms.join("`, `"))).catch(console.error);
	if (command.ownerOnly) {
		if (command.allowedUsers) {
			if (!command.allowedUsers.includes(message.author.id) && message.author.id !== config.OWNER_ID) return;
		} else if (message.author.id !== config.OWNER_ID) return;
	} else if (command.allowedUsers && !command.allowedUsers.includes(message.author.id)) return;
	if (args && args.length < command.args) return message.channel.send(languages.get(languages.data.wrong_usage[language], `${client.prefix + command.name} ${command.usage}`)).catch(console.error);

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
			return message.reply(languages.get(languages.data.cooldown[language], timeLeftHumanized, client.prefix + command.name)).catch(console.error);
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
		message.channel.send(languages.data.error[language]).catch(console.error);
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
	if (member.guild.id !== "689164798264606784") return;

	let roles = ["735811339888361472", "735809874205737020", "735810286719598634", "735810462872109156"];

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
			color: member.guild.me.displayHexColor,
			description: "Amuse-toi bien sur le serveur 😉",
			footer: {
				text: "✨ Mayze ✨"
			}
		}
	}).catch(console.error);

	const { rows } = (await client.pg.query(`SELECT * FROM member_roles WHERE user_id = '${member.id}'`).catch(console.error)) || {};
	if (rows && rows.length) roles = roles.concat(rows[0].roles);

	member.roles.add(member.guild.roles.cache.filter(r => roles.includes(r.id))).catch(console.error);

	// UNPINGABLE NICKNAMES
	const regex = /[\w\d&é"#'\{\(\[-\|è_\\ç^à@\)\]=\+\}\$\*%!:\/;\.,\?<>€]{3,}/;
	if (member.guild.id !== "689164798264606784") return;
	if (!regex.test(member.displayName)) member.setNickname(`Je clc | ${member.displayName}`).catch(console.error);
});

client.on("guildMemberUpdate", async (oldMember, member) => {
	// UNPINGABLE NICKNAMES
	const regex = /[\w\d&é"#'\{\(\[-\|è_\\ç^à@\)\]=\+\}\$\*%!:\/;\.,\?<>€]{3,}/;
	if (member.guild.id !== "689164798264606784") return;
	if (!regex.test(member.displayName)) member.setNickname(`Je clc | ${member.displayName}`).catch(console.error);
});

client.on("guildMemberRemove", async member => {
	if (member.guild.id !== "689164798264606784") return;
	const roleIDs = member.roles.cache.filter(role => role.id !== member.guild.id).map(role => role.id);
	const roleString = `'{"${roleIDs.join("\",\"")}"}'`;
	const { rows } = await client.pg.query(`SELECT * FROM member_roles WHERE user_id = '${member.id}'`).catch(console.error)
	if (rows.length) {
		client.pg.query(`UPDATE member_roles SET roles = ${roleString} WHERE user_id = '${member.id}'`).catch(console.error);
	} else {
		client.pg.query(`INSERT INTO member_roles VALUES (${member.id}, ${roleString})`).catch(console.error);
	}
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
		attachments: message.attachments.map((attachment, id) => `${message.id}#${id}${Path.extname(attachment.url).toLowerCase()}`) || null
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

client.on("presenceUpdate", async (_oldMember, newMember) => {
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
    timeout: 900000, // 15min
    quality: "high",
	volume: 35
});
client.player = player;
client.player.npTimers = {};



// POKEDEX CATCH RATES
const pokedex = require("oakdex-pokedex");
const values = pokedex.allPokemon().sort((a, b) => a.national_id - b.national_id).map(p => p.catch_rate);
const catchRates = values.map((_v, i, a) => a.slice(0, i).reduce((partialSum, a) => partialSum + a, 0));
client.catchRates = catchRates;



/**
 * Returns the first member of the guild corresponding to the string
 * @param {Discord.Guild} guild The guild where to find the member
 * @param {string} string The ID, nickname or username of the member
 */
client.findMember = (guild, string) => guild.members.cache.find(member => member.id === string || member.user.username.toLowerCase() === string.toLowerCase() || member.user.username.toLowerCase().includes(string.toLowerCase()) || member.displayName.toLowerCase() === string.toLowerCase() || member.displayName.toLowerCase().includes(string.toLowerCase())) || null;

/**
 * @returns {pg.Client} Un client postgreSQL connecté à la base de données de mayze
 */
function newPgClient() {
	const connectionString = {
		connectionString: process.env.DATABASE_URL,
		ssl: true
	};
	const pgClient = new pg.Client(connectionString);

	pgClient.on("error", err => {
		console.error(err);
		client.pg.end().catch(console.error);
		newPgClient();
	});

	return pgClient;
}

function reconnectPgClient() {
	client.pg.end().catch(console.error);
	client.pg = newPgClient();
	client.pg.connect().then(() => console.log("Connected to the database")).catch(console.error);
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
	if (JSON.stringify(oldSlash.options) !== JSON.stringify(newSlash.options).replace(/'/g, "U+0027")) return true;
	return false;
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
	const users = [ "408671348005797898" ];

	const wednesday = new Cron.CronJob("0 45 15 * * 3", () => {
		users.forEach(u => client.users.fetch(u).then(u => u.send("Test in 15 minutes!").catch(console.error)));
		setTimeout(() => users.forEach(u => client.users.fetch(u).then(u => u.send("Test in 5 minutes!").catch(console.error))), 600000);
		setTimeout(() => users.forEach(u => client.users.fetch(u).then(u => u.send("Test in 2 minutes!").catch(console.error))), 780000);
	}, null, true, null, null, false, 0);

	const sunday = new Cron.CronJob("0 45 13 * * 0", () => {
		users.forEach(u => client.users.fetch(u).then(u => u.send("Test in 15 minutes!").catch(console.error)));
		setTimeout(() => users.forEach(u => client.users.fetch(u).then(u => u.send("Test in 5 minutes!").catch(console.error))), 600000);
		setTimeout(() => users.forEach(u => client.users.fetch(u).then(u => u.send("Test in 2 minutes!").catch(console.error))), 780000);
	}, null, true, null, null, false, 0);

	return { wednesday, sunday };
}