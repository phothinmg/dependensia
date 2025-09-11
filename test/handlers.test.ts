import { describe, it } from "node:test";
import ts from "typescript";
import handlers from "../src/lib/handlers/index.js";

const createES5SourceFile = (str: string) => {
	return ts.createSourceFile("common.ts", str, ts.ScriptTarget.ES5, true);
};
const createLatestSourceFile = (str: string) => {
	return ts.createSourceFile("esm.ts", str, ts.ScriptTarget.Latest, true);
};
// fake call back
const processFunction = (arr: string[]) => {
	return (str: string) => {
		arr.push(str);
	};
};

describe("Handle Require Calls", () => {
	it("should detect require call with string literal argument", (t) => {
		const arr: string[] = [];
		const str = 'var foo = require("bar");';
		const sourceFile = createES5SourceFile(str);
		const processFn = processFunction(arr);
		ts.forEachChild(sourceFile, (node) => handlers(node, processFn));
		const expected = "bar";
		const result = arr.join("");
		t.assert.deepEqual(result, expected);
	});
	it("should detect require call with property access", (t) => {
		const arr: string[] = [];
		const str = 'var foo = require("bar").baz;';
		const sourceFile = createES5SourceFile(str);
		const processFn = processFunction(arr);
		ts.forEachChild(sourceFile, (node) => handlers(node, processFn));
		const expected = "bar";
		const result = arr.join("");
		t.assert.deepEqual(result, expected);
	});
	it("should recursively detect require call", (t) => {
		const arr: string[] = [];
		const str = 'var foo = require("bar"); var baz = require("qux");';
		const sourceFile = createES5SourceFile(str);
		const processFn = processFunction(arr);
		ts.forEachChild(sourceFile, (node) => handlers(node, processFn));
		const expected = ["bar", "qux"];
		const result = arr;
		t.assert.deepEqual(result, expected);
	});
	it("should not detect non-require call", (t) => {
		const arr: string[] = [];
		const str = "var foo = baz;";
		const sourceFile = createES5SourceFile(str);
		const processFn = processFunction(arr);
		ts.forEachChild(sourceFile, (node) => handlers(node, processFn));
		const expected = [];
		const result = arr;
		t.assert.deepEqual(result, expected);
	});
	it("should not detect require call with non-string literal argument", (t) => {
		const arr: string[] = [];
		const str = "var foo = require(baz);";
		const sourceFile = createES5SourceFile(str);
		const processFn = processFunction(arr);
		ts.forEachChild(sourceFile, (node) => handlers(node, processFn));
		const expected = [];
		const result = arr;
		t.assert.deepEqual(result, expected);
	});
	it("should detect require call inside function declaration", (t) => {
		const arr: string[] = [];
		const str = 'function foo(){ var bar = require("bar")}';
		const sourceFile = createES5SourceFile(str);
		const processFn = processFunction(arr);
		ts.forEachChild(sourceFile, (node) => handlers(node, processFn));
		const expected = ["bar"];
		const result = arr;
		t.assert.deepEqual(result, expected);
	});
});

describe("Handle Imports", () => {
	it("should detect default import", (t) => {
		const arr: string[] = [];
		const str = 'import foo from "foo";';
		const sourceFile = createLatestSourceFile(str);
		const processFn = processFunction(arr);
		ts.forEachChild(sourceFile, (node) => handlers(node, processFn));
		const expected = ["foo"];
		const result = arr;
		t.assert.deepEqual(result, expected);
	});
	it("should detect name import", (t) => {
		const arr: string[] = [];
		const str = 'import {foo,bar.qux} from "foo";';
		const sourceFile = createLatestSourceFile(str);
		const processFn = processFunction(arr);
		ts.forEachChild(sourceFile, (node) => handlers(node, processFn));
		const expected = ["foo"];
		const result = arr;
		t.assert.deepEqual(result, expected);
	});
	it("should detect import equals declarations", (t) => {
		const arr: string[] = [];
		const str = 'import foo = require("foo");';
		const sourceFile = createLatestSourceFile(str);
		const processFn = processFunction(arr);
		ts.forEachChild(sourceFile, (node) => handlers(node, processFn));
		const expected = ["foo"];
		const result = arr;
		t.assert.deepEqual(result, expected);
	});
	it("should detect await import declarations", (t) => {
		const arr: string[] = [];
		const str = 'await import("foo")';
		const sourceFile = createLatestSourceFile(str);
		const processFn = processFunction(arr);
		ts.forEachChild(sourceFile, (node) => handlers(node, processFn));
		const expected = ["foo"];
		const result = arr;
		t.assert.deepEqual(result, expected);
	});
	it("should detect var statement with await import declarations", (t) => {
		const arr: string[] = [];
		const str = 'const bar = await import("foo")';
		const sourceFile = createLatestSourceFile(str);
		const processFn = processFunction(arr);
		ts.forEachChild(sourceFile, (node) => handlers(node, processFn));
		const expected = ["foo"];
		const result = arr;
		t.assert.deepEqual(result, expected);
	});
	it("should detect var statement with await import declarations inside function declaration", (t) => {
		const arr: string[] = [];
		const str = 'function qux(){ const bar = await import("foo") }';
		const sourceFile = createLatestSourceFile(str);
		const processFn = processFunction(arr);
		ts.forEachChild(sourceFile, (node) => handlers(node, processFn));
		const expected = ["foo"];
		const result = arr;
		t.assert.deepEqual(result, expected);
	});
});

describe("Handle mixed require calls and two edge script target", () => {
	const str =
		'var foo = require("barOne");\nvar foo = require("barTwo").baz;\nfunction foo(){ var bar = require("barThree")};\nif(foo){ var bar = require("barFour")}';
	it("should detect ES5", (t) => {
		const arr: string[] = [];
		const sourceFile = createES5SourceFile(str);
		const processFn = processFunction(arr);
		ts.forEachChild(sourceFile, (node) => handlers(node, processFn));
		const expected = ["barOne", "barTwo", "barThree", "barFour"];
		const result = arr;
		t.assert.deepEqual(result, expected);
	});
	it("should detect latest", (t) => {
		const arr: string[] = [];
		const sourceFile = createLatestSourceFile(str);
		const processFn = processFunction(arr);
		ts.forEachChild(sourceFile, (node) => handlers(node, processFn));
		const expected = ["barOne", "barTwo", "barThree", "barFour"];
		const result = arr;
		t.assert.deepEqual(result, expected);
	});
});
describe("Handle mixed imports  and two edge script target", () => {
	const str =
		'import foo from "barOne";\nimport {foo,bar.qux} from "barTwo";\nawait import("barThree");\nconst bar = await import("barFour");\nfunction foo(){ const bar = await import("barFive")};\nif(foo){ const bar = await import("barSix")}';
	it("should detect ES5", (t) => {
		const arr: string[] = [];
		const sourceFile = createES5SourceFile(str);
		const processFn = processFunction(arr);
		ts.forEachChild(sourceFile, (node) => handlers(node, processFn));
		const expected = [
			"barOne",
			"barTwo",
			"barThree",
			"barFour",
			"barFive",
			"barSix",
		];
		const result = arr;
		t.assert.deepEqual(result, expected);
	});
	it("should detect latest", (t) => {
		const arr: string[] = [];
		const sourceFile = createLatestSourceFile(str);
		const processFn = processFunction(arr);
		ts.forEachChild(sourceFile, (node) => handlers(node, processFn));
		const expected = [
			"barOne",
			"barTwo",
			"barThree",
			"barFour",
			"barFive",
			"barSix",
		];
		const result = arr;
		t.assert.deepEqual(result, expected);
	});
});
