const fs = require("fs");
const config = require("./config.json");
require('dotenv').config();

const Discord = require("discord.js");
const intents = new Discord.Intents([ Discord.Intents.NON_PRIVILEGED, "GUILD_MEMBERS" ]);
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] , ws: { intents }});

if (process.env.BOT_HOST !== "heroku") {
	const shellExec = require("./modules/shellExec.js");
	const result = shellExec("heroku pg:credentials:url --app mayze-bot");
	process.env.DATABASE_URL = result.match(/postgres:.*/)[0];
}
const pg = require("pg");
client.pg = createPgClient();
client.pg.connect().catch(console.error);
setInterval(reconnectPgClient, 36000000);
client.pg.on("error", err => {
	console.error(err);
	client.pg = createPgClient();
	client.pg.connect().catch(console.error);
})

const dataRead = require("./modules/dataRead.js");
const dataWrite = require("./modules/dataWrite.js");

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.autoresponses = [];
const autoresponseFiles = fs.readdirSync("./autoresponses").filter(file => file.endsWith(".js"));
for (const file of autoresponseFiles) {
	const autoresponse = require(`./autoresponses/${file}`);
	client.autoresponses.push(autoresponse);
}

client.reactionCommands = [];
const reactionCommandsFiles = fs.readdirSync("./reactionCommands").filter(file => file.endsWith(".js"));
for (const file of reactionCommandsFiles) {
	const reactionCommand = require(`./reactionCommands/${file}`);
	client.reactionCommands.push(reactionCommand);
}

client.cooldowns = new Discord.Collection();

client.on("ready", async () => {
	console.log("--------------------");
	console.log("BOT STARTED UP");
	console.log("--------------------");
	const { version } = require ("./package.json");
	const logChannel = client.channels.cache.get(config.logChannel);
	try {
		const msg = await logChannel.send({
			embed: {
				author: {
					name: "Démarrage du bot...",
					icon_url: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png`
				},
				color: "#010101",
				description: `• **Version:** \`${version}\`\n• **Ping:** Calcul...`,
				footer: {
					text: "✨ Mayze ✨"
				},
				timestamp: Date.now()
			}
		});
		const embed = new Discord.MessageEmbed(msg.embeds[0]);
		const editedMsg = await msg.edit(embed);
		msg.edit(embed.setDescription(`• **Version:** \`${version}\`\n• **Ping:** \`${Math.abs(editedMsg.editedTimestamp - editedMsg.createdTimestamp)}ms\``));
	} catch (err) { console.log(err); }
	client.user.setActivity("le meilleur clan", { type: "WATCHING" });
	if (client.user.id === "740848584882126939") client.beta = true;
});

client.on("message", async message => {
	if (message.partial) {
		try { await message.fetch(); }
		catch (err) { console.log(err); }
	}
	if (message.channel.type === "dm") return;

	const chatXP = require("./modules/chatXP.js");

	if (message.content.toLowerCase().startsWith(config.prefix[client.user.id])) {
		if (message.author.bot) return;
		const input = message.content.slice(config.prefix[client.user.id].length).trim().split(/ +/g);
		const commandName = input[0].toLowerCase();
		const args = input.splice(1);

		const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		if (!command) return;

		if (command.perms && !command.perms.every(perm => message.member.hasPermission(perm))) {
			return message.reply(`tu n'as pas les permissions nécessaires \n→ \`${command.perms.join("`, `")}\``).catch(console.error);
		}
		if (command.ownerOnly && message.author.id !== config.ownerID) return;

		if (!client.cooldowns.has(command.name)) {
			client.cooldowns.set(command.name, new Discord.Collection());
		}
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
				try {
					return message.reply(`attends encore **${timeLeftHumanized}** avant d'utiliser la commande \`${config.prefix[client.user.id]}${command.name}\``);
				} catch (err) { console.log(err); }
			}
		}

		if (args.length < command.args) {
			return message.channel.send(`Utilisation : \`${config.prefix[client.user.id]}${commandName} ${command.usage}\``).catch(console.error);
		}
		try {
			command.execute(message, args);
			//chatXP(message, command.xp || 20);
			timestamps.set(message.author.id, now);
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		} catch (err) {
			console.log(err);
			message.reply("quelque chose s'est mal passé en exécutant la commande :/").catch(console.error);
		}
	}

	if (client.beta && message.author.id !== config.ownerID) return;

	if (!message.author.bot && message.guild.id === "689164798264606784" && !message.channel.name.includes("spam")) {
		await message.guild.members.fetch().catch(console.error);
		const bots = message.guild.members.cache.filter(m => m.user.bot);
		const prefixes = bots.map(b => b.nickname.match(/\[.+\]/)[0].replace(/[\[\]]/g, ""));
		if (!prefixes.some(p => message.content.toLowerCase().startsWith(p))) {
			if (!client.xpMessages) client.xpMessages = {};
			if (!client.xpMessages[message.author.id]) {
				client.xpMessages[message.author.id] = 1;
				setTimeout(() => {
					delete client.xpMessages[message.author.id];
				}, 60000);
			}
			const f = x => Math.round(Math.sqrt(message.content.length) * config.xpMultiplier / x);
			const newXP = f(client.xpMessages[message.author.id]);
			chatXP(message, newXP);
			client.xpMessages[message.author.id] ++;
		}
	}

	for (const autoresponse of client.autoresponses) {
		try { autoresponse.execute(message); }
		catch (err) { console.log(err); }
	}
});

