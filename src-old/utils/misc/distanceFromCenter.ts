export default function distanceFromCenter(x: number, y: number, width: number, height: number) {
	return Math.sqrt(Math.pow(x - width / 2, 2) + Math.pow(y - height / 2, 2));
}
