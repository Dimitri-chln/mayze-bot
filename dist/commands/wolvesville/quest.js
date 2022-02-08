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
    name: "quest",
    description: {
        fr: "Afficher un message de vote pour les quêtes Wolvesville",
        en: "Display a voting message for Wolvesville quests"
    },
    userPermissions: [],
    botPermissions: ["EMBED_LINKS", "ADD_REACTIONS"],
    guildIds: ["689164798264606784"],
    options: {
        fr: [
            {
                name: "votes",
                description: "Le nombre de quêtes du vote",
                type: "INTEGER",
                required: false,
                minValue: 0,
                maxValue: 10
            },
            {
                name: "single",
                description: "Si chaque membre dispose d'un seul vote ou non",
                type: "BOOLEAN",
                required: false
            }
        ],
        en: [
            {
                name: "votes",
                description: "The number of quests",
                type: "INTEGER",
                required: false,
                minValue: 0,
                maxValue: 10
            },
            {
                name: "single",
                description: "Whether each member only has one vote or not",
                type: "BOOLEAN",
                required: false
            }
        ]
    },
    run: function (interaction, translations) { return __awaiter(void 0, void 0, void 0, function () {
        var questChannel, filter, collected, imageURL, votes, reactions, msg;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!interaction.member.roles.cache.has("696751852267765872") && // Chef
                        !interaction.member.roles.cache.has("696751614177837056") // Sous-chef
                    )
                        return [2 /*return*/, interaction.followUp({
                                content: translations.data.not_allowed(),
                                ephemeral: true
                            })];
                    if (!["707304882662801490", "689212233439641649"].includes(interaction.channel.id))
                        return [2 /*return*/, interaction.followUp({
                                content: translations.data.wrong_channel(),
                                ephemeral: true
                            })];
                    questChannel = interaction.client.channels.cache.get("689385764219387905");
                    interaction.followUp(translations.data.await_image());
                    filter = function (msg) { return msg.author.id === interaction.user.id && msg.attachments.size === 1; };
                    return [4 /*yield*/, interaction.channel.awaitMessages({ filter: filter, idle: 120000, max: 1 })];
                case 1:
                    collected = _b.sent();
                    if (!collected.size)
                        return [2 /*return*/];
                    imageURL = collected.first().attachments.first().url;
                    votes = interaction.options.getBoolean("single") ? "Un seul vote" : "Plusieurs votes";
                    reactions = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"]
                        .slice(0, (_a = interaction.options.getInteger("votes")) !== null && _a !== void 0 ? _a : 3);
                    return [4 /*yield*/, questChannel.send({
                            content: "<@&689169027922526235>",
                            embeds: [
                                {
                                    title: translations.data.title(),
                                    color: interaction.guild.me.displayColor,
                                    image: {
                                        url: imageURL
                                    },
                                    footer: {
                                        text: votes
                                    }
                                }
                            ]
                        })];
                case 2:
                    msg = _b.sent();
                    reactions.forEach(function (e) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, msg.react(e).catch(console.error)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    }); }); });
                    return [4 /*yield*/, msg.react("🔄").catch(console.error)];
                case 3:
                    _b.sent();
                    collected.first().react("✅").catch(console.error);
                    return [2 /*return*/];
            }
        });
    }); }
};
exports.default = command;
