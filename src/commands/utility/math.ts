import { Message } from "discord.js";
import Command from "../../types/structures/Command";
import Util from "../../Util";

import Math from "mathjs";
import Algebra from "algebra.js";

const command: Command = {
	name: "math",
	aliases: [],
	description: {
		fr: "Effectuer des calculs mathématiques",
		en: "Perform mathematical calculations",
	},
	usage: "",
	userPermissions: [],
	botPermissions: [],

	options: {
		fr: [
			{
				name: "evaluate",
				description: "Évaluer une expression",
				type: "SUB_COMMAND",
				options: [
					{
						name: "expression",
						description: "L'expression à évaluer",
						type: "STRING",
						required: true,
					},
				],
			},
			{
				name: "solve",
				description: "Résoudre une équation algébrique",
				type: "SUB_COMMAND",
				options: [
					{
						name: "equation",
						description: "L'équation à résoudre",
						type: "STRING",
						required: true,
					},
					{
						name: "variable",
						description: "La variable à déterminer",
						type: "STRING",
						required: false,
					},
				],
			},
			{
				name: "derivative",
				description: "Dériver une expression",
				type: "SUB_COMMAND",
				options: [
					{
						name: "expression",
						description: "L'expression à dériver",
						type: "STRING",
						required: true,
					},
					{
						name: "variable",
						description: "La variable selon laquelle dériver",
						type: "STRING",
						required: false,
					},
				],
			},
		],
		en: [
			{
				name: "evaluate",
				description: "Evaluate an expression",
				type: "SUB_COMMAND",
				options: [
					{
						name: "expression",
						description: "The expression to evaluate",
						type: "STRING",
						required: true,
					},
				],
			},
			{
				name: "solve",
				description: "Solve an algebric equation",
				type: "SUB_COMMAND",
				options: [
					{
						name: "equation",
						description: "The equation to solve",
						type: "STRING",
						required: true,
					},
					{
						name: "variable",
						description: "The variable to be determined",
						type: "STRING",
						required: false,
					},
				],
			},
			{
				name: "derivative",
				description: "Find the derivative of an expression",
				type: "SUB_COMMAND",
				options: [
					{
						name: "expression",
						description: "The expression",
						type: "STRING",
						required: true,
					},
					{
						name: "variable",
						description: "The variable for which to find the derivative",
						type: "STRING",
						required: false,
					},
				],
			},
		],
	},

	runInteraction: async (interaction, translations) => {
		const subCommand = interaction.options.getSubcommand();

		switch (subCommand) {
			case "evaluate": {
				const expression = interaction.options.getString("expression", true);

				try {
					const parsedExpression = Math.parse(expression);
					const result = parsedExpression.evaluate();

					interaction.followUp(
						`\`\`\`\n${parsedExpression.toString()}\n= ${result.toString()}\n\`\`\``,
					);
				} catch (err) {
					console.error(err);
					interaction.followUp(translations.strings.syntax_error(err.message));
				}
				break;
			}

			case "solve": {
				const expression = interaction.options.getString("expression", true);
				const variable =
					interaction.options.getString("variable", false) ?? "x";

				try {
					const equation = Algebra.parse(expression) as Algebra.Equation;
					const result = equation.solveFor(variable);

					const resultString = Array.isArray(result)
						? result.join(", ")
						: result.toString();

					interaction.followUp(
						`\`\`\`\n${equation.toString()}\n${variable} = ${
							resultString.toString() ?? translations.strings.no_solution()
						}\n\`\`\``,
					);
				} catch (err) {
					console.error(err);
					interaction.followUp(translations.strings.syntax_error(err.message));
				}
				break;
			}

			case "derivative": {
				const expression = interaction.options.getString("expression", true);
				const variable =
					interaction.options.getString("variable", false) ?? "x";

				try {
					const parsedExpression = Math.parse(expression);
					const derivative = Math.derivative(parsedExpression, variable);

					interaction.followUp(
						`\`\`\`\nf(${variable}) = ${parsedExpression.toString()}\nf'(${variable}) = ${derivative.toString()}\n\`\`\``,
					);
				} catch (err) {
					interaction.followUp(translations.strings.syntax_error(err.message));
				}
				break;
			}
		}
	},
};

export default command;
