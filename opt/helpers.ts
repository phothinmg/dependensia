import path from "node:path";
import ts from "typescript";

const resolvePath = ts.sys.resolvePath;
const fileExists = ts.sys.fileExists;
const deleteFile = ts.sys.deleteFile;
const directoryExists = ts.sys.directoryExists;
const createDirectory = ts.sys.createDirectory;
const writeFile = ts.sys.writeFile;
const readFile = ts.sys.readFile;

const wait = (time: number) =>
	new Promise((resolve) => setTimeout(resolve, time));
const writeOutFile = (filePath: string, content: string) => {
	const resolvedPath = resolvePath(filePath);
	const dir = path.dirname(resolvedPath);
	if (fileExists(resolvedPath) && typeof deleteFile === "function") {
		deleteFile(resolvedPath);
	} else {
		if (!directoryExists(dir)) {
			createDirectory(dir);
		} else {
			if (typeof deleteFile === "function") {
				deleteFile(resolvedPath);
			}
		}
	}
	writeFile(resolvedPath, content);
};

export { wait, writeOutFile, readFile, resolvePath };