client.on("messageReactionAdd", async (reaction, user) => {
	if (reaction.partial) {
		try { await reaction.fetch(); }
		catch (err) { return console.log(err); }
	}
	if (reaction.message.partial) {
		try { await reaction.message.fetch(); }
		catch (err) { return console.log(err); }
	}
	if (user.bot) return;
	for (const reactionCommand of client.reactionCommands) {
		try { reactionCommand.execute(reaction, user); }
		catch (err) { console.log(err); }
	}
});

client.on("messageReactionRemove", async (reaction, user) => {
	if (!client.removedReactions) client.removedReactions = {};
	if (reaction.message.partial) await reaction.message.fetch().catch(console.error);

	client.removedReactions[reaction.message.channel.id] = {
		message: reaction.message,
		user: user,
		author: reaction.message.author,
		emoji: reaction.emoji
	};
	setTimeout(() => { delete client.removedReactions[reaction.message.channel.id] }, 30000);
});

client.on("guildMemberAdd", async member => {
	const roles = ["759694957132513300", "735810462872109156", "735810286719598634", "735809874205737020", "735811339888361472"];
	member.roles.add(message.guild.roles.cache.filter(r => roles.includes(r))).catch(console.error);
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
			color: "#010101",
			description: "Amuse-toi bien sur le serveur 😉",
			footer: {
				text: "✨ Mayze ✨"
			}
		}
	}).catch(console.error);
});

client.on("messageDelete", async message => {
	if (!client.deletedMessages) client.deletedMessages = {};
	if (message.partial) return;
	if (message.author.bot) return;
	client.deletedMessages[message.channel.id] = {
		author: {
			id: message.author.id,
			tag: message.author.tag,
			avatar: message.author.avatar
		},
		content: message.content
	};
	setTimeout(() => { delete client.deletedMessages[message.channel.id] }, 300000);
});

client.on("messageUpdate", async (oldMessage, newMessage) => {
	if (!client.editedMessages) client.editedMessages = {};
	if (oldMessage.partial) return;
	if (oldMessage.author.bot) return;
	client.editedMessages[oldMessage.channel.id] = {
		author: {
			id: oldMessage.author.id,
			tag: oldMessage.author.tag,
			avatar: oldMessage.author.avatar
		},
		content: oldMessage.content
	};
	setTimeout(() => { delete client.editedMessages[oldMessage.channel.id] }, 300000);
});

client.on("error", async error => {
	const { errorChannel } = config;
	errorChannel.send({
		embed: {
			author: {
				name: "Erreur rencontrée",
				icon_url: `https://cdn.discordapp.com/avatars/${client.user.id}/${client.user.avatar}.png`
			},
			color: "#010101",
			title: error.name,
			description: error.stack,
			footer: {
				text: "✨ Mayze ✨"
			}
		}
	}).catch(console.error);
});

client.login(process.env.TOKEN);

const pokedex = require("oakdex-pokedex");
const values = pokedex.allPokemon().sort((a, b) => a.national_id - b.national_id).map(p => p.catch_rate);
const catchRates = values.map((_v, i, a) => a.slice(0, i).reduce((partialSum, a) => partialSum + a, 0));
client.catchRates = catchRates;


/**
 * @returns {pg.Client} Un client postgreSQL connecté à la base de données de mayze-bot
 */
function createPgClient() {
	const connectionString = {
		connectionString: process.env.DATABASE_URL,
		ssl: true
	};
	const pgClient = new pg.Client(connectionString);
	return pgClient;
}

function reconnectPgClient() {
	client.pg.end().catch(console.error);
	client.pg = createPgClient();
	client.pg.connect().catch(console.error);
}