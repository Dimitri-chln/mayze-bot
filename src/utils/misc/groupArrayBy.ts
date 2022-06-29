export default function groupArrayBy(array: Array<T>, n: number): Array<T[]> {
	const groups = [[]];

	for (let i = 0, j = 0; i < array.length; i++) {
		if (i >= n && i % n === 0) {
			j++;
			groups[j] = [];
		}
		groups[j].push(array[i]);
	}

	return groups;
}

type T = any;
