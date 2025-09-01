import { existsSync, readFileSync } from "node:fs";
import fs from "node:fs/promises";
import ts from "typescript";
import path from "node:path";
import dependentiae from "./src/index.js";
// types
type Dep = {
  filePath: string;
  fileContent: string;
};

// --------------------------------------- helper functions -------------------------
const wait = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));
const cleanDir = async (dir: string) => {
  const files = await fs.readdir(dir);
  await Promise.all(files.map((file) => fs.unlink(path.join(dir, file))));
};
async function forceRemoveDir(dirPath: string) {
  if (!existsSync(dirPath)) return;
  for (const entry of await fs.readdir(dirPath)) {
    const fullPath = path.join(dirPath, entry);
    const stat = await fs.lstat(fullPath);
    if (stat.isDirectory()) {
      await forceRemoveDir(fullPath);
    } else {
      await fs.unlink(fullPath);
    }
  }
  await fs.rmdir(dirPath);
}

// --------------------------------------- options of build process --------------------
const entry = "src/index.ts";
const outDir = path.resolve(process.cwd(), "dist");
const licenseText = `
/*! *****************************************************************************
Copyright (c) Pho Thin Mg <phothinmg@disroot.org>

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0
***************************************************************************** */
`.trim();
// -------------------------------------------------------------------------------------
// ------------------------------ Bundle Files -----------------------------------------
console.time("Compiling done in");
console.time("Bundling done in");
const tempDir = path.resolve(process.cwd(), "_temp");
const tempFileName = path.basename(entry);
const tempFilePath = path.resolve(tempDir, tempFileName);
let removedStatements: string[] = [];
const remove = (dep: Dep, exp: boolean = true) => {
  const compilerOptions = ts.getDefaultCompilerOptions();
  const sourceFile = ts.createSourceFile(
    dep.filePath,
    dep.fileContent,
    ts.ScriptTarget.Latest,
    true
  );
  const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
    function visitor(node: ts.Node) {
      const { factory } = context;
      if (ts.isImportDeclaration(node)) {
        const text = node.getText(sourceFile);
        removedStatements.push(text);
        return factory.createEmptyStatement();
      }
      if (exp) {
        if (ts.isExportDeclaration(node)) {
          return factory.createEmptyStatement();
        }
        if (ts.isExportAssignment(node)) {
          const expr = node.expression;
          if (ts.isIdentifier(expr)) {
            return factory.createEmptyStatement();
          }
        }
      }
      return ts.visitEachChild(node, visitor, context);
    } //---
    return (rootNode) => ts.visitNode(rootNode, visitor) as ts.SourceFile; // transformer return
  };
  const transformationResult = ts.transform(
    sourceFile,
    [transformer],
    compilerOptions
  );
  const transformedSourceFile = transformationResult.transformed[0];
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    removeComments: false,
  });

  const modifiedCode = printer.printFile(
    transformedSourceFile as ts.SourceFile
  );
  transformationResult.dispose();
  return modifiedCode.replace(/^s*;\s*$/gm, "").trim();
};
const dep = await dependentiae(entry);
const dag = dep.sort();
const deps: Dep[] = dag.map((d) => {
  const filePath = path.resolve(process.cwd(), d);
  const fileContent = readFileSync(filePath, "utf8");
  return { filePath, fileContent };
});
const depsFiles = deps.slice(0, -1);
const entryDep = deps.slice(-1);
const depsFilesContent = depsFiles.map((dep) => remove(dep, true));
const entryDepContent = entryDep.map((dep) => remove(dep, false));
const contents = depsFilesContent.concat(entryDepContent);
// filter removed statements , that not from local like `./` or `../`
const regexp = /["']((?!\.\/|\.\.\/)[^"']+)["']/;
removedStatements = removedStatements.filter((i) => regexp.test(i));
// remove duplicate
removedStatements = Array.from(new Set(removedStatements));
// remove duplicate of 'import type ts from "typescript";' and 'import ts from "typescript";\n'
const txt = 'import type ts from "typescript";\n';
const _imports = removedStatements.join("\n").replace(txt, "").split("\n");
const bundledContent = _imports.concat(contents).join("\n").trim();
if (!existsSync(tempDir)) {
  await fs.mkdir(tempDir);
}
await wait(1000);
await fs.writeFile(tempFilePath, bundledContent);
await wait(1000);
console.timeEnd("Bundling done in");
// ---------------------------------- End Bundle Process ---------------------------------------
// ----------------------------------- Compiling -----------------------------------------------
// pre compiling
if (existsSync(outDir)) {
  cleanDir(outDir);
}
const files = [tempFilePath];
// commonjs
const cjsCompilerOptions: Partial<ts.CompilerOptions> = {
  outDir,
  module: ts.ModuleKind.CommonJS,
  sourceMap: true,
  strict: true,
  esModuleInterop: true,
  noImplicitAny: true,
  declaration: true,
};
const cjsCreatedFiles: Record<string, string> = {};
const hostCjs = ts.createCompilerHost(cjsCompilerOptions);
hostCjs.writeFile = (fileName, contents) => {
  cjsCreatedFiles[fileName] = contents;
};
const programCjs = ts.createProgram(files, cjsCompilerOptions, hostCjs);
programCjs.emit();
Object.entries(cjsCreatedFiles).map(async ([outName, content]) => {
  const dir = path.dirname(outName);
  const ext = path.extname(outName);
  if (!existsSync(dir)) {
    await fs.mkdir(dir, { recursive: true });
  }
  if (ext === ".js") {
    content = content.replace(
      "exports.default = dependensia;",
      "module.exports = dependensia;"
    );
  }
  if (ext === ".ts") {
    content = content
      .replace("export type { Dependensia };", "")
      .trim()
      .replace("export default dependensia;", "export = dependensia;");
  }
  content = `${licenseText}\n${content}`;
  outName = outName.replace(/.js/g, ".cjs");
  outName = outName.replace(/.map.js/g, ".map.cjs");
  outName = outName.replace(/.d.ts/g, ".d.cts");
  await wait(500);
  await fs.writeFile(outName, content);
});
await wait(1000);
// end commonjs
// ESM
const esmCompilerOptions: Partial<ts.CompilerOptions> = {
  outDir,
  module: ts.ModuleKind.ES2020,
  sourceMap: true,
  strict: true,
  esModuleInterop: true,
  noImplicitAny: true,
  declaration: true,
};
const esmCreatedFiles: Record<string, string> = {};
const hostEsm = ts.createCompilerHost(esmCompilerOptions);
hostEsm.writeFile = (fileName, contents) => {
  esmCreatedFiles[fileName] = contents;
};
const programEsm = ts.createProgram(files, esmCompilerOptions, hostEsm);
programEsm.emit();
Object.entries(esmCreatedFiles).map(async ([outName, content]) => {
  const dir = path.dirname(outName);
  if (!existsSync(dir)) {
    await fs.mkdir(dir, { recursive: true });
  }
  content = `${licenseText}\n${content}`;
  await wait(500);
  await fs.writeFile(outName, content);
});
await wait(1000);
console.timeEnd("Compiling done in");
// ----------------------------------------------- End Compiling --------------------------
// removing temp dir
await forceRemoveDir(tempDir);
