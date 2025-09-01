import { isNodeBuiltinModule } from "./utils.js";

/**
 * Find leaf files (files that don't import any other local files)
 */
function findLeafFiles(depObj: Record<string, string[]>): string[] {
	return Object.entries(depObj)
		.filter(([_file, deps]) => {
			// Filter out dependencies that are not local files (npm modules, node builtins)
			const localDeps = deps.filter(
				(dep) =>
					dep.startsWith(".") ||
					(!dep.includes("node_modules") && !isNodeBuiltinModule(dep)),
			);
			return localDeps.length === 0;
		})
		.map(([file]) => file);
}

export default findLeafFiles;
