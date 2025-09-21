import module from "node:module";
import path from "node:path";

type CollectedObject = {
	file: string;
	index: number;
	importFiles: string[];
};

/**
 * Check if a given module is a Node.js built-in module.
 * @param {string} input - The module to check.
 * @returns {boolean} True if the module is a Node.js built-in module, false otherwise.
 */
const isNodeBuiltinModule = (input: string): boolean => {
	const nodeModuleSpecifier: string = "node:";
	const nodeBuiltinModules = new Set<string>(module.builtinModules);
	return input.startsWith(nodeModuleSpecifier) || nodeBuiltinModules.has(input);
};

/**
 * Create a dependency graph from a list of collected dependencies.
 * @param {CollectedObject[]} deps - A list of collected dependencies.
 * @returns {Record<string, string[]>} A dependency graph where each key is a file path and each value is an array of files that the key file depends on.
 */
const createGraph = (deps: CollectedObject[]): Record<string, string[]> => {
	const graph: Record<string, string[]> = {};

	for (const dep of deps) {
		const _name = path.relative(process.cwd(), dep.file);
		graph[_name] = dep.importFiles;
	}
	return graph;
};

/**
 * Merge an array of string arrays into a single string array.
 * @param {string[][]} input - An array of string arrays to merge.
 * @returns {string[]} A single string array containing all the elements from the input arrays.
 */
const mergeStringArr = (input: string[][]): string[] => {
	return input.reduce((prev, curr) => prev.concat(curr), []);
};
// biome-ignore lint/suspicious/noExplicitAny: unknown
async function runPromise<T = any>(
	// biome-ignore lint/suspicious/noExplicitAny: unknown
	fun: (...args: any[]) => T,
	time: number | undefined,
	// biome-ignore lint/suspicious/noExplicitAny: unknown
	...args: any[]
): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		try {
			const t = time ? 0 : time;
			const result: T = fun(...args);
			setTimeout(() => resolve(result), t);
		} catch (error) {
			reject(error);
		}
	});
}

export type { CollectedObject };

export { createGraph, runPromise, isNodeBuiltinModule, mergeStringArr };
