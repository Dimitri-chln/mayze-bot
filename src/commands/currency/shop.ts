import { CommandData } from "../../structures/commands/Command";
import {
	ApplicationCommandOptionType,
	ButtonInteraction,
	ButtonStyle,
	Collection,
	CollectorFilter,
	ComponentType,
	PermissionFlagsBits,
	PermissionsBitField,
	StringSelectMenuInteraction,
} from "discord.js";
import Util from "../../Util";

import { DatabaseItem, DatabaseShop, DatabaseUser, DatabaseUserItem, ItemType } from "../../types/Database";

const command: CommandData = {
	name: "shop",
	aliases: [],
	userPermissions: new PermissionsBitField(),
	botPermissions: new PermissionsBitField([PermissionFlagsBits.EmbedLinks]),

	options: [],

	async run(input, args, localizations) {
		const { rows: shopsData }: { rows: DatabaseShop[] } = await Util.database.query("SELECT * FROM shop");

		const { rows: itemsData }: { rows: UserItem[] } = await Util.database.query(
			`
			SELECT item.*, COALESCE(user_item.quantity, 0) as quantity
			FROM item
			LEFT JOIN user_item ON user_item.item_id = item.id
			ORDER BY item.id ASC
			`,
		);

		const shops = new Collection(shopsData.map((shopData) => [shopData.id, shopData]));
		const items = new Collection(itemsData.map((itemdata) => [itemdata.id, itemdata]));

		const {
			rows: [{ currency_money: money }],
		}: { rows: Pick<DatabaseUser, "currency_money">[] } = await Util.database.query(
			'SELECT currency_money FROM "user" WHERE id = $1',
			[input.user.id],
		);

		let currentShop = shops.first();
		let currentShopItems = items.filter((item) => item.shop_id === currentShop.id);
		let currentItem = currentShopItems.first();

		const reply = await input.reply(getMessage());

		const stringSelectMenuFilter: CollectorFilter<[StringSelectMenuInteraction]> = (stringSelectMenuInteraction) =>
			stringSelectMenuInteraction.user.id === input.user.id;

		const stringSelectMenuCollector = reply.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
			filter: stringSelectMenuFilter,
		});

		stringSelectMenuCollector.on("collect", (stringSelectMenuInteraction) => {
			switch (stringSelectMenuInteraction.customId) {
				case "shop": {
					currentShop = shops.get(parseInt(stringSelectMenuInteraction.values[0]));
					currentShopItems = items.filter((item) => item.shop_id === currentShop.id);
					break;
				}

				case "item": {
					currentItem = currentShopItems.get(parseInt(stringSelectMenuInteraction.values[0]));
					break;
				}
			}

			stringSelectMenuInteraction.update(getMessage());
		});

		const buttonFilter: CollectorFilter<[ButtonInteraction]> = (buttonInteraction) =>
			buttonInteraction.user.id === input.user.id;

		const buttonCollector = reply.createMessageComponentCollector({
			componentType: ComponentType.Button,
			filter: buttonFilter,
			idle: 60_000,
		});

		buttonCollector.on("collect", async (buttonInteraction) => {
			const price = currentItem.base_price + currentItem.quantity * currentItem.price_increment;

			if (money < price) {
				// Not enough money
				input.reply(localizations.not_enough_money.format(input.locale, currentItem.type === ItemType.ITEM));
			} else {
				// Buy the item (cannot use prepared queries here because of the multiple queries)
				await Util.database.query(
					`
					BEGIN;

					INSERT INTO user_item VALUES ('${input.user.id}', '${currentItem.id}', 1)
					ON CONFLICT (user_id, item_id)
					DO UPDATE SET
						quantity = user_item.quantity + 1
					WHERE user_item.user_id = EXCLUDED.user_id AND user_item.item_id = EXCLUDED.item_id;

					UPDATE "user" SET currency_money = currency_money - ${price} WHERE id = '${input.user.id}';

					COMMIT;
					`,
				);

				currentItem.quantity++;
			}

			buttonInteraction.update(getMessage());
		});

		buttonCollector.once("end", (collected, reason) => {
			stringSelectMenuCollector.stop();
			if (reason !== "messageDelete") input.editReply(getMessage(true));
		});

		function getFields() {
			return currentShopItems.map((shopItem) => ({
				name: localizations[`item_${shopItem.name}`].format(input.locale),
				value: localizations.field.format(
					input.locale,
					shopItem.type === ItemType.UPGRADE,
					shopItem.quantity.toString(),
					(shopItem.base_price + shopItem.quantity * shopItem.price_increment).toString(),
					shopItem.max && shopItem.quantity >= shopItem.max,
				),
			}));
		}

		function getComponents(disabled: boolean = false) {
			const components = [
				{
					type: ComponentType.ActionRow as ComponentType.ActionRow,
					components: [
						{
							type: ComponentType.StringSelect as ComponentType.StringSelect,
							customId: "shop",
							options: shops.map((s) => ({
								label: localizations[`shop_${s.name}`].format(input.locale),
								value: s.id.toString(),
								default: s.id === currentShop.id,
							})),
							disabled: disabled,
						},
					],
				},
				{
					type: ComponentType.ActionRow as ComponentType.ActionRow,
					components: [
						{
							type: ComponentType.StringSelect as ComponentType.StringSelect,
							customId: "item",
							options: currentShopItems.map((i) => ({
								label: localizations[`item_${i.name}`].format(input.locale),
								value: i.id.toString(),
								default: i.id === currentItem.id,
							})),
							disabled: disabled,
						},
					],
				},
				{
					type: ComponentType.ActionRow as ComponentType.ActionRow,
					components: [
						{
							type: ComponentType.Button as ComponentType.Button,
							customId: "buy",
							label: localizations.buy.format(input.locale),
							emoji: Util.config.EMOJIS.check.data,
							style: ButtonStyle.Success as ButtonStyle.Success,
							disabled: disabled,
						},
					],
				},
			];

			return components;
		}

		function getMessage(disabled: boolean = false) {
			return {
				embeds: [
					{
						author: {
							name: localizations[`shop_${currentShop.name}`].format(input.locale),
							icon_url: input.client.user.displayAvatarURL(),
						},
						color: input.guild.members.me.displayColor,
						title: localizations.money.format(input.locale, money.toString()),
						fields: getFields(),
						footer: {
							text: Util.config.DEFAULT_EMBED_FOOTER_TEXT,
						},
					},
				],
				components: getComponents(disabled),
			};
		}
	},
};

export default command;

type UserItem = DatabaseItem & Pick<DatabaseUserItem, "quantity">;
