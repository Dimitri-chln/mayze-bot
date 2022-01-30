"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mathjs_1 = __importDefault(require("mathjs"));
var algebra_js_1 = __importDefault(require("algebra.js"));
var command = {
    name: "math",
    description: {
        fr: "Effectuer des calculs mathématiques",
        en: "Perform mathematical calculations"
    },
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
                        required: true
                    }
                ]
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
                        required: true
                    },
                    {
                        name: "variable",
                        description: "La variable à déterminer",
                        type: "STRING",
                        required: false
                    }
                ]
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
                        required: true
                    },
                    {
                        name: "variable",
                        description: "La varibale selon laquelle dériver",
                        type: "STRING",
                        required: false
                    }
                ]
            }
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
                        required: true
                    }
                ]
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
                        required: true
                    },
                    {
                        name: "variable",
                        description: "The variable to be determined",
                        type: "STRING",
                        required: false
                    }
                ]
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
                        required: true
                    },
                    {
                        name: "variable",
                        description: "The variable for which to find the derivative",
                        type: "STRING",
                        required: false
                    }
                ]
            }
        ]
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        var subCommand, expression, parsedExpression, result, expression, variable, equation, result, resultString, expression, variable, parsedExpression, derivative;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            subCommand = interaction.options.getSubcommand();
            switch (subCommand) {
                case "evaluate": {
                    expression = interaction.options.getString("expression");
                    try {
                        parsedExpression = mathjs_1.default.parse(expression);
                        result = parsedExpression.evaluate();
                        interaction.reply("```\n" + parsedExpression.toString() + "\n= " + result.toString() + "\n```");
                    }
                    catch (err) {
                        interaction.reply({
                            content: translations.data.syntax_error(err.message),
                            ephemeral: true
                        });
                    }
                    break;
                }
                case "solve": {
                    expression = interaction.options.getString("expression");
                    variable = (_a = interaction.options.getString("variable")) !== null && _a !== void 0 ? _a : "x";
                    try {
                        equation = algebra_js_1.default.parse(expression);
                        result = equation.solveFor(variable);
                        resultString = Array.isArray(result)
                            ? result.join(", ")
                            : result.toString();
                        interaction.reply("```\n" + equation.toString() + "\n" + variable + " = " + ((_b = resultString.toString()) !== null && _b !== void 0 ? _b : translations.data.no_solution()) + "\n```");
                    }
                    catch (err) {
                        interaction.reply({
                            content: translations.data.syntax_error(err.message),
                            ephemeral: true
                        });
                    }
                    break;
                }
                case "derivative": {
                    expression = interaction.options.getString("expression");
                    variable = (_c = interaction.options.getString("variable")) !== null && _c !== void 0 ? _c : "x";
                    try {
                        parsedExpression = mathjs_1.default.parse(expression);
                        derivative = mathjs_1.default.derivative(parsedExpression, variable);
                        interaction.reply("```\nf(" + variable + ") = " + parsedExpression.toString() + "\nf'(" + variable + ") = " + derivative.toString() + "\n```");
                    }
                    catch (err) {
                        interaction.reply({
                            content: translations.data.syntax_error(err.message),
                            ephemeral: true
                        });
                    }
                    break;
                }
            }
            return [2 /*return*/];
        });
    }); }
};
exports.default = command;
