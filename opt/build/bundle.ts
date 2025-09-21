import ts from "typescript";
import dependensia from "../../src";
import { readFile, resolvePath, wait } from "../helpers";
import mergeImports from "./mergeImports";

type Dep = {
	filePath: string;
	fileContent: string;
};
/**
 * Bundles the given entry file with its dependencies.
 *
 * @param entry The entry file to bundle.
 * @returns A string containing the bundled code.
 */
async function bundle(entry: string) {
	console.time("Bundled");
	// Handle : dependencies
	const graph = await dependensia(entry);
	const sorted = graph.sort();
	const deps: Dep[] = sorted.map((v) => {
		// ignore undefine
		const content = readFile(resolvePath(v), "utf8") as string;
		return {
			filePath: v,
			fileContent: content,
		};
	});
	// Handle : import and export
	let removedStatements: string[] = []; // to collect removed imports
	const remove = (dep: Dep, exp: boolean = true) => {
		const compilerOptions = ts.getDefaultCompilerOptions();
		const sourceFile = ts.createSourceFile(
			dep.filePath,
			dep.fileContent,
			ts.ScriptTarget.Latest,
			true,
		);
		const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
			const { factory } = context;
			function visitor(node: ts.Node): ts.Node {
				// imports
				if (
					ts.isImportDeclaration(node) ||
					ts.isImportEqualsDeclaration(node)
				) {
					const text = node.getText(sourceFile);
					removedStatements.push(text);
					return factory.createEmptyStatement();
				}
				// exports
				// we din't remove exports from entry
				// can not handle the following :
				// 1. export modifiers like `export const foo = "foo"` or `export default function foo(){}`
				// 2. anonymous exports(without name) like `export default function(){}` or `export default{foo:"bar"}`
				// only handle `export {...}` and export default with identifier
				if (exp) {
					if (ts.isExportDeclaration(node)) {
						return factory.createEmptyStatement();
					}
					if (ts.isExportAssignment(node)) {
						const expr = node.expression;
						if (ts.isIdentifier(expr)) {
							return factory.createEmptyStatement();
						}
					}
				}
				// ---------------------------------//
				return ts.visitEachChild(node, visitor, context);
			} // visitor
			// ------------------------- -----//
			return (rootNode) => ts.visitNode(rootNode, visitor) as ts.SourceFile;
		}; // transformer
		const transformationResult = ts.transform(
			sourceFile,
			[transformer],
			compilerOptions,
		);
		const transformedSourceFile = transformationResult.transformed[0];
		const printer = ts.createPrinter({
			newLine: ts.NewLineKind.LineFeed,
			removeComments: false,
		});

		const modifiedCode = printer.printFile(
			transformedSourceFile as ts.SourceFile,
		);
		transformationResult.dispose();
		// for ";"
		return modifiedCode.replace(/^s*;\s*$/gm, "").trim();
	}; // remove
	// Handle : removed content
	// separate dependencies and entry
	const depsFiles = deps.slice(0, -1);
	const entryDep = deps.slice(-1);
	const depsFilesContent = depsFiles.map((dep) => remove(dep, true));
	const entryDepContent = entryDep.map((dep) => remove(dep, false));
	// removed imports and exports
	const processedContents = depsFilesContent.concat(entryDepContent);
	await wait(1000);
	// Handle : collected removed imports
	// filter out relative imports(Local) like `./` or `../`
	const regexp = /["']((?!\.\/|\.\.\/)[^"']+)["']/;
	removedStatements = removedStatements.filter((i) => regexp.test(i));
	// merge duplicate imports of different file from dependencies tree
	// remove type imports that have regular imports
	removedStatements = mergeImports(removedStatements);
	console.timeEnd("Bundled");
	return `${removedStatements.join("\n")}\n${processedContents.join(
		"\n",
	)}\n`.trim();
}

export default bundle;
