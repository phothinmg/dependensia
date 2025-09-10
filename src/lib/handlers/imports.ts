import ts from "typescript";

/**
 * Recursively traverse the given node and its children to detect import declarations.
 *
 * The following import declarations are supported:
 * - `import foo from "foo"`
 *
 * The callback function `processFn` is called with the detected module name.
 */
function handleImports(node: ts.Node, processFn: (input: string) => void) {
	// Handle : import declaration
	if (ts.isImportDeclaration(node) && node.moduleSpecifier) {
		const moduleText = node.moduleSpecifier
			.getText()
			.replace(/^['"`]|['"`]$/g, "");
		processFn(moduleText);
		return;
	} //--
	// Recursively visit all children
	ts.forEachChild(node, (n) => handleImports(n, processFn));
}

/**
 * Recursively traverse the given node and its children to detect import equals declarations.
 *
 * The following import equals declarations are supported:
 * - `import foo = require("foo")`
 *
 * The callback function `processFn` is called with the detected module name.
 */
function handleImportEqual(node: ts.Node, processFn: (input: string) => void) {
	// Handle : import equal declaration
	if (
		ts.isImportEqualsDeclaration(node) &&
		ts.isExternalModuleReference(node.moduleReference) &&
		ts.isStringLiteral(node.moduleReference.expression)
	) {
		const moduleText = node.moduleReference.expression.text;
		processFn(moduleText);
		return;
	} //--
	// Recursively visit all children
	ts.forEachChild(node, (n) => handleImportEqual(n, processFn));
}

/**
 * Recursively traverse the given node and its children to detect await import declarations.
 *
 * The following await import declarations are supported:
 * - `await import("foo")`
 *
 * The callback function `processFn` is called with the detected module name.
 */
function handleAwaitImport(node: ts.Node, processFn: (input: string) => void) {
	// Handle : import equal declaration
	if (
		ts.isAwaitExpression(node) &&
		ts.isCallExpression(node.expression) &&
		node.expression.expression.kind === ts.SyntaxKind.ImportKeyword
	) {
		const firstArg = node.expression.arguments[0];
		if (ts.isStringLiteral(firstArg)) {
			processFn(firstArg.text);
		}
		return;
	} //--
	// Recursively visit all children
	ts.forEachChild(node, (n) => handleAwaitImport(n, processFn));
}

export { handleAwaitImport, handleImportEqual, handleImports };
