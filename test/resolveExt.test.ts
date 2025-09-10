import { describe, it } from "node:test";
import { resolveExtension, replaceWithMatchExt } from "../src/lib/resolveExt";

//=
describe("Resolve extensions", () => {
	it("should resolve file path without extension", (t) => {
		const filePath = "./test/esm/foo";
		const resolve = resolveExtension(filePath);
		const result = resolve.result;
		const expected = "./test/esm/foo.js";
		t.assert.deepEqual(result, expected);
	});
	it("should replace file path extension if it is different from resolved extension", (t) => {
		const filePath = "./test/esm/foo.js";
		const resolve = resolveExtension(filePath);
		const result = resolve.result;
		const expected = "./test/esm/foo.ts";
		t.assert.deepEqual(result, expected);
	});
	it("should throw error if file path does not exist", (t) => {
		const filePath = "path/to/non-existent-file";
		t.assert.throws(() => resolveExtension(filePath));
		t.assert.snapshot({ filePath });
	});
	it("should replace extension with without extension", (t) => {
		const filePath = "./test/esm/foo";
		const result = replaceWithMatchExt(filePath, "js");
		const expected = "./test/esm/foo.js";
		t.assert.deepEqual(result, expected);
	});
	it("should replace extension with different extension", (t) => {
		const filePath = "./test/esm/foo.js";
		const result = replaceWithMatchExt(filePath, "ts");
		const expected = "./test/esm/foo.ts";
		t.assert.deepEqual(result, expected);
	});
	it("should replace extension with same extension", (t) => {
		const filePath = "./test/esm/foo.js";
		const result = replaceWithMatchExt(filePath, "js");
		const expected = "./test/esm/foo.js";
		t.assert.deepEqual(result, expected);
	});
});
