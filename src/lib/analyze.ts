interface CircularDependency {
	chain: string[];
	type: "circular";
}

interface DependencyAnalysis {
	circularDependencies: CircularDependency[];
	dependencyChains: Record<string, string[]>;
	entryToLeafChains: string[][];
}

/**
 * Find circular dependencies in a dependency graph
 */
function analyzeDependencies(
	depObj: Record<string, string[]>,
): DependencyAnalysis {
	const circularDependencies: CircularDependency[] = [];
	const dependencyChains: Record<string, string[]> = {};
	const visited = new Set<string>();
	const currentlyVisiting = new Set<string>();
	const entryToLeafChains: string[][] = [];

	/**
	 * DFS to detect circular dependencies and build dependency chains
	 */
	function dfs(currentFile: string, path: string[] = []): string[][] {
		if (currentlyVisiting.has(currentFile)) {
			// Circular dependency found
			const cycleStartIndex = path.indexOf(currentFile);
			const cycle = path.slice(cycleStartIndex);
			circularDependencies.push({
				chain: [...cycle, currentFile],
				type: "circular",
			});
			return [];
		}

		if (visited.has(currentFile)) {
			return [];
		}

		visited.add(currentFile);
		currentlyVisiting.add(currentFile);

		const currentPath = [...path, currentFile];
		const dependencies = depObj[currentFile] || [];
		let allChains: string[][] = [];

		if (dependencies.length === 0) {
			// This is a leaf node
			entryToLeafChains.push(currentPath);
			allChains.push(currentPath);
		} else {
			for (const dep of dependencies) {
				const depChains = dfs(dep, currentPath);
				allChains = allChains.concat(depChains);
			}
		}

		// Store the complete dependency chain for this file
		dependencyChains[currentFile] = currentPath;

		currentlyVisiting.delete(currentFile);
		return allChains;
	}

	// Analyze all files in the dependency graph
	Object.keys(depObj).forEach((file) => {
		if (!visited.has(file)) {
			dfs(file);
		}
	});

	// Remove duplicate circular dependencies
	const uniqueCircularDeps = circularDependencies.filter(
		(circular, index, array) => {
			const circularString = circular.chain.join("->");
			return (
				array.findIndex((c) => c.chain.join("->") === circularString) === index
			);
		},
	);

	return {
		circularDependencies: uniqueCircularDeps,
		dependencyChains,
		entryToLeafChains,
	};
}

export type { DependencyAnalysis, CircularDependency };
export default analyzeDependencies;
