const command = {
	name: "quest",
	description: "Affiche un message de vote pour les quêtes WWO",
	aliases: [],
	args: 0,
	usage: "[-everyone] [-single] [-noping]",
	perms: ["ADMINISTRATOR"],
	async execute(message, args) {
	if (!message.member.roles.cache.some(r => ["696751614177837056", "696751852267765872"].includes(r.id))) return;
	if (message.channel.id !== "689212233439641649") {
		try { message.react("❌"); }
		catch (err) { console.log(err); }
		return;
	}
	const questChannel = message.client.channels.cache.get("689385764219387905");

	const imageURL = (message.attachments.first() || {}).url;
	if (!imageURL) {
		return message.reply("ajoute une image à ton message").catch(console.error);
	}
	const flags = args.filter(a => a === "-noping");
	const footerFlags = args.filter(a => a === "-everyone" || a === "-single");
	const footerFlagsString = ["Membres uniquement", "Plusieurs votes"];
	footerFlags.forEach(f => {
		if (f === "-everyone") footerFlagsString[0] = "Tout le monde";
		if (f === "-single") footerFlagsString[1] = "Un seul vote";
	});
	var messageContent = "<@&689169027922526235>";
	if (flags.includes("-noping")) messageContent = "";
	
	var msg;
	try {
		msg = await questChannel.send({
			content: messageContent,
			embed: {
				title: "Nouvelles quêtes disponibles!",
				color: "#010101",
				image: {
					url: imageURL
				},
				footer: {
					text: footerFlagsString.join(" - ")
				}
			}
		});
	} catch (err) {
		console.log(err);
		return message.channel.send("Quelque chise s'est mal passé en envoyant le message :/").catch(console.error);
	}
	try {
		await msg.react("1️⃣");
		await msg.react("2️⃣");
		await msg.react("3️⃣");
		await msg.react("🔁");
	} catch (err) {
		console.log(err);
		return message.channel.send("Quelque chose s'est mal passé en ajoutant les réactions :/").catch(console.error);
	}
	try { message.react("✅"); }
	catch (err) { console.log(err); }
	}
};

module.exports = command;