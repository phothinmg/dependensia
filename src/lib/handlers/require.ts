import ts from "typescript";

/**
 * Recursively traverse the given node and its children to detect require calls.
 *
 * The following require calls are supported:
 * - `var foo = require("foo")`
 * - `var foo = require("foo").foo`
 *
 * The callback function `processFn` is called with the detected module name.
 */
function handleRequire(node: ts.Node, processFn: (input: string) => void) {
	// Handle : require calls , `var foo = require("foo")`
	// can't handle import equal statement like `import foo = require("foo")`
	if (
		ts.isCallExpression(node) &&
		ts.isIdentifier(node.expression) &&
		node.expression.text === "require" &&
		node.arguments.length > 0
	) {
		// if expression callExpression node's text equal to require
		// index 0 of arguments is moduleText
		// I didn't use forEach or for-off loop to avoid multiple processing.
		const firstArg = node.arguments[0];
		if (ts.isStringLiteral(firstArg)) {
			processFn(firstArg.text);
		}
		return; // Skip children for property access require calls
	}

	// Handle : property access like `var foo = require("foo").foo`
	if (
		ts.isPropertyAccessExpression(node) &&
		ts.isCallExpression(node.expression) &&
		ts.isIdentifier(node.expression.expression) &&
		node.expression.expression.text === "require" &&
		node.expression.arguments.length > 0
	) {
		const firstArg = node.expression.arguments[0];
		if (ts.isStringLiteral(firstArg)) {
			processFn(firstArg.text);
		}
		return; // Skip children for property access require calls
	}

	// Recursively visit all children (except for require calls we already processed)
	ts.forEachChild(node, (n) => handleRequire(n, processFn));
}

export default handleRequire;
