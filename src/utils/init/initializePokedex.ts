import Util from "../../Util";

export default async function initializePokedex() {
	await Util.pokedex.localize();
}
