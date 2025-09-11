import assert from "node:assert";
import { describe, it } from "node:test";
import dependensia from "../src/index";

// helpers
const isObject = (input: any) =>
	typeof input === "object" && !Array.isArray(input) && input !== null;

function expect(entry: any) {
	const hasOwn = (input: any) => {
		if (!isObject(entry)) assert.fail(`${entry} is not an object`);
		assert.ok(Object.hasOwn(entry, input));
	};
	const isInstanceOf = (input: any) => {
		if (typeof input === "string") {
			assert.ok(typeof entry === input);
		} else {
			assert.ok(entry instanceof input);
		}
	};
	const hasLength = (input: number) => {
		const length: number | undefined = isObject(entry)
			? Object.keys(entry).length
			: (entry?.length ?? undefined);
		if (length) {
			assert.ok(length >= input);
		} else {
			assert.fail(`${typeof entry}`);
		}
	};
	return { hasOwn, isInstanceOf, hasLength };
}

// Test with our own source code

describe("Test with our own source codes", async () => {
	const entry = "src/index.ts";
	const graph = await dependensia(entry);
	it("returns an object with the expected methods", () => {
		expect(graph).hasOwn("sort");
		expect(graph).hasOwn("npm");
		expect(graph).hasOwn("node");
		expect(graph).hasOwn("deps");
		expect(graph).hasOwn("warn");
		expect(graph).hasOwn("mutual");
		expect(graph).hasOwn("leaf");
		expect(graph).hasOwn("circular");
		expect(graph).hasOwn("dependents");
		expect(graph).hasOwn("chain");
		expect(graph).hasOwn("entryToLeaf");
		expect(graph).hasOwn("textGraph");
	});
	it("should methods are returned correct types", () => {
		expect(graph.sort()).isInstanceOf(Array);
		expect(graph.node()).isInstanceOf(Array);
		expect(graph.npm()).isInstanceOf(Array);
		expect(graph.chain()).isInstanceOf(Object);
		expect(graph.circular()).isInstanceOf(Array);
		expect(graph.dependents("src/lib/packageInfo.ts")).isInstanceOf(Array);
		expect(graph.deps()).isInstanceOf(Object);
		expect(graph.entryToLeaf()).isInstanceOf(Array);
		expect(graph.leaf()).isInstanceOf(Array);
		expect(graph.mutual()).isInstanceOf(Array);
		expect(graph.warn()).isInstanceOf(Array);
		expect(graph.textGraph()).isInstanceOf("string");
	});
});
