import path from "node:path";
import ts from "typescript";
import { wait, writeOutFile } from "./helpers";

export type OutPutHook = (code: string, file?: string) => string;
// biome-ignore lint/suspicious/noExplicitAny: call hooks
export type OutPutHookFunc = (...args: any[]) => OutPutHook;

const commonjsCompiler = async (
	sourceCode: string,
	outDir: string,
	fileName: string,
	hooks?: OutPutHook[],
) => {
	console.time("Compiled Commonjs");
	const compilerOptions: ts.CompilerOptions = {
		outDir,
		module: ts.ModuleKind.CommonJS,
		sourceMap: true,
		strict: true,
		esModuleInterop: true,
		noImplicitAny: true,
		declaration: true,
	};
	const createdFiles: Record<string, string> = {};
	const host: ts.CompilerHost = {
		getSourceFile: (file, languageVersion) => {
			if (file === fileName) {
				return ts.createSourceFile(file, sourceCode, languageVersion);
			}
			return undefined;
		},
		writeFile: (fileName, contents) => {
			createdFiles[fileName] = contents;
		},
		getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
		getCurrentDirectory: () => "",
		getDirectories: () => [],
		fileExists: (file) => file === fileName,
		readFile: (file) => (file === fileName ? sourceCode : undefined),
		getCanonicalFileName: (file) => file,
		useCaseSensitiveFileNames: () => true,
		getNewLine: () => "\n",
	};
	// ===
	const program = ts.createProgram([fileName], compilerOptions, host);
	program.emit();
	Object.entries(createdFiles).map(async ([outName, content]) => {
		const ext = path.extname(outName);
		if (ext === ".js") {
			content = content.replace(
				"exports.default = dependensia;",
				"module.exports = dependensia;",
			);
		}
		if (ext === ".ts") {
			content = content
				.replace("export type { Dependensia };", "")
				.trim()
				.replace("export default dependensia;", "export = dependensia;");
		}
		//content = `${licenseText}\n${content}`;
		if (hooks?.length) {
			for (const hook of hooks) {
				content = hook(content, outName);
			}
		}
		outName = outName.replace(/.js/g, ".cjs");
		outName = outName.replace(/.map.js/g, ".map.cjs");
		outName = outName.replace(/.d.ts/g, ".d.cts");
		await wait(500);
		writeOutFile(outName, content);
	});
	console.timeEnd("Compiled Commonjs");
};

const esmCompiler = async (
	sourceCode: string,
	outDir: string,
	fileName: string,
	hooks?: OutPutHook[],
) => {
	console.time("Compiled ESM");
	const compilerOptions: ts.CompilerOptions = {
		outDir,
		module: ts.ModuleKind.ES2020,
		sourceMap: true,
		strict: true,
		esModuleInterop: true,
		noImplicitAny: true,
		declaration: true,
	};
	const createdFiles: Record<string, string> = {};
	const host: ts.CompilerHost = {
		getSourceFile: (file, languageVersion) => {
			if (file === fileName) {
				return ts.createSourceFile(file, sourceCode, languageVersion);
			}
			return undefined;
		},
		writeFile: (fileName, contents) => {
			createdFiles[fileName] = contents;
		},
		getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
		getCurrentDirectory: () => "",
		getDirectories: () => [],
		fileExists: (file) => file === fileName,
		readFile: (file) => (file === fileName ? sourceCode : undefined),
		getCanonicalFileName: (file) => file,
		useCaseSensitiveFileNames: () => true,
		getNewLine: () => "\n",
	};
	// ===
	const program = ts.createProgram([fileName], compilerOptions, host);
	program.emit();
	Object.entries(createdFiles).map(async ([outName, content]) => {
		if (hooks?.length) {
			for (const hook of hooks) {
				content = hook(content, outName);
			}
		}
		await wait(500);
		writeOutFile(outName, content);
	});
	console.timeEnd("Compiled ESM");
};

export { commonjsCompiler, esmCompiler };
