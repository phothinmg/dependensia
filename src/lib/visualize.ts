/**
 * Visualize dependency graph as text
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
