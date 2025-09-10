import { describe, it } from "node:test";
import analyzeDependencies from "../src/lib/analyze";

describe("Analyze dependencies", () => {
	it("should return empty result for empty dependency graph", (t) => {
		const depObj: Record<string, string[]> = {};
		const result = analyzeDependencies(depObj);
		const expected = {
			circularDependencies: [],
			dependencyChains: {},
			entryToLeafChains: [],
		};
		t.assert.deepEqual(result, expected);
	});
	it("should detect simple dependency chain", (t) => {
		const depObj: Record<string, string[]> = {
			A: ["B"],
			B: ["C"],
			C: [],
		};
		const result = analyzeDependencies(depObj);
		const expected = {
			circularDependencies: [],
			dependencyChains: {
				A: ["A"],
				B: ["A", "B"],
				C: ["A", "B", "C"],
			},
			entryToLeafChains: [["A", "B", "C"]],
		};
		t.assert.deepEqual(result, expected);
	});
	it("should detect circular dependency", (t) => {
		const depObj: Record<string, string[]> = {
			A: ["B"],
			B: ["C"],
			C: ["A"],
		};
		const result = analyzeDependencies(depObj);
		const expected = {
			circularDependencies: [
				{
					chain: ["A", "B", "C", "A"],
					type: "circular",
				},
			],
			dependencyChains: {
				A: ["A"],
				B: ["A", "B"],
				C: ["A", "B", "C"],
			},
			entryToLeafChains: [],
		};
		t.assert.deepEqual(result, expected);
	});
	it("should detect multiple circular dependencies", (t) => {
		const depObj: Record<string, string[]> = {
			A: ["B"],
			B: ["C"],
			C: ["A"],
			D: ["E"],
			E: ["F"],
			F: ["D"],
		};
		const result = analyzeDependencies(depObj);
		const expected = {
			circularDependencies: [
				{
					chain: ["A", "B", "C", "A"],
					type: "circular",
				},
				{
					chain: ["D", "E", "F", "D"],
					type: "circular",
				},
			],
			dependencyChains: {
				A: ["A"],
				B: ["A", "B"],
				C: ["A", "B", "C"],
				D: ["D"],
				E: ["D", "E"],
				F: ["D", "E", "F"],
			},
			entryToLeafChains: [],
		};
		t.assert.deepEqual(result, expected);
	});
	it("should remove duplicate circular dependencies", (t) => {
		const depObj: Record<string, string[]> = {
			A: ["B"],
			B: ["C"],
			C: ["A"],
			D: ["A"],
		};
		const result = analyzeDependencies(depObj);
		const expected = {
			circularDependencies: [
				{
					chain: ["A", "B", "C", "A"],
					type: "circular",
				},
			],
			dependencyChains: {
				A: ["A"],
				B: ["A", "B"],
				C: ["A", "B", "C"],
				D: ["D"],
			},
			entryToLeafChains: [],
		};
		t.assert.deepEqual(result, expected);
	});
	it("should handle leaf node with no dependencies", (t) => {
		const depObj: Record<string, string[]> = {
			A: [],
		};
		const result = analyzeDependencies(depObj);
		const expected = {
			circularDependencies: [],
			dependencyChains: {
				A: ["A"],
			},
			entryToLeafChains: [["A"]],
		};
		t.assert.deepEqual(result, expected);
	});
	it("should handle node with multiple dependencies", (t) => {
		const depObj: Record<string, string[]> = {
			A: ["B", "C"],
			B: [],
			C: [],
		};
		const result = analyzeDependencies(depObj);
		const expected = {
			circularDependencies: [],
			dependencyChains: {
				A: ["A"],
				B: ["A", "B"],
				C: ["A", "C"],
			},
			entryToLeafChains: [
				["A", "B"],
				["A", "C"],
			],
		};
		t.assert.deepEqual(result, expected);
	});
});
