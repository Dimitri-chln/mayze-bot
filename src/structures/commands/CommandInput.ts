import Util from "../../Util";

import {
	BaseMessageOptions,
	ChatInputCommandInteraction,
	Client,
	Guild,
	GuildMember,
	GuildTextBasedChannel,
	Locale,
	Message,
	User,
} from "discord.js";

import Command from "./Command";

class BaseCommandInput {
	readonly client: Client;
	readonly member: GuildMember;
	readonly user: User;
	readonly channel: GuildTextBasedChannel;
	readonly guild: Guild;
	readonly bot: GuildMember;
	readonly locale: Locale;

	constructor(input: Message | ChatInputCommandInteraction) {
		this.client = input.client;
		this.member = input.member as GuildMember;
		this.user = this.member.user;
		this.channel = input.channel as GuildTextBasedChannel;
		this.guild = input.guild;
		this.bot = this.guild.members.me;
		this.locale = Util.guildConfigs.get(this.guild.id).locale ?? this.guild.preferredLocale;
	}
}

export class MessageCommandInput extends BaseCommandInput {
	readonly type: CommandInputType.Message;
	readonly message: Message;
	private _reply: Message;
	readonly command: Command;

	constructor(input: Message) {
		super(input);
		this.type = CommandInputType.Message;
		this.message = input;

		const inputCommandName = input.content.split(/\s+/)[0].substring(Util.prefix.length).toLowerCase();
		this.command = Util.commands.find(
			(cmd) =>
				cmd.name.default === inputCommandName ||
				cmd.name.localization.get(this.locale) === inputCommandName ||
				cmd.aliases.includes(inputCommandName),
		);
		if (!this.command) throw new Error("InvalidCommand");
	}

	async reply(options: string | BaseMessageOptions) {
		const reply = await this.message.reply(options);
		this._reply = reply;
		return reply;
	}

	async editReply(options: string | BaseMessageOptions) {
		return await this._reply.edit(options);
	}

	async deleteReply() {
		return await this._reply.delete();
	}
}

export class InteractionCommandInput extends BaseCommandInput {
	readonly type: CommandInputType.Interaction;
	readonly interaction: ChatInputCommandInteraction;
	readonly command: Command;

	constructor(input: ChatInputCommandInteraction) {
		super(input);
		this.type = CommandInputType.Interaction;
		this.interaction = input;

		this.command = Util.commands.get(input.commandName);
		if (!this.command) throw new Error("InvalidCommand");
	}

	async reply(options: string | BaseMessageOptions) {
		return await this.interaction.followUp(options);
	}

	async editReply(options: string | BaseMessageOptions) {
		return await this.interaction.editReply(options);
	}

	async deleteReply() {
		return await this.interaction.deleteReply();
	}
}

export type CommandInput = MessageCommandInput | InteractionCommandInput;

export enum CommandInputType {
	Message,
	Interaction,
}
