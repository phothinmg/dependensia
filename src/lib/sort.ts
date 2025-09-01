/**
 * Topological sort of a directed acyclic graph (DAG).
 *
 * Takes a JavaScript object representing a graph where the values are arrays of
 * the nodes' dependencies. Returns a list of nodes in topological order.
 * @param {Object<string, string[]>} tree - The graph to be sorted.
 * @returns {string[]} - The nodes in topological order.
 */
function topoSort(tree: Record<string, string[]>): string[] {
	const visited = new Set();
	const sorted: string[] = [];
	function visit(node: string) {
		if (visited.has(node)) return;
		visited.add(node);
		(tree[node] || []).forEach(visit);
		sorted.push(node);
	}
	Object.keys(tree).forEach(visit);
	return sorted; // reverse for correct order
}

export default topoSort;
