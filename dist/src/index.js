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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var e_1, _a, e_2, _b, e_3, _c, e_4, _d, e_5, _e;
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = __importDefault(require("./Util"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var cron_1 = __importDefault(require("cron"));
var dotenv_1 = __importDefault(require("dotenv"));
var discord_js_1 = __importDefault(require("discord.js"));
var pg_1 = __importDefault(require("pg"));
var spotify_web_api_node_1 = __importDefault(require("spotify-web-api-node"));
var Translations_1 = __importDefault(require("./types/structures/Translations"));
var Color_1 = __importDefault(require("./types/canvas/Color"));
var Palette_1 = __importDefault(require("./types/canvas/Palette"));
var Canvas_1 = __importDefault(require("./types/canvas/Canvas"));
var runApplicationCommand_1 = __importDefault(require("./utils/misc/runApplicationCommand"));
var getLevel_1 = __importDefault(require("./utils/misc/getLevel"));
var MusicPlayer_1 = __importDefault(require("./utils/music/MusicPlayer"));
var MusicUtil_1 = __importDefault(require("./utils/music/MusicUtil"));
var getQueueDuration_1 = __importDefault(require("./utils/misc/getQueueDuration"));
dotenv_1.default.config();
var intents = new discord_js_1.default.Intents([
    discord_js_1.default.Intents.FLAGS.DIRECT_MESSAGES,
    discord_js_1.default.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    discord_js_1.default.Intents.FLAGS.GUILDS,
    discord_js_1.default.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    discord_js_1.default.Intents.FLAGS.GUILD_MEMBERS,
    discord_js_1.default.Intents.FLAGS.GUILD_MESSAGES,
    discord_js_1.default.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    discord_js_1.default.Intents.FLAGS.GUILD_PRESENCES,
    discord_js_1.default.Intents.FLAGS.GUILD_VOICE_STATES,
    discord_js_1.default.Intents.FLAGS.GUILD_WEBHOOKS
]);
var client = new discord_js_1.default.Client({
    intents: intents,
    presence: {
        activities: [
            {
                type: "WATCHING",
                name: "le meilleur clan"
            }
        ]
    },
    partials: ["MESSAGE", "CHANNEL", "REACTION"]
});
function newDatabaseClient() {
    var connectionString = {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.ENVIRONMENT === "PRODUCTION"
    };
    var database = new pg_1.default.Client(connectionString);
    database.on("error", function (err) {
        console.error(err);
        database.end().catch(console.error);
        newDatabaseClient();
    });
    return database;
}
function reconnectDatabase(database) {
    database.end().catch(console.error);
    database = newDatabaseClient();
    database.connect().then(function () {
        console.log("Connected to the database");
    }).catch(console.error);
}
Util_1.default.database = newDatabaseClient();
Util_1.default.database.connect().then(function () {
    console.log("Connected to the database");
    Util_1.default.database.query("SELECT * FROM languages").then(function (res) {
        var e_6, _a;
        try {
            for (var _b = __values(res.rows), _c = _b.next(); !_c.done; _c = _b.next()) {
                var row = _c.value;
                Util_1.default.languages.set(row.guild_id, row.language_code);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
    });
});
setInterval(function () { return reconnectDatabase(Util_1.default.database); }, 3600000);
var directories = fs_1.default.readdirSync(path_1.default.resolve(__dirname, "commands"), { withFileTypes: true })
    .filter(function (dirent) { return dirent.isDirectory() && dirent.name !== "disabled"; })
    .map(function (dirent) { return dirent.name; });
try {
    for (var directories_1 = __values(directories), directories_1_1 = directories_1.next(); !directories_1_1.done; directories_1_1 = directories_1.next()) {
        var directory = directories_1_1.value;
        var commandFiles = fs_1.default.readdirSync(path_1.default.resolve(__dirname, "commands", directory))
            .filter(function (file) { return file.endsWith(".js"); });
        try {
            for (var commandFiles_1 = (e_2 = void 0, __values(commandFiles)), commandFiles_1_1 = commandFiles_1.next(); !commandFiles_1_1.done; commandFiles_1_1 = commandFiles_1.next()) {
                var file = commandFiles_1_1.value;
                var path = path_1.default.resolve(__dirname, "commands", directory, file);
                var command_1 = require(path);
                command_1.category = directory;
                command_1.path = path;
                command_1.cooldowns = new discord_js_1.default.Collection();
                Util_1.default.commands.set(command_1.name, command_1);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (commandFiles_1_1 && !commandFiles_1_1.done && (_b = commandFiles_1.return)) _b.call(commandFiles_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (directories_1_1 && !directories_1_1.done && (_a = directories_1.return)) _a.call(directories_1);
    }
    finally { if (e_1) throw e_1.error; }
}
var messageResponseFiles = fs_1.default.readdirSync(path_1.default.resolve(__dirname, "responses"))
    .filter(function (file) { return file.endsWith(".js"); });
try {
    for (var messageResponseFiles_1 = __values(messageResponseFiles), messageResponseFiles_1_1 = messageResponseFiles_1.next(); !messageResponseFiles_1_1.done; messageResponseFiles_1_1 = messageResponseFiles_1.next()) {
        var file = messageResponseFiles_1_1.value;
        var messageResponse = require(path_1.default.resolve(__dirname, "responses", file));
        Util_1.default.messageResponses.push(messageResponse);
    }
}
catch (e_3_1) { e_3 = { error: e_3_1 }; }
finally {
    try {
        if (messageResponseFiles_1_1 && !messageResponseFiles_1_1.done && (_c = messageResponseFiles_1.return)) _c.call(messageResponseFiles_1);
    }
    finally { if (e_3) throw e_3.error; }
}
var reactionCommandsFiles = fs_1.default.readdirSync(path_1.default.resolve(__dirname, "reaction_commands"))
    .filter(function (file) { return file.endsWith(".js"); });
try {
    for (var reactionCommandsFiles_1 = __values(reactionCommandsFiles), reactionCommandsFiles_1_1 = reactionCommandsFiles_1.next(); !reactionCommandsFiles_1_1.done; reactionCommandsFiles_1_1 = reactionCommandsFiles_1.next()) {
        var file = reactionCommandsFiles_1_1.value;
        var reactionCommand = require(path_1.default.resolve(__dirname, "reaction_commands", file));
        Util_1.default.reactionCommands.push(reactionCommand);
    }
}
catch (e_4_1) { e_4 = { error: e_4_1 }; }
finally {
    try {
        if (reactionCommandsFiles_1_1 && !reactionCommandsFiles_1_1.done && (_d = reactionCommandsFiles_1.return)) _d.call(reactionCommandsFiles_1);
    }
    finally { if (e_4) throw e_4.error; }
}
try {
    for (var _f = __values(Util_1.default.commands.keys()), _g = _f.next(); !_g.done; _g = _f.next()) {
        var commandName = _g.value;
        Util_1.default.commandCooldowns.set(commandName, new discord_js_1.default.Collection());
    }
}
catch (e_5_1) { e_5 = { error: e_5_1 }; }
finally {
    try {
        if (_g && !_g.done && (_e = _f.return)) _e.call(_f);
    }
    finally { if (e_5) throw e_5.error; }
}
client.on("ready", function () { return __awaiter(void 0, void 0, void 0, function () {
    var logChannel, emojis, roseChannel, announcementChannel;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Connected to Discord");
                Util_1.default.client = client;
                Util_1.default.beta = client.user.id === Util_1.default.config.BETA_CLIENT_ID;
                logChannel = client.channels.cache.get(Util_1.default.config.LOG_CHANNEL_ID);
                logChannel.send({
                    embeds: [
                        {
                            author: {
                                name: "Mayze is starting...",
                                iconURL: client.user.displayAvatarURL()
                            },
                            color: 65793,
                            description: "\u2022 **Version:** `" + Util_1.default.version + "`\n\u2022 **Ping:** `" + client.ws.ping + "`",
                            footer: {
                                text: "✨ Mayze ✨"
                            },
                            timestamp: Date.now()
                        }
                    ]
                }).catch(console.error);
                client.users.fetch(Util_1.default.config.OWNER_ID).then(function (owner) { return Util_1.default.owner = owner; }).catch(console.error);
                // Slash commands
                return [4 /*yield*/, Promise.all(Util_1.default.commands.map(function (command) { return __awaiter(void 0, void 0, void 0, function () {
                        var applicationCommandData, applicationCommand, newApplicationCommand, err_1, _a, _b, guildId, _c, _d, guildId;
                        var e_7, _e, e_8, _f;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    applicationCommandData = {
                                        type: "CHAT_INPUT",
                                        name: command.name,
                                        description: command.description.en,
                                        options: command.options.en
                                    };
                                    applicationCommand = client.application.commands.cache.find(function (cmd) { return cmd.name === applicationCommandData.name; });
                                    if (!(command.category === "admin")) return [3 /*break*/, 7];
                                    _g.label = 1;
                                case 1:
                                    _g.trys.push([1, 6, , 7]);
                                    newApplicationCommand = void 0;
                                    if (!(applicationCommand && !applicationCommand.equals(applicationCommandData))) return [3 /*break*/, 3];
                                    console.log("Editing the admin application command /" + applicationCommandData.name);
                                    return [4 /*yield*/, client.application.commands.edit(applicationCommand.id, applicationCommandData, Util_1.default.config.ADMIN_GUILD_ID)];
                                case 2:
                                    newApplicationCommand = _g.sent();
                                    return [3 /*break*/, 5];
                                case 3:
                                    console.log("Creating the admin application command /" + applicationCommandData.name);
                                    return [4 /*yield*/, client.application.commands.create(applicationCommandData, Util_1.default.config.ADMIN_GUILD_ID)];
                                case 4:
                                    newApplicationCommand = _g.sent();
                                    _g.label = 5;
                                case 5:
                                    newApplicationCommand.permissions.set({
                                        permissions: [
                                            {
                                                id: applicationCommand.guild.id,
                                                type: "ROLE",
                                                permission: false
                                            },
                                            {
                                                id: Util_1.default.config.OWNER_ID,
                                                type: "USER",
                                                permission: true
                                            }
                                        ]
                                    });
                                    return [3 /*break*/, 7];
                                case 6:
                                    err_1 = _g.sent();
                                    console.error();
                                    return [3 /*break*/, 7];
                                case 7:
                                    // Guild commands
                                    if (command.guildIds) {
                                        if (applicationCommand && !applicationCommand.equals(applicationCommandData)) {
                                            console.log("Editing the application command /" + applicationCommandData.name + " in the guilds: " + command.guildIds.join(", "));
                                            try {
                                                for (_a = __values(command.guildIds), _b = _a.next(); !_b.done; _b = _a.next()) {
                                                    guildId = _b.value;
                                                    applicationCommandData.description = command.description[Util_1.default.languages.get(guildId)];
                                                    applicationCommandData.options = command.options[Util_1.default.languages.get(guildId)];
                                                    client.application.commands.edit(applicationCommand.id, applicationCommandData, guildId).catch(console.error);
                                                }
                                            }
                                            catch (e_7_1) { e_7 = { error: e_7_1 }; }
                                            finally {
                                                try {
                                                    if (_b && !_b.done && (_e = _a.return)) _e.call(_a);
                                                }
                                                finally { if (e_7) throw e_7.error; }
                                            }
                                        }
                                        else {
                                            console.log("Creating the application command /" + applicationCommandData.name + " in the guilds: " + command.guildIds.join(", "));
                                            try {
                                                for (_c = __values(command.guildIds), _d = _c.next(); !_d.done; _d = _c.next()) {
                                                    guildId = _d.value;
                                                    applicationCommandData.description = command.description[Util_1.default.languages.get(guildId)];
                                                    applicationCommandData.options = command.options[Util_1.default.languages.get(guildId)];
                                                    client.application.commands.create(applicationCommandData, guildId).catch(console.error);
                                                }
                                            }
                                            catch (e_8_1) { e_8 = { error: e_8_1 }; }
                                            finally {
                                                try {
                                                    if (_d && !_d.done && (_f = _c.return)) _f.call(_c);
                                                }
                                                finally { if (e_8) throw e_8.error; }
                                            }
                                        }
                                        // Global commands
                                    }
                                    else {
                                        if (applicationCommand && !applicationCommand.equals(applicationCommandData)) {
                                            console.log("Editing the global application command /" + applicationCommandData.name);
                                            client.application.commands.edit(applicationCommand.id, applicationCommandData).catch(console.error);
                                        }
                                        else {
                                            console.log("Creating the global application command /" + applicationCommandData.name);
                                            client.application.commands.create(applicationCommandData).catch(console.error);
                                        }
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })).catch(console.error)];
            case 1:
                // Slash commands
                _a.sent();
                emojis = client.guilds.cache.get(Util_1.default.config.CANVAS_GUILD_ID).emojis;
                Util_1.default.database.query("SELECT * FROM colors").then(function (_a) {
                    var colors = _a.rows;
                    return __awaiter(void 0, void 0, void 0, function () {
                        var _loop_1, colors_1, colors_1_1, color, e_9_1;
                        var e_9, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _loop_1 = function (color) {
                                        var emoji, red, green, blue, hex;
                                        return __generator(this, function (_d) {
                                            switch (_d.label) {
                                                case 0:
                                                    emoji = emojis.cache.find(function (e) { return e.name === "pl_" + color.alias; });
                                                    if (!!emoji) return [3 /*break*/, 2];
                                                    red = Math.floor(color.code / (256 * 256));
                                                    green = Math.floor((color.code % (256 * 256)) / 256);
                                                    blue = color.code % 256;
                                                    hex = red.toString(16).padStart(2, "0")
                                                        + green.toString(16).padStart(2, "0")
                                                        + blue.toString(16).padStart(2, "0");
                                                    return [4 /*yield*/, emojis.create("https://dummyimage.com/256/" + hex + "?text=+", "pl_" + color.alias)];
                                                case 1:
                                                    emoji = _d.sent();
                                                    _d.label = 2;
                                                case 2:
                                                    if (!Util_1.default.palettes.has(color.palette))
                                                        Util_1.default.palettes.set(color.palette, new Palette_1.default(color.palette));
                                                    Util_1.default.palettes.get(color.palette).add(new Color_1.default(color.name, color.alias, color.code, emoji));
                                                    return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 6, 7, 8]);
                                    colors_1 = __values(colors), colors_1_1 = colors_1.next();
                                    _c.label = 2;
                                case 2:
                                    if (!!colors_1_1.done) return [3 /*break*/, 5];
                                    color = colors_1_1.value;
                                    return [5 /*yield**/, _loop_1(color)];
                                case 3:
                                    _c.sent();
                                    _c.label = 4;
                                case 4:
                                    colors_1_1 = colors_1.next();
                                    return [3 /*break*/, 2];
                                case 5: return [3 /*break*/, 8];
                                case 6:
                                    e_9_1 = _c.sent();
                                    e_9 = { error: e_9_1 };
                                    return [3 /*break*/, 8];
                                case 7:
                                    try {
                                        if (colors_1_1 && !colors_1_1.done && (_b = colors_1.return)) _b.call(colors_1);
                                    }
                                    finally { if (e_9) throw e_9.error; }
                                    return [7 /*endfinally*/];
                                case 8:
                                    emojis.cache.forEach(function (e) {
                                        if (!colors.some(function (c) { return "pl_" + c.alias === e.name; }))
                                            e.delete().catch(console.error);
                                    });
                                    Util_1.default.database.query("SELECT name FROM canvas").then(function (res) {
                                        var e_10, _a;
                                        try {
                                            for (var _b = __values(res.rows), _c = _b.next(); !_c.done; _c = _b.next()) {
                                                var row = _c.value;
                                                var canvas = new Canvas_1.default(row.name, client, Util_1.default.database, Util_1.default.palettes);
                                                Util_1.default.canvas.set(canvas.name, canvas);
                                            }
                                        }
                                        catch (e_10_1) { e_10 = { error: e_10_1 }; }
                                        finally {
                                            try {
                                                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                                            }
                                            finally { if (e_10) throw e_10.error; }
                                        }
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                if (Util_1.default.beta)
                    return [2 /*return*/];
                // Predefined reminders
                testReminders();
                roseChannel = client.channels.cache.get(Util_1.default.config.ROSE_LOBBY_LOG_CHANNEL_ID);
                announcementChannel = client.channels.cache.get(Util_1.default.config.ROSE_LOBBY_ANNOUNCEMENT_CHANNEL_ID);
                roseChannel.messages.fetch({ limit: 1 })
                    .then(function (_a) {
                    var _b;
                    var _c = __read(_a, 1), _d = __read(_c[0], 2), logMessage = _d[1];
                    var regex = /^\*\*Starting at:\*\* `(.*)`\n\*\*Password:\*\* `(.*)`$/;
                    var _e = __read((_b = logMessage.content.match(regex)) !== null && _b !== void 0 ? _b : [], 3), dateString = _e[1], password = _e[2];
                    var date = new Date(dateString);
                    if (!date || !password)
                        return;
                    if (Util_1.default.roseLobby)
                        Util_1.default.roseLobby.stop();
                    Util_1.default.roseLobby = new cron_1.default.CronJob(date, function () {
                        announcementChannel.send("<@&" + Util_1.default.config.ROSE_LOBBY_ROLE_ID + ">\nLa game de roses va d\u00E9marrer, le mot de passe est `" + password + "`").catch(console.error);
                        logMessage.edit("~~" + logMessage.content + "~~").catch(console.error);
                    });
                    Util_1.default.roseLobby.start();
                    console.log("Restarted rose lobby at " + date.toUTCString() + " with password " + password);
                }).catch(console.error);
                // Reminders, trade blocks and mutes
                setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
                    var reminders, blocks, err_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM reminders")];
                            case 1:
                                reminders = (_a.sent()).rows;
                                return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM trade_block WHERE expires_at IS NOT NULL")];
                            case 2:
                                blocks = (_a.sent()).rows;
                                // Reminders
                                reminders.forEach(function (reminder) { return __awaiter(void 0, void 0, void 0, function () {
                                    var timestamp;
                                    return __generator(this, function (_a) {
                                        timestamp = new Date(reminder.timestamp).valueOf();
                                        if (Date.now() > timestamp) {
                                            client.users.fetch(reminder.user_id).then(function (user) {
                                                user.send("\u23F0 | " + reminder.content).catch(console.error);
                                            }).catch(console.error);
                                            Util_1.default.database.query("DELETE FROM reminders WHERE id = $1", [reminder.id]).catch(console.error);
                                        }
                                        return [2 /*return*/];
                                    });
                                }); });
                                // Trade blocks
                                blocks.forEach(function (block) { return __awaiter(void 0, void 0, void 0, function () {
                                    var timestamp;
                                    return __generator(this, function (_a) {
                                        timestamp = new Date(block.expires_at).valueOf();
                                        if (Date.now() > timestamp) {
                                            Util_1.default.database.query("DELETE FROM trade_block WHERE id = $1", [block.id]).catch(console.error);
                                        }
                                        return [2 /*return*/];
                                    });
                                }); });
                                return [3 /*break*/, 4];
                            case 3:
                                err_2 = _a.sent();
                                console.error(err_2);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); }, 10000);
                // Voice xp
                setInterval(function () {
                    client.guilds.cache.forEach(function (guild) { return __awaiter(void 0, void 0, void 0, function () {
                        var translations;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, new Translations_1.default("index_levels", Util_1.default.languages.get(guild.id)).init()];
                                case 1:
                                    translations = _a.sent();
                                    guild.members.cache.filter(function (m) { return m.voice.channelId && !m.user.bot; }).forEach(function (member) { return __awaiter(void 0, void 0, void 0, function () {
                                        var newXp, _a, xp, levelInfo, err_3;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    if (member.voice.channel.members.size < 2)
                                                        return [2 /*return*/];
                                                    newXp = Util_1.default.config.BASE_VOICE_XP * member.voice.channel.members.filter(function (m) { return !m.user.bot; }).size;
                                                    if (member.voice.deaf)
                                                        newXp *= 0;
                                                    if (member.voice.mute)
                                                        newXp *= 0.5;
                                                    if (member.voice.streaming && member.voice.channel.members.filter(function (m) { return !m.user.bot; }).size > 1)
                                                        newXp *= 3;
                                                    if (member.voice.selfVideo && member.voice.channel.members.filter(function (m) { return !m.user.bot; }).size > 1)
                                                        newXp *= 5;
                                                    _b.label = 1;
                                                case 1:
                                                    _b.trys.push([1, 3, , 4]);
                                                    return [4 /*yield*/, Util_1.default.database.query("\n\t\t\t\t\t\tINSERT INTO levels (user_id, voice_xp) VALUES ($1, $2)\n\t\t\t\t\t\tON CONFLICT (user_id)\n\t\t\t\t\t\tDO UPDATE SET\n\t\t\t\t\t\t\tvoice_xp = levels.voice_xp + $2 WHERE levels.user_id = $1\n\t\t\t\t\t\tRETURNING levels.voice_xp\n\t\t\t\t\t\t", [member.user.id, newXp])];
                                                case 2:
                                                    _a = __read.apply(void 0, [(_b.sent()).rows, 1]), xp = _a[0].voice_xp;
                                                    levelInfo = (0, getLevel_1.default)(xp);
                                                    if (levelInfo.currentXP < newXp && member.guild.id === Util_1.default.config.MAIN_GUILD_ID)
                                                        member.user.send(translations.data.voice_level_up(translations.language, levelInfo.level.toString()));
                                                    return [3 /*break*/, 4];
                                                case 3:
                                                    err_3 = _b.sent();
                                                    console.error(err_3);
                                                    return [3 /*break*/, 4];
                                                case 4: return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }, 60000);
                return [2 /*return*/];
        }
    });
}); });
client.on("interactionCreate", function (interaction) { return __awaiter(void 0, void 0, void 0, function () {
    var command_2;
    return __generator(this, function (_a) {
        switch (interaction.type) {
            case "PING": {
                break;
            }
            case "APPLICATION_COMMAND": {
                if (interaction.isCommand()) {
                    command_2 = Util_1.default.commands.get(interaction.commandName);
                    if (Util_1.default.channelCooldowns.get(interaction.channel.id))
                        return [2 /*return*/];
                    if (command_2)
                        (0, runApplicationCommand_1.default)(command_2, interaction).catch(console.error);
                }
                if (interaction.isContextMenu()) {
                    // Run
                }
                break;
            }
            case "APPLICATION_COMMAND_AUTOCOMPLETE": {
                break;
            }
            case "MESSAGE_COMPONENT": {
                break;
            }
        }
        return [2 /*return*/];
    });
}); });
client.on("messageCreate", function (message) { return __awaiter(void 0, void 0, void 0, function () {
    var translations, bots, prefixes, newXP, _a, xp, levelInfo, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (Util_1.default.beta)
                    return [2 /*return*/];
                return [4 /*yield*/, new Translations_1.default("index_levels", Util_1.default.languages.get(message.guild.id)).init()];
            case 1:
                translations = _b.sent();
                if (!(message.channel.type !== "DM"
                    && !message.author.bot
                    && !message.channel.name.includes("spam")
                    && message.channel.id !== "865997369745080341") // #tki
                ) return [3 /*break*/, 6]; // #tki
                return [4 /*yield*/, message.guild.members.fetch().catch(console.error)];
            case 2:
                bots = _b.sent();
                if (!bots) return [3 /*break*/, 6];
                prefixes = bots.map(function (bot) {
                    var _a;
                    var _b = __read((_a = bot.displayName.match(/\[(.+)\]/)) !== null && _a !== void 0 ? _a : [], 2), prefix = _b[1];
                    return prefix;
                }).filter(function (p) { return p; });
                if (!!prefixes.some(function (p) { return message.content.toLowerCase().startsWith(p); })) return [3 /*break*/, 6];
                if (!Util_1.default.xpMessages.has(message.author.id)) {
                    Util_1.default.xpMessages.set(message.author.id, 0);
                    setTimeout(function () {
                        Util_1.default.xpMessages.delete(message.author.id);
                    }, 60000);
                }
                newXP = Math.round(Math.sqrt(message.content.length) * Util_1.default.config.XP_MULTIPLIER / Util_1.default.xpMessages.get(message.author.id));
                Util_1.default.xpMessages.set(message.author.id, Util_1.default.xpMessages.get(message.author.id) + 1);
                _b.label = 3;
            case 3:
                _b.trys.push([3, 5, , 6]);
                return [4 /*yield*/, Util_1.default.database.query("\n\t\t\t\t\t\tINSERT INTO levels (user_id, chat_xp) VALUES ($1, $2)\n\t\t\t\t\t\tON CONFLICT (user_id)\n\t\t\t\t\t\tDO UPDATE SET\n\t\t\t\t\t\t\tchat_xp = levels.chat_xp + $2 WHERE levels.user_id = $1\n\t\t\t\t\t\tRETURNING levels.chat_xp\n\t\t\t\t\t\t", [message.author.id, newXP])];
            case 4:
                _a = __read.apply(void 0, [(_b.sent()).rows, 1]), xp = _a[0].chat_xp;
                levelInfo = (0, getLevel_1.default)(xp);
                if (levelInfo.currentXP < newXP && message.guild.id === Util_1.default.config.MAIN_GUILD_ID)
                    message.channel.send(translations.data.chat_level_up(translations.language, message.author.toString(), levelInfo.level.toString()));
                return [3 /*break*/, 6];
            case 5:
                err_4 = _b.sent();
                console.error(err_4);
                return [3 /*break*/, 6];
            case 6:
                // Message responses
                Util_1.default.messageResponses.forEach(function (messageResponse) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                    return [2 /*return*/, messageResponse.run(message).catch(console.error)];
                }); }); });
                return [2 /*return*/];
        }
    });
}); });
client.on("messageDelete", function (message) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (message.partial)
            return [2 /*return*/];
        if (message.author.bot)
            return [2 /*return*/];
        Util_1.default.sniping.deletedMessages.set(message.channel.id, message);
        setTimeout(function () {
            Util_1.default.sniping.deletedMessages.delete(message.channel.id);
        }, 600000);
        return [2 /*return*/];
    });
}); });
client.on("messageUpdate", function (message, newMessage) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (message.partial)
            return [2 /*return*/];
        if (message.author.bot)
            return [2 /*return*/];
        Util_1.default.sniping.editedMessages.set(message.channel.id, message);
        setTimeout(function () {
            Util_1.default.sniping.editedMessages.delete(message.channel.id);
        }, 600000);
        return [2 /*return*/];
    });
}); });
client.on("messageReactionAdd", function (reaction, user) { return __awaiter(void 0, void 0, void 0, function () {
    var err_5, _a, _b, reactionCommand;
    var e_11, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                if (!reaction.partial) return [3 /*break*/, 2];
                return [4 /*yield*/, reaction.fetch()];
            case 1:
                _d.sent();
                _d.label = 2;
            case 2:
                if (!reaction.message.partial) return [3 /*break*/, 4];
                return [4 /*yield*/, reaction.message.fetch()];
            case 3:
                _d.sent();
                _d.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                err_5 = _d.sent();
                console.error(err_5);
                return [3 /*break*/, 6];
            case 6:
                if (reaction.partial || reaction.message.partial)
                    return [2 /*return*/];
                if (user.bot)
                    return [2 /*return*/];
                try {
                    for (_a = __values(Util_1.default.reactionCommands), _b = _a.next(); !_b.done; _b = _a.next()) {
                        reactionCommand = _b.value;
                        reactionCommand.run(reaction, user, true)
                            .catch(console.error);
                    }
                }
                catch (e_11_1) { e_11 = { error: e_11_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_11) throw e_11.error; }
                }
                return [2 /*return*/];
        }
    });
}); });
client.on("messageReactionRemove", function (reaction, user) { return __awaiter(void 0, void 0, void 0, function () {
    var err_6, _a, _b, reactionCommand;
    var e_12, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                if (!reaction.message.partial) return [3 /*break*/, 2];
                return [4 /*yield*/, reaction.message.fetch()];
            case 1:
                _d.sent();
                _d.label = 2;
            case 2: return [3 /*break*/, 4];
            case 3:
                err_6 = _d.sent();
                console.error(err_6);
                return [3 /*break*/, 4];
            case 4:
                if (reaction.partial || reaction.message.partial)
                    return [2 /*return*/];
                if (user.bot)
                    return [2 /*return*/];
                try {
                    for (_a = __values(Util_1.default.reactionCommands), _b = _a.next(); !_b.done; _b = _a.next()) {
                        reactionCommand = _b.value;
                        reactionCommand.run(reaction, user, false)
                            .catch(console.error);
                    }
                }
                catch (e_12_1) { e_12 = { error: e_12_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_12) throw e_12.error; }
                }
                Util_1.default.sniping.messageReactions.set(reaction.message.channel.id, {
                    reaction: reaction,
                    user: user
                });
                setTimeout(function () {
                    Util_1.default.sniping.messageReactions.delete(reaction.message.channel.id);
                }, 60000);
                return [2 /*return*/];
        }
    });
}); });
client.on("guildMemberAdd", function (member) { return __awaiter(void 0, void 0, void 0, function () {
    var roleIds, _a, memberRoles, err_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (member.guild.id !== Util_1.default.config.MAIN_GUILD_ID)
                    return [2 /*return*/];
                if (member.user.bot)
                    return [2 /*return*/];
                roleIds = ["735809874205737020", "735810286719598634", "735810462872109156", "759694957132513300"];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Util_1.default.database.query("SELECT * FROM member_roles WHERE user_id = $1", [member.user.id])];
            case 2:
                _a = __read.apply(void 0, [(_b.sent()).rows, 1]), memberRoles = _a[0];
                if (memberRoles) {
                    roleIds = roleIds.concat(memberRoles.roles);
                }
                else {
                    member.user.send({
                        embeds: [
                            {
                                author: {
                                    name: member.user.tag,
                                    iconURL: client.user.displayAvatarURL()
                                },
                                thumbnail: {
                                    url: member.user.displayAvatarURL({ dynamic: true })
                                },
                                title: "Bienvenue sur Mayze !",
                                color: member.guild.me.displayColor,
                                description: "Amuse-toi bien sur le serveur 😉",
                                footer: {
                                    text: "✨ Mayze ✨"
                                }
                            }
                        ]
                    }).catch(console.error);
                }
                return [3 /*break*/, 4];
            case 3:
                err_7 = _b.sent();
                console.error(err_7);
                return [3 /*break*/, 4];
            case 4:
                member.roles.add(roleIds.map(function (roleId) { return member.guild.roles.cache.get(roleId); })).catch(console.error);
                return [2 /*return*/];
        }
    });
}); });
client.on("guildMemberUpdate", function (member, newMember) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (newMember.guild.id !== Util_1.default.config.MAIN_GUILD_ID)
            return [2 /*return*/];
        if (newMember.user.bot)
            return [2 /*return*/];
        if (!member.roles.cache.equals(newMember.roles.cache)) {
            Util_1.default.database.query("\n\t\t\tINSERT INTO member_roles VALUES ($1, $2)\n\t\t\tON CONFLICT (user_id)\n\t\t\tDO UPDATE SET roles = $2\n\t\t\tWHERE member_roles.user_id = EXCLUDED.user_id\n\t\t\t", [member.user.id, member.roles.cache.filter(function (role) { return role.id !== member.guild.id; }).map(function (role) { return role.id; })]).catch(console.error);
        }
        return [2 /*return*/];
    });
}); });
client.on("error", function (err) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.error(err);
        return [2 /*return*/];
    });
}); });
client.login(process.env.TOKEN);
// Music module 
Util_1.default.musicPlayer = new MusicPlayer_1.default(client);
client.on("voiceStateUpdate", function (oldState, newState) {
    var queue = Util_1.default.musicPlayer.get(oldState.guild.id);
    if (queue && oldState.channel.id === queue.voiceChannel.id) {
        setTimeout(function () {
            if (queue.voiceChannel.members.size <= 1)
                queue.stop();
        }, 900000);
    }
});
Util_1.default.musicPlayer
    .on("clientDisconnect", function (message, queue) {
    var language = Util_1.default.languages.get(message.guild.id);
    var translations = new Translations_1.default(__filename, language);
    message.channel.send(translations.data.music_player_disconnect(queue.connection.channel.toString())).catch(console.error);
})
    .on("error", function (error, message) {
    var language = Util_1.default.languages.get(message.guild.id);
    var translations = new Translations_1.default(__filename, language);
    console.error(error);
    message.channel.send(translations.data.music_player_error(error.toString())).catch(console.error);
})
    .on("playlistAdd", function (message, queue, playlist) {
    var language = Util_1.default.languages.get(message.guild.id);
    var translations = new Translations_1.default(__filename, language);
    message.channel.send(translations.data.music_player_add_playlist(playlist.videoCount.toString())).catch(console.error);
})
    .on("queueEnd", function (message, queue) {
    var language = Util_1.default.languages.get(message.guild.id);
    var translations = new Translations_1.default(__filename, language);
    var songDisplays = Util_1.default.songDisplays.filter(function (songDisplay) { return songDisplay.guild.id === message.guild.id; });
    var lastSong = queue.songs[0];
    if (!lastSong)
        return;
    songDisplays.forEach(function (songDisplay) {
        songDisplay.edit({
            embeds: [
                songDisplay.embeds[0]
                    .setDescription(translations.data.song_display_description(lastSong.name.toString(), lastSong.url.toString(), MusicUtil_1.default.buildBar(MusicUtil_1.default.timeToMilliseconds(lastSong.duration), MusicUtil_1.default.timeToMilliseconds(lastSong.duration), 20, "━", "🔘"), lastSong.requestedBy, "Ø", "**0:00**"))
                    .setFooter(translations.data.song_display_footer_end(language))
            ]
        }).catch(console.error);
    });
})
    .on("songAdd", function (message, queue, song) {
    var language = Util_1.default.languages.get(message.guild.id);
    var translations = new Translations_1.default(__filename, language);
    message.channel.send(translations.data.music_player_add_song(((0, getQueueDuration_1.default)(queue) ? MusicUtil_1.default.millisecondsToTime(MusicUtil_1.default.timeToMilliseconds((0, getQueueDuration_1.default)(queue)) - MusicUtil_1.default.timeToMilliseconds(song.duration)) : 0).toString(), song.name)).catch(console.error);
})
    .on("songChanged", function (message, newSong, OldSong) {
    var language = Util_1.default.languages.get(message.guild.id);
    var translations = new Translations_1.default(__filename, language);
    var songDisplays = Util_1.default.songDisplays.filter(function (songDisplay) { return songDisplay.guild.id === message.guild.id; });
    songDisplays.forEach(function (songDisplay) {
        songDisplay.edit({
            embeds: [
                songDisplay.embeds[0]
                    .setDescription(translations.data.song_display_description(newSong.name.toString(), newSong.url.toString(), MusicUtil_1.default.buildBar(0, MusicUtil_1.default.timeToMilliseconds(newSong.duration), 20, "━", "🔘"), newSong.requestedBy, newSong.queue.repeatMode
                    ? newSong.name.toString()
                    : (newSong.queue.songs[1]
                        ? newSong.queue.songs[1].name.toString()
                        : (newSong.queue.repeatQueue ? newSong.queue.songs[0].name.toString() : "Ø")), newSong.queue.repeatMode || newSong.queue.repeatQueue ? "♾️" : (0, getQueueDuration_1.default)(newSong.queue).toString()))
                    .setFooter(translations.data.song_display_footer(language, Boolean(newSong.queue.repeatMode), Boolean(newSong.queue.repeatQueue)))
            ]
        }).catch(console.error);
    });
})
    .on("songFirst", function (message, song) {
    var language = Util_1.default.languages.get(message.guild.id);
    var translations = new Translations_1.default(__filename, language);
    message.channel.send(translations.data.music_player_playing(song.name.toString())).catch(console.error);
});
setInterval(function () {
    Util_1.default.songDisplays.forEach(function (songDisplay) {
        var language = Util_1.default.languages.get(songDisplay.guild.id);
        var translations = new Translations_1.default(__filename, language);
        if (!player.isPlaying(songDisplay))
            return Util_1.default.songDisplays.delete(songDisplay.channel.id);
        var song = player.nowPlaying(songDisplay);
        songDisplay.edit({
            embeds: [
                songDisplay.embeds[0]
                    .setDescription(translations.data.song_display_description(song.name.toString(), song.url.toString(), Util_1.default.player.createProgressBar(songDisplay, { size: 20, arrow: "🔘", block: "━" }).toString(), song.requestedBy, song.queue.repeatMode
                    ? song.name.toString()
                    : (song.queue.songs[1]
                        ? song.queue.songs[1].name.toString()
                        : (song.queue.repeatQueue ? song.queue.songs[0].name.toString() : "Ø")), song.queue.repeatMode || song.queue.repeatQueue ? "♾️" : (0, getQueueDuration_1.default)(song.queue).toString()))
                    .setFooter(translations.data.song_display_footer(language, Boolean(song.queue.repeatMode), Boolean(song.queue.repeatQueue)))
            ]
        }).catch(console.error);
    });
}, 10000);
// Spotify API
var spotify = new spotify_web_api_node_1.default({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});
Util_1.default.spotify = spotify;
(function getSpotifyToken() {
    spotify.clientCredentialsGrant()
        .then(function (data) {
        spotify.setAccessToken(data.body.access_token);
        // Refresh the token 60s before the current one expires
        setTimeout(getSpotifyToken, (data.body.expires_in - 60) * 1000);
    });
})();
// Predefined reminders
function testReminders() {
    var userIds = ["408671348005797898", "463358584583880704", "608623753399762964"];
    var wednesday = new cron_1.default.CronJob("0 45 15 * * 3", function () {
        userIds.forEach(function (userId) { return client.users.fetch(userId).then(function (u) { return u.send(getMessage(15)).catch(console.error); }); });
        setTimeout(function () { return userIds.forEach(function (userId) { return client.users.cache.get(userId).send(getMessage(5)).catch(console.error); }); }, 600000);
        setTimeout(function () { return userIds.forEach(function (userId) { return client.users.cache.get(userId).send(getMessage(2)).catch(console.error); }); }, 780000);
    }, null, true, null, null, false, 0);
    var sunday = new cron_1.default.CronJob("0 45 13 * * 0", function () {
        userIds.forEach(function (userId) { return client.users.fetch(userId).then(function (userId) { return userId.send(getMessage(15)).catch(console.error); }); });
        setTimeout(function () { return userIds.forEach(function (userId) { return client.users.cache.get(userId).send(getMessage(5)).catch(console.error); }); }, 600000);
        setTimeout(function () { return userIds.forEach(function (userId) { return client.users.cache.get(userId).send(getMessage(2)).catch(console.error); }); }, 780000);
    }, null, true, null, null, false, 0);
    return { wednesday: wednesday, sunday: sunday };
    function getMessage(minutes) {
        return "Test in " + minutes + " minute" + (minutes > 1 ? "s" : "") + "! <t:" + (Math.round(Date.now() / 1000) + 60 * minutes) + ":F>\nIn <#463399799807410176>, **Wednesday 6pm CEST and Sunday 4pm CEST**";
    }
}
// import pokedex from "oakdex-pokedex";
// import legendaries from "./assets/legendaries.json";
// import beasts from "./assets/ultra-beasts.json";
// const pokemons = pokedex.allPokemon()
//     .map(p => {
//         return {
//             names: {
// 				en: p.names.en,
// 				fr: p.names.fr
// 			},
//             national_id: p.national_id,
//             types: p.types,
//             abilities: p.abilities,
//             gender_ratios: p.gender_ratios,
//             catch_rate: p.catch_rate,
//             height_eu: p.height_eu,
//             height_us: p.height_us,
//             weight_eu: p.weight_eu,
//             weight_us: p.weight_us,
//             color: p.color,
//             base_stats: p.base_stats,
//             evolution_from: p.evolution_from,
//             evolutions: p.evolutions.map(evo => evo.to),
//             mega_evolutions: p.mega_evolutions.map(mega_evolution => {
// 				return {
// 					suffix: mega_evolution.image_suffix ?? "mega",
// 					types: mega_evolution.types,
// 					ability: mega_evolution.ability,
// 					mega_stone: mega_evolution.mega_stone,
// 					height_eu: mega_evolution.height_eu,
// 					height_us: mega_evolution.height_us,
// 					weight_eu: mega_evolution.weight_eu,
// 					weight_us: mega_evolution.weight_us,
// 					base_stats: mega_evolution.base_stats
// 				}
// 			}),
//             variations: p.variations.map(variation => {
// 				return {
// 					suffix: variation.image_suffix,
// 					names: variation.names,
// 					types: variation.types,
// 					abilitites: variation.abilities
// 				}
// 			}),
//             legendary: legendaries.includes(p.names.en),
//             ultra_beast: beasts.includes(p.names.en)
//         }
//     })
//     .sort((a, b) => a.national_id - b.national_id);
// Fs.writeFileSync(
//     Path.resolve(__dirname, "assets", "pokemons.json"),
//     JSON.stringify(pokemons, null, 4)
// );
