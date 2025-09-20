import { describe, it } from "node:test";
import resolveExtension from "../src/lib/resolveExt";

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
		const filePath = "./test/ts/foo.js";
		const resolve = resolveExtension(filePath);
		const result = resolve.result;
		const expected = "./test/ts/foo.ts";
		t.assert.deepEqual(result, expected);
	});
});
