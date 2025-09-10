import module from "node:module";
import path from "node:path";

type CollectedObject = {
	file: string;
	index: number;
	importFiles: string[];
};

const isNodeBuiltinModule = (input: string): boolean => {
	const nodeModuleSpecifier: string = "node:";
	const nodeBuiltinModules = new Set<string>(module.builtinModules);
	return input.startsWith(nodeModuleSpecifier) || nodeBuiltinModules.has(input);
};

const createGraph = (deps: CollectedObject[]): Record<string, string[]> => {
	const graph: Record<string, string[]> = {};

	for (const dep of deps) {
		const _name = path.relative(process.cwd(), dep.file);
		graph[_name] = dep.importFiles;
	}
	return graph;
};

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
