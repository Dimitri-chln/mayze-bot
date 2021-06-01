const { APIMessage, MessageEmbed, MessageFlags, Util, Message, GuildMember } = require("discord.js");


APIMessage.prototype.makeContent = function() {
	let content;
	if (this.options.content === null) {
		content = '';
	} else if (typeof this.options.content !== 'undefined') {
		content = Util.resolveString(this.options.content);
	}

	if (typeof content !== 'string') return content;

	const disableMentions =
		typeof this.options.disableMentions === 'undefined'
			? this.target.client.options.disableMentions
			: this.options.disableMentions;
	if (disableMentions === 'all') {
		content = Util.removeMentions(content);
	} else if (disableMentions === 'everyone') {
		content = content.replace(/@([^<>@ ]*)/gmsu, (match, target) => {
			if (target.match(/^[&!]?\d+$/)) {
				return `@${target}`;
			} else {
				return `@\u200b${target}`;
			}
		});
	}

	const isSplit = typeof this.options.split !== 'undefined' && this.options.split !== false;
	const isCode = typeof this.options.code !== 'undefined' && this.options.code !== false;
	const splitOptions = isSplit ? { ...this.options.split } : undefined;

	let mentionPart = '';
	if (this.options.reply?.user && !this.isUser && this.target.type !== 'dm') {
		const id = this.target.client.users.resolveID(this.options.reply.user);
		mentionPart = `<@${this.options.reply.user instanceof GuildMember && this.options.reply.user.nickname ? '!' : ''}${id}>, `;
		if (isSplit) {
			splitOptions.prepend = `${mentionPart}${splitOptions.prepend || ''}`;
		}
	}

	if (this.options.reply?.messageReference) {
		content = content.replace(/^\w/, a => a.toUpperCase());
	} 

	if (content || mentionPart) {
		if (isCode) {
			const codeName = typeof this.options.code === 'string' ? this.options.code : '';
			content = `${mentionPart}\`\`\`${codeName}\n${Util.cleanCodeBlockContent(content)}\n\`\`\``;
			if (isSplit) {
				splitOptions.prepend = `${splitOptions.prepend || ''}\`\`\`${codeName}\n`;
				splitOptions.append = `\n\`\`\`${splitOptions.append || ''}`;
			}
		} else if (mentionPart) {
			content = `${mentionPart}${content}`;
		}

		if (isSplit) {
			content = Util.splitMessage(content, splitOptions);
		}
	}

	return content;
}



APIMessage.prototype.resolveData = function () {
	if (this.data) return this;

	const content = this.makeContent();
	const tts = Boolean(this.options.tts);

	let nonce;
	if (typeof this.options.nonce !== 'undefined') {
		nonce = this.options.nonce;
		// eslint-disable-next-line max-len
		if (typeof nonce === 'number' ? !Number.isInteger(nonce) : typeof nonce !== 'string') {
			throw new RangeError('MESSAGE_NONCE_TYPE');
		}
	}

	const embedLikes = [];
	if (this.isInteraction || this.isWebhook) {
		if (this.options.embeds) {
			embedLikes.push(...this.options.embeds);
		}
	} else if (this.options.embed) {
		embedLikes.push(this.options.embed);
	}
	const embeds = embedLikes.map(e => new MessageEmbed(e).toJSON());

	let username;
	let avatarURL;
	if (this.isWebhook) {
		username = this.options.username || this.target.name;
		if (this.options.avatarURL) avatarURL = this.options.avatarURL;
	}

	let flags;
	if (this.isMessage) {
		// eslint-disable-next-line eqeqeq
		flags = this.options.flags != null ? new MessageFlags(this.options.flags).bitfield : this.target.flags.bitfield;
	} else if (this.isInteraction && this.options.ephemeral) {
		flags = MessageFlags.FLAGS.EPHEMERAL;
	}

	let allowedMentions =
	typeof this.options.allowedMentions === 'undefined'
		? this.target.client.options.allowedMentions
		: this.options.allowedMentions;

	if (allowedMentions) {
		allowedMentions = Util.cloneObject(allowedMentions);
		allowedMentions.replied_user = allowedMentions.repliedUser;
		delete allowedMentions.repliedUser;
	}

	let message_reference;
	if (typeof this.options.reply === 'object') {
		const message_id = this.isMessage
			? this.target.channel.messages.resolveID(this.options.reply.messageReference)
			: this.target.messages.resolveID(this.options.reply.messageReference);
		if (message_id) {
			message_reference = {
			message_id,
			fail_if_not_exists: this.options.reply.failIfNotExists ?? true,
			};
		}
	}

	this.data = {
		content,
		tts,
		nonce,
		embed: this.options.embed === null ? null : embeds[0],
		embeds,
		username,
		avatar_url: avatarURL,
		allowed_mentions:
			typeof content === 'undefined' && typeof message_reference === 'undefined' ? undefined : allowedMentions,
		flags,
		message_reference,
		attachments: this.options.attachments,
	};

	return this;
}



Message.prototype.reply = function (content, options) {
    return this.channel.send(
      content instanceof APIMessage
        ? content
        : APIMessage.transformOptions(content, options, { reply: { messageReference: this, failIfNotExists: false } }),
    );
  }