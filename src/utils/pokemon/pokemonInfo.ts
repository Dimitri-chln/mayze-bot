import Pokemon from "../../types/pokemon/Pokemon";
import { Language } from "../../types/structures/Translations";

const imageSuffixes = {
	alola: {
		default: {
			19: 10091,
			20: 10092,
			26: 10100,
			27: 10101,
			28: 10102,
			37: 10103,
			38: 10104,
			50: 10105,
			51: 10106,
			52: 10107,
			53: 10108,
			74: 10109,
			75: 10110,
			76: 10111,
			88: 10112,
			89: 10113,
			103: 10114,
			105: 10115,
		},
	},

	galar: {
		default: {
			52: 10158,
			77: 10159,
			78: 10160,
			79: 10161,
			80: 10162,
			83: 10163,
			110: 10164,
			122: 10165,
			144: 10166,
			145: 10167,
			146: 10168,
			199: 10169,
			222: 10170,
			263: 10171,
			264: 10172,
			554: 10173,
			555: 10174,
			562: 10176,
			618: 10177,
		},
	},

	mega: {
		default: {
			3: 10033,
			9: 10036,
			15: 10090,
			18: 10073,
			65: 10037,
			80: 10071,
			94: 10038,
			115: 10039,
			127: 10040,
			130: 10041,
			142: 10042,
			181: 10045,
			208: 10072,
			212: 10046,
			214: 10047,
			229: 10048,
			248: 10049,
			254: 10065,
			257: 10050,
			260: 10064,
			282: 10051,
			302: 10066,
			303: 10052,
			306: 10053,
			308: 10054,
			310: 10055,
			319: 10070,
			323: 10087,
			334: 10067,
			354: 10056,
			359: 10057,
			362: 10074,
			373: 10089,
			376: 10076,
			380: 10062,
			381: 10063,
			384: 10079,
			428: 10088,
			445: 10058,
			448: 10059,
			460: 10060,
			475: 10068,
			531: 10069,
			719: 10075,
		},
		megax: {
			6: 10034,
			150: 10043,
		},

		megay: {
			6: 10035,
			150: 10044,
		},

		primal: {
			382: 10077,
			383: 10078,
		},
	},

	gigantamax: {
		3: 10186,
		6: 10187,
		9: 10188,
		12: 10189,
		25: 10190,
		52: 10191,
		68: 10192,
		94: 10193,
		99: 10194,
		131: 10195,
		133: 10196,
		143: 10197,
		569: 10198,
		809: 10199,
		812: 10200,
		815: 10201,
		818: 10202,
		823: 10203,
		826: 10204,
		834: 10205,
		839: 10206,
		841: 10207,
		842: 10208,
		844: 10209,
		849: 10210,
		851: 10211,
		858: 10212,
		861: 10213,
		869: 10214,
		879: 10215,
		884: 10216,
		890: 10217,
		892: [10218, 10219],
	},
};

export function formatName(
	pokemon: Pokemon,
	shiny: boolean = false,
	variationType: VariationType = "default",
	variation: Variation = "default",
	language: Language = "en",
	format: FormatType = "full",
) {
	let name = "",
		badges = "";

	if (shiny) badges += "⭐";
	if (pokemon.legendary) badges += "🎖️";
	if (pokemon.ultraBeast) badges += "🎗️";

	if (variationType === "default") {
		name = pokemon.names[language] ?? pokemon.names.fr;
	} else if (variationType === "mega") {
		const pokemonVariation = pokemon.megaEvolutions.find(
			(v) => v.variationType === variationType && v.variation === variation,
		);

		if (pokemonVariation) name = pokemonVariation.names[language];
	} else {
		const pokemonVariation = pokemon.variations.find(
			(v) => v.variationType === variationType && v.variation === variation,
		);

		if (pokemonVariation) name = pokemonVariation.names[language];
	}

	switch (format) {
		case "full":
			return `${badges} ${name}`.trim();
		case "badge":
			return badges;
		case "raw":
			return name;
	}
}

export function pokemonImage(
	pokemon: Pokemon,
	shiny: boolean = false,
	variationType: VariationType = "default",
	variation: Variation = "default",
) {
	const url = (n: number) =>
		`https://assets.poketwo.net/${shiny ? "shiny" : "images"}/${n}.png?v=26`;

	if (variationType === "default") return url(pokemon.nationalId);
	else return url(imageSuffixes[variationType][variation][pokemon.nationalId]);
}

export type VariationType = "default" | "mega" | "alola" | "galar";

export type Variation = "default" | "megax" | "megay" | "primal";

export type FormatType = "full" | "badge" | "raw";
