import type ts from "typescript";
import {
	handleAwaitImport,
	handleImportEqual,
	handleImports,
} from "./imports.js";
import handleRequire from "./require.js";

/**
 * Recursively traverse the given node and its children to detect
 * import declarations, require calls, `import foo = require("foo")`,
 * and `await import("foo")`.
 *
 * The callback function `processFn` is called with the detected module name.
 */
function handlers(node: ts.Node, processFn: (input: string) => void) {
	Promise.all([
		handleImports(node, processFn),
		handleRequire(node, processFn),
		handleImportEqual(node, processFn),
		handleAwaitImport(node, processFn),
	]);
}

export default handlers;
