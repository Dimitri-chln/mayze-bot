const { Message, GuildMember } = require("discord.js");

const command = {
	name: "russian-roulette",
	description: "Jouer à la roulette russe",
	aliases: ["rr"],
	args: 1,
	usage: "create | join | delete | start [-kick | -mute]",
	onlyInGuilds: ["689164798264606784"],
	slashOptions: [
		{
			name: "create",
			description: "Créer une nouvelle partie de roulette russe",
			type: 1
		},
		{
			name: "join",
			description: "Rejoindre une partie de roulette russe en cours",
			type: 1
		},
		{
			name: "delete",
			description: "Supprimer la partie de roulette russe",
			type: 1
		},
		{
			name: "start",
			description: "Lancer la partie de roulette russe créée",
			type: 1,
			options: [
				{
					name: "options",
					description: "Options pour la partie",
					type: 3,
					required: false,
					choices: [
						{
							name: "Expulser le perdant du serveur",
							value: "-kick"
						},
						{
							name: "Mute le perdant pendant 5min",
							value: "-mute"
						}
					]
				}
			]
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options
	 */
	execute: async (message, args, options, language, languageCode) => {
		const subCommand = args
			? args[0].toLowerCase()
			: options[0].name.toLowerCase();
		const params = args
			? args.slice(1)
			: options[0].options ? options[0].options.map(o => o.value) : [];

		switch (subCommand) {
			case "create":
				if (message.client.russianRoulette) return message.reply("une partie est déjà en cours!").catch(console.error);
				message.client.russianRoulette = [ message.member ];
				message.channel.send({
					embed: {
						author: {
							name: "Une partie de roulette russe a été lancée!",
							icon_url: message.author.avatarURL({ dynamic: true })
						},
						color: message.guild.me.displayColor,
						description:
							`Rejoins la partie avec la commande \`${message.client.prefix}russian-roulette join\``,
						footer: {
							text: "✨ Mayze ✨"
						}
					}
				}).catch(console.error);
				break;
			case "join":
				if (!message.client.russianRoulette) return message.reply(`il n'y a pas de partie en cours! Crée une partie avec la commande \`${message.client.prefix}russian-roulette create\``).catch(console.error);
				if (message.client.russianRoulette.some(u => u.id === message.author.id)) return message.reply("tu as déjà rejoint cette partie").catch(console.error);
				message.client.russianRoulette.push(message.member);
				message.channel.send(`<@${message.author.id}> a rejoint la partie de roulette russe`).catch(console.error);
				break;
			case "delete":
				if (!message.client.russianRoulette) return message.reply(`il n'y a pas de partie en cours! Crée une partie avec la commande \`${message.client.prefix}russian-roulette create\``).catch(console.error);
				if (message.client.russianRoulette[0].id !== message.author.id && !message.member.hasPermission("KICK_MEMBERS")) return message.reply("seuls les modérateurs ainsi que la personne qui a créé la partie peuvent supprimer la partie").catch(console.error);
				delete message.client.russianRoulette;
				message.reply("partie supprimée").catch(console.error);
				break;
			case "start":
				if (!message.client.russianRoulette) return message.reply(`il n'y a pas de partie en cours! Crée une partie avec la commande \`${message.client.prefix}russian-roulette create\``).catch(console.error);
				if (message.client.russianRoulette.length < 2) return message.reply("il faut au minimum 2 joueurs pour lancer la partie").catch(console.error);
				if (message.client.russianRoulette[0].id !== message.author.id && !message.member.hasPermission("KICK_MEMBERS")) return message.reply("seuls les modérateurs ainsi que la personne qui a créé la partie peuvent lancer la partie").catch(console.error);
				
				const shuffle = require("../utils/shuffle");
				/**@type {GuildMember[]} */
				const players = shuffle(message.client.russianRoulette);
				const { MessageEmbed } = require("discord.js");

				const embed = new MessageEmbed()
					.setAuthor("La partie de roulette russe a commencé!", message.author.avatarURL({ dynamic: true }))
					.setColor(message.guild.me.displayColor)
					.setDescription("...")
					.setFooter("✨ Mayze ✨")
					.setTimestamp();

				const msg = await message.channel.send(embed).catch(console.error);
				if (!msg) return message.reply("Quelque chose s'est mal passé en lançant la partie :/");
				
				await roulette();
				delete message.client.russianRoulette;

				async function roulette(i = 0) {
					if (players.length > 1 && i < 5) {
						setTimeout(async () => {
							msg.edit(embed.setDescription(`${players.pop().user.username} ...`)).catch(console.error);
							roulette(i + 1);
						}, 2000);
					} else {
						setTimeout(async () => {
							const deadPlayer = players.pop();
							msg.edit(embed.setDescription(`🔫 ${deadPlayer.user.username} est mort !`)).catch(console.error);
							if (params.includes("-kick")) {
								const kick = message.client.commands.get("kick");
								message.channel.send(`*kick ${deadPlayer.user}`)
									.then(m => kick.execute(m, [deadPlayer.user]))
									.catch(console.error);
							
							} else if (params.includes("-mute")) {
								const mute = message.client.commands.get("mute");
								message.channel.send(`*mute ${deadPlayer.user} 5m`)
									.then(m => mute.execute(m, ["5m"]))
									.catch(console.error);
							}
						}, 2000);
					}
				}
				break;
			default:
				message.reply("arguments incorrects !").catch(console.error);
		}
	}
};

module.exports = command;