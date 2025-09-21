import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const allowedExtensions = new Set([
	"js",
	"cjs",
	"mjs",
	"ts",
	"mts",
	"cts",
	"jsx",
	"tsx",
]);

function isDir(filePath: string) {
	try {
		const stat = fs.lstatSync(filePath);
		return stat.isDirectory();
	} catch (err) {
		if (
			typeof err === "object" &&
			err !== null &&
			"code" in err &&
			// biome-ignore lint/suspicious/noExplicitAny: for error log only
			(err as any).code === "ENOENT"
		) {
			return false;
		}
		throw err;
	}
}

function getFileName(input: string) {
	return path.basename(input).split(".")[0].trim();
}
function getExtensionName(input: string) {
	return path.basename(input).split(".")[1]?.trim() || "";
}

/**
 * Resolve a file path with an extension or as a directory module (index file).
 * @param filePath The file path to resolve
 * @returns An object containing the resolved file path and the resolved extension
 */
function resolveExtension(filePath: string) {
	let result: string | undefined;
	let ext: string | undefined;
	let isDirPath = false;
	// If it's a directory, look for index file
	if (isDir(filePath)) {
		const files = fs.readdirSync(filePath);
		const found = files.find(
			(file) =>
				getFileName(file) === "index" &&
				allowedExtensions.has(getExtensionName(file)),
		);
		if (found) {
			result = path.join(filePath, found);
			ext = getExtensionName(found);
			isDirPath = true;
		} else {
			console.error(
				`${filePath} is a directory and no index file with JS/TS extension found.`,
			);
			process.exit(1);
		}
	} else {
		// Not a directory: try to resolve extension
		const dirName = path.dirname(filePath);
		const baseName = path.basename(filePath);
		const [fileName, extName = ""] = baseName.split(".");
		// const files = fs.globSync(
		//   `${dirName}/**/*.{js,cjs,mjs,ts,cts,mts,jsx,tsx}`
		// );
		const files = ts.sys.readDirectory(dirName);
		const match = files
			.map((f) => {
				const [name, ext = ""] = path.basename(f).split(".");
				return { name, ext };
			})
			.find((f) => f.name === fileName && allowedExtensions.has(f.ext));
		if (match) {
			if (!extName) {
				result = `${filePath}.${match.ext}`;
				ext = match.ext;
			} else if (extName === match.ext) {
				result = filePath;
				ext = match.ext;
			} else {
				result = filePath.replace(
					new RegExp(`\\.${extName}$`),
					`.${match.ext}`,
				);
				ext = match.ext;
			}
		} else {
			// If not found, maybe it's a directory import (e.g. ./lib)
			if (isDir(filePath)) {
				const files = fs.readdirSync(filePath);
				const found = files.find(
					(file) =>
						getFileName(file) === "index" &&
						allowedExtensions.has(getExtensionName(file)),
				);
				if (found) {
					result = path.join(filePath, found);
					ext = getExtensionName(found);
					isDirPath = true;
				}
			}
		}
	}
	if (!(result && ext)) {
		console.error(
			`When checking ${filePath}, it's not a file or file with unsupported extension`,
		);
		process.exit(1);
	}
	return { result, ext, isDirPath };
}
export default resolveExtension;
