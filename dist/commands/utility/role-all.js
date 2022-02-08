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
Object.defineProperty(exports, "__esModule", { value: true });
var command = {
    name: "role-all",
    description: {
        fr: "Donner ou retirer un rôle à tous les membres",
        en: "Give or remove a role to all members"
    },
    cooldown: 10,
    userPermissions: ["MANAGE_ROLES"],
    botPermissions: ["MANAGE_ROLES"],
    options: {
        fr: [
            {
                name: "give",
                description: "Donner un rôle à tous les membres",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "role",
                        description: "Le rôle à donner",
                        type: "ROLE",
                        required: true
                    },
                    {
                        name: "option",
                        description: "Options pour donner le rôle",
                        type: "STRING",
                        required: false,
                        choices: [
                            {
                                name: "Bots uniquement",
                                value: "bot"
                            },
                            {
                                name: "Utilisateurs humains uniquement",
                                value: "human"
                            }
                        ]
                    }
                ]
            },
            {
                name: "remove",
                description: "Retirer un rôle de tous les membres",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "role",
                        description: "Le rôle à retirer",
                        type: "ROLE",
                        required: true
                    },
                    {
                        name: "option",
                        description: "Options pour retirer le rôle",
                        type: "STRING",
                        required: false,
                        choices: [
                            {
                                name: "Bots uniquement",
                                value: "bot"
                            },
                            {
                                name: "Utilisateurs humains uniquement",
                                value: "human"
                            }
                        ]
                    }
                ]
            }
        ],
        en: [
            {
                name: "give",
                description: "Give a role to all members",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "role",
                        description: "The role to give",
                        type: "ROLE",
                        required: true
                    },
                    {
                        name: "option",
                        description: "Options for giving the role",
                        type: "STRING",
                        required: false,
                        choices: [
                            {
                                name: "Bots only",
                                value: "bot"
                            },
                            {
                                name: "Human users only",
                                value: "human"
                            }
                        ]
                    }
                ]
            },
            {
                name: "remove",
                description: "Remove a role from all members",
                type: "SUB_COMMAND",
                options: [
                    {
                        name: "role",
                        description: "The role to remove",
                        type: "ROLE",
                        required: true
                    },
                    {
                        name: "option",
                        description: "Options for removing the role",
                        type: "STRING",
                        required: false,
                        choices: [
                            {
                                name: "Bots only",
                                value: "bot"
                            },
                            {
                                name: "Human users only",
                                value: "human"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        var subCommand, role, option, members, errors, _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    subCommand = interaction.options.getSubcommand();
                    role = interaction.options.getRole("role");
                    option = (_b = interaction.options.getString("option")) !== null && _b !== void 0 ? _b : "all";
                    members = interaction.guild.members.cache;
                    if (option === "bot")
                        members = members.filter(function (m) { return m.user.bot; });
                    if (option === "human")
                        members = members.filter(function (m) { return !m.user.bot; });
                    errors = 0;
                    interaction.followUp(translations.data.updating(members.size.toString(), members.size > 1));
                    _a = subCommand;
                    switch (_a) {
                        case "add": return [3 /*break*/, 1];
                        case "remove": return [3 /*break*/, 3];
                    }
                    return [3 /*break*/, 5];
                case 1:
                    members = members.filter(function (m) { return !m.roles.cache.has(role.id); });
                    return [4 /*yield*/, Promise.all(members.map(function (member) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, member.roles.add(role.id).catch(function (err) {
                                            ++errors;
                                            console.error(err);
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 2:
                    _c.sent();
                    return [3 /*break*/, 5];
                case 3:
                    members = members.filter(function (m) { return m.roles.cache.has(role.id); });
                    return [4 /*yield*/, Promise.all(members.map(function (member) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, member.roles.remove(role.id).catch(function (err) {
                                            ++errors;
                                            console.error(err);
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 4:
                    _c.sent();
                    return [3 /*break*/, 5];
                case 5:
                    interaction.editReply(translations.data.updated(members.size - errors === 0, members.size - errors === 1, members.size - errors > 1, (members.size - errors).toString(), errors.toString(), errors > 1));
                    return [2 /*return*/];
            }
        });
    }); }
};
module.exports = command;
