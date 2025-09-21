
/**
 * Visualize a dependency graph as a string.
 * The visualization is a simple text-based tree structure.
 * Each file is represented by its name, and its dependencies are listed underneath it.
 * If a file has no dependencies, it is represented by "(no dependencies)".
 * @param {Record<string, string[]>} depObj - The dependency graph to visualize.
 * @returns {string} - The visualized dependency graph as a string.
 */
function visualizeDependencies(depObj: Record<string, string[]>): string {
	let result = "Dependency Graph:\n\n";

	Object.entries(depObj).forEach(([file, dependencies]) => {
		result += `${file}\n`;

		if (dependencies.length === 0) {
			result += "  └── (no dependencies)\n";
		} else {
			dependencies.forEach((dep, index) => {
				const isLast = index === dependencies.length - 1;
				const prefix = isLast ? "  └── " : "  ├── ";
				result += `${prefix}${dep}\n`;
			});
		}

		result += "\n";
	});

	return result;
}

export default visualizeDependencies;
