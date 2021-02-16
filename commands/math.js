const { Message } = require("discord.js");

const command = {
	name: "math",
	description: "Effectuer des opérations mathématiques",
	aliases: [],
	args: 2,
	usage: "eval <expression> | solve <équation> [, variable] | derivative <fonction> [, variable]",
	slashOptions: [
		{
			name: "eval",
			description: "Évaluer une expression",
			type: 1,
			options: [
				{
					name: "expression",
					description: "L'expression à évaluer",
					type: 3,
					required: true
				}
			]
		},
		{
			name: "solve",
			description: "Résoudre une équation algébrique",
			type: 1,
			options: [
				{
					name: "équation",
					description: "L'équation à résoudre",
					type: 3,
					required: true
				},
				{
					name: "variable",
					description: "La variable pour laquelle résoudre l'équation",
					type: 3,
					required: false
				}
			]
		},
		{
			name: "derivative",
			description: "Dériver une fonction",
			type: 1,
			options: [
				{
					name: "fonction",
					description: "La fonction à dériver",
					type: 3,
					required: true
				},
				{
					name: "variable",
					description: "La variable selon laquelle dériver la fonction",
					type: 3,
					required: false
				}
			]
		}
	],
	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 * @param {Object[]} options 
	 */
	execute: async (message, args, options, languages, language) => {
		const math = require("mathjs");
		const { parse } = require("algebra");
		const subCommand = args
			? args[0].toLowerCase()
			: options[0].name;
		
		switch (subCommand) {
			case "eval": {
				const expression = args
					? args.slice(1).join(" ")
					: options[0].options[0].value;

				try {
					const parsedExp = math.parse(expression);
					const result = math.evaluate(expression);
					message.channel.send(`\`\`\`\n${parsedExp.toString()}\n= ${result}\n\`\`\``).catch(console.error);
				} catch (err) {
					if (err.name === "SyntaxError") message.reply("syntaxe incorrecte").catch(console.error);
					else message.channel.send(err.message).catch(console.error);
				}
				break;
			}
			case "solve": {
				const expression = args
					? args.slice(1).join(" ").replace(/,\s?.$/, "")
					: options[0].options[0].value;
				const variable = args
					? (args.join(" ").match(/,\s?(.)$/) || [])[1] || "x"
					: options[0].options[2] ? options[0].options[2].value : "x";

				try {
					const equation = parse(expression);
					const result = equation.solveFor(variable);
					message.channel.send(`\`\`\`\n${equation.toString()}\n${variable} = ${(result || "No Solution").toString()}\n\`\`\``).catch(console.error);
				} catch (err) {
					if (err.name === "SyntaxError") message.reply("syntaxe incorrecte").catch(console.error);
					else message.channel.send(err.message).catch(console.error);
				}
				break;
			}
			case "derivative": {
				const expression = args
					? args.slice(1).join(" ").replace(/,\s?.$/, "")
					: options[0].options[0].value;
				const variable = args
					? (args.join(" ").match(/,\s?(.)$/) || [])[1] || "x"
					: options[0].options[1] ? options[0].options[1].value : "x";
				
				try {
					const parsedExp = math.parse(expression);
					const derivative = math.derivative(expression, variable, { simplify: true });
					message.channel.send(`\`\`\`\nf(${variable}) = ${parsedExp.toString()}\nf'(${variable}) = ${derivative.toString()}\n\`\`\``).catch(console.error);
				} catch (err) {
					if (err.name === "SyntaxError") message.reply("syntaxe incorrecte").catch(console.error);
					else message.channel.send(err.message).catch(console.error);
				}
				break;
			}
			default:
				message.reply("arguments incorrects").catch(console.error);
		}
	}
};

module.exports = command;