export function fillWithDefaults<T>(partial: Partial<T>, defaults: T): T {
	const filled = {};

	Object.keys(defaults).forEach((key) => {
		filled[key] = partial[key] ?? defaults[key];
	});

	return filled as T;
}
