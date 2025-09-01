/*! *****************************************************************************
Copyright (c) Pho Thin Mg <phothinmg@disroot.org>

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0
***************************************************************************** */
import path from "node:path";
import analyzeDependencies, {
	type CircularDependency,
	type DependencyAnalysis,
} from "./lib/analyze.js";
import collectDependencies, { type CollectedDepsInfo } from "./lib/collect.js";
import findLeafFiles from "./lib/leaf.js";
import findMutualDependencies from "./lib/mutual.js";
import getPackageInfo, { type PackageInfo } from "./lib/packageInfo.js";
import topoSort from "./lib/sort.js";
import { createGraph, mergeStringArr, runPromise } from "./lib/utils.js";
import visualizeDependencies from "./lib/visualize.js";

interface Dependensia {
	/**
	 * Topological sort of a directed acyclic graph (DAG). Returns a list of nodes in topological order.
	 */
	sort: () => string[];
	/** Returns the list of NPM dependencies.*/
	npm: () => string[];
	/** The list of dependencies that are built-in Node.js modules.*/
	node: () => string[];
	/** The dependency graph as an object where the keys are files and the values are arrays of dependencies.  */
	deps: () => Record<string, string[]>;
	/** The collection of warnings */
	warn: () => string[];
	/**
	 * Finds files that depend on each other mutually (two-way circular dependencies)
	 * An array of arrays, where each sub-array contains two files that depend on each other mutually.
	 */
	mutual: () => string[][];
	/**
	 * Finds files that don't import any other local files (leaf files)
	 * An array of file paths that don't import any other local files.
	 */
	leaf: () => string[];
	/**
	 * Finds circular dependencies in the dependency graph.
	 *
	 * A circular dependency is when a file depends on another file, either directly or indirectly, and the other file also depends on the first file.
	 * An array of objects, where each object has a `chain` property that contains the cycle of dependencies and a `type` property that indicates the type of circular dependency.
	 */
	circular: () => CircularDependency[];
	/**
	 * Given a file, returns an array of files that depend on it.
	 *
	 * The returned array is a subset of the dependency graph, with each
	 * element being a file that depends on the given file.
	 * @param file The file to find dependents for.
	 * An array of files that depend on the given file.
	 */
	dependents: (file: string) => string[];
	/**
	 * The dependency chain of the graph, where each key is a file and the value is an array of files that the key depends on.
	 * The dependency chain of the graph.
	 */
	chain: () => Record<string, string[]>;
	/**
	 * Returns the list of entry files to leaf files dependency chains.
	 * Each dependency chain is an array of strings, where each string is a file path.
	 * The first element of each array is the entry file and the last element is the leaf file.
	 * An array of arrays of strings.
	 */
	entryToLeaf(): string[][];
	/**
	 * The dependency graph as text.
	 */
	textGraph: () => string;
}

/**
 * Analyze a TypeScript/JavaScript project's dependencies and generates a dependency graph.
 *
 * The returned object contains methods that return information about the dependency graph.
 *
 * @param entry The entry file to start analyzing from.
 * @returns An object containing methods to query the dependency graph.
 */
async function dependensia(entry: string): Promise<Dependensia> {
	// I created and used utility function runPromise for Promise resolved.
	// Function-base approach for flexibility and simplicity to  returning an object with methods.
	// This pattern is idiomatic for many Node.js libraries.
	const root = process.cwd();
	const pkg: PackageInfo = await runPromise(getPackageInfo, undefined, root);
	const collectedData = await runPromise<CollectedDepsInfo>(
		collectDependencies,
		1000,
		entry,
		pkg,
		root,
	);
	const graphObj = collectedData.dependencies;
	const npmModules = await runPromise<string[]>(
		mergeStringArr,
		1000,
		collectedData.collectedNpmModules,
	);
	const nodeModules = await runPromise<string[]>(
		mergeStringArr,
		1000,
		collectedData.collectedNodeModules,
	);
	const warning = await runPromise<string[]>(
		mergeStringArr,
		1000,
		collectedData.collectedWarning,
	);
	const depsObj = await runPromise<Record<string, string[]>>(
		createGraph,
		1000,
		graphObj,
	);
	const sortedGraph = await runPromise<string[]>(topoSort, 1000, depsObj);
	const mutualFiles = await runPromise<string[][]>(
		findMutualDependencies,
		1000,
		depsObj,
	);
	const _leaves = await runPromise<string[]>(findLeafFiles, 1000, depsObj);

	const _text = await runPromise<string>(visualizeDependencies, 1000, depsObj);

	const analyzedData = await runPromise<DependencyAnalysis>(
		analyzeDependencies,
		1000,
		depsObj,
	);

	const _chain = analyzedData.dependencyChains;

	function dependents(file: string): string[] {
		const _path = path.relative(root, file);
		if (_chain[_path]) {
			return _chain[_path].slice(0, -1);
		}
		return [];
	}

	return {
		sort: (): string[] => sortedGraph,
		npm: (): string[] => npmModules,
		node: (): string[] => nodeModules,
		deps: (): Record<string, string[]> => depsObj,
		warn: (): string[] => warning,
		mutual: (): string[][] => mutualFiles,
		leaf: (): string[] => _leaves,
		circular: (): CircularDependency[] => analyzedData.circularDependencies,
		dependents,
		chain: (): Record<string, string[]> => _chain,
		entryToLeaf:(): string[][]=> analyzedData.entryToLeafChains,
		textGraph: (): string => _text,
	};
}

export type { Dependensia };

export default dependensia;
