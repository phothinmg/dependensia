/**
 * Merge multiple import statements into a single import statement.
 *
 * The function takes an array of import statements and returns a new array of import statements.
 * The returned array will have the following properties:
 * - All named imports will be merged into a single import statement.
 * - All default imports will be merged into a single import statement.
 * - All type-only imports will be merged into a single type import statement.
 * - All type-only default imports will be merged into a single type default import statement.
 * - All namespace imports will be merged into a single namespace import statement.
 *
 * The function will remove any duplicate imports and will sort the imports alphabetically.
 *
 * Example:
 * Input: ["import { foo, bar } from 'module'", "import { baz } from 'module'"]
 * Output: ["import { bar, baz, foo } from 'module'"]
 */
function mergeImports(imports: string[]): string[] {
	const importMap = new Map<string, Set<string>>();
	const typeImportMap = new Map<string, Set<string>>();
	const defaultImports = new Map<string, Set<string>>();
	const typeDefaultImports = new Map<string, Set<string>>();
	const namespaceImports = new Map<string, Set<string>>();

	// Parse each import statement
	for (const importStr of imports) {
		const importMatch = importStr.match(
			/import\s+(?:type\s+)?(?:(.*?)\s+from\s+)?["']([^"']+)["'];?/,
		);
		if (!importMatch) continue;

		const [, importClause, modulePath] = importMatch;
		const isTypeImport = importStr.includes("import type");

		if (!importClause) {
			// Default import or side-effect import
			const defaultMatch = importStr.match(/import\s+(?:type\s+)?(\w+)/);
			if (defaultMatch) {
				const importName = defaultMatch[1];
				const targetMap = isTypeImport ? typeDefaultImports : defaultImports;
				if (!targetMap.has(modulePath)) targetMap.set(modulePath, new Set());
				targetMap.get(modulePath)?.add(importName);
			}
			continue;
		}

		if (importClause.startsWith("{")) {
			// Named imports: import { a, b } from 'module'
			const targetMap = isTypeImport ? typeImportMap : importMap;
			if (!targetMap.has(modulePath)) targetMap.set(modulePath, new Set());

			const names = importClause
				.replace(/[{}]/g, "")
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean);
			// biome-ignore  lint/suspicious/useIterableCallbackReturn : just add name for names each
			names.forEach((name) => targetMap.get(modulePath)?.add(name));
		} else if (importClause.startsWith("* as")) {
			// Namespace import: import * as name from 'module'
			const namespaceMatch = importClause.match(/\*\s+as\s+(\w+)/);
			if (namespaceMatch) {
				const namespaceName = namespaceMatch[1];
				if (!namespaceImports.has(modulePath))
					namespaceImports.set(modulePath, new Set());
				namespaceImports.get(modulePath)?.add(namespaceName);
			}
		} else {
			// Default import: import name from 'module'
			const targetMap = isTypeImport ? typeDefaultImports : defaultImports;
			if (!targetMap.has(modulePath)) targetMap.set(modulePath, new Set());
			targetMap.get(modulePath)?.add(importClause.trim());
		}
	}

	const mergedImports: string[] = [];

	// Process named imports - remove type imports that have regular imports
	for (const [modulePath, regularNames] of importMap) {
		const typeNames = typeImportMap.get(modulePath) || new Set();

		// Only include type names that don't have regular imports
		const finalNames = new Set([...regularNames]);
		for (const typeName of typeNames) {
			if (!regularNames.has(typeName)) {
				finalNames.add(typeName);
			}
		}

		if (finalNames.size > 0) {
			const importNames = Array.from(finalNames).sort().join(", ");
			mergedImports.push(`import { ${importNames} } from "${modulePath}";`);
		}
	}

	// Add remaining type-only imports (where no regular imports exist for the module)
	for (const [modulePath, typeNames] of typeImportMap) {
		if (!importMap.has(modulePath) && typeNames.size > 0) {
			const importNames = Array.from(typeNames).sort().join(", ");
			mergedImports.push(
				`import type { ${importNames} } from "${modulePath}";`,
			);
		}
	}

	// Process default imports - remove type default imports that have regular default imports
	for (const [modulePath, regularDefaultNames] of defaultImports) {
		const typeDefaultNames = typeDefaultImports.get(modulePath) || new Set();

		// Only include type default names that don't have regular default imports
		const finalNames = new Set([...regularDefaultNames]);
		for (const typeName of typeDefaultNames) {
			if (!regularDefaultNames.has(typeName)) {
				finalNames.add(typeName);
			}
		}

		if (finalNames.size > 0) {
			const importNames = Array.from(finalNames).join(", ");
			mergedImports.push(`import ${importNames} from "${modulePath}";`);
		}
	}

	// Add remaining type-only default imports
	for (const [modulePath, typeDefaultNames] of typeDefaultImports) {
		if (!defaultImports.has(modulePath) && typeDefaultNames.size > 0) {
			const importNames = Array.from(typeDefaultNames).join(", ");
			mergedImports.push(`import type ${importNames} from "${modulePath}";`);
		}
	}

	// Process namespace imports
	for (const [modulePath, names] of namespaceImports) {
		if (names.size > 0) {
			const importNames = Array.from(names).join(", ");
			mergedImports.push(`import * as ${importNames} from "${modulePath}";`);
		}
	}

	return mergedImports.sort();
}

export default mergeImports;
