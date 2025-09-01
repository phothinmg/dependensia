/**
 * Find files that depend on each other mutually (two-way circular dependencies)
 */
function findMutualDependencies(depObj: Record<string, string[]>): string[][] {
	const mutualDeps: string[][] = [];

	Object.entries(depObj).forEach(([file, dependencies]) => {
		dependencies.forEach((dep) => {
			if (depObj[dep]?.includes(file)) {
				// Check if this mutual dependency is already recorded
				const exists = mutualDeps.some(
					(pair) =>
						(pair[0] === file && pair[1] === dep) ||
						(pair[0] === dep && pair[1] === file),
				);

				if (!exists) {
					mutualDeps.push([file, dep]);
				}
			}
		});
	});

	return mutualDeps;
}

export default findMutualDependencies;
