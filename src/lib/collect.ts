// key part of core library modules
// handle dependencies of entry file by Typescript API -> collecting  <- get package data , resolved file's extensions
// collected (DAG,external modules,warning) -> Dependensia APIs ->
// Analyzed dependencies data using Depth-First Search (DFS) Algorithm,improved by DeepSeek,Windsurf,Github Copilot.
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import handlers from "./handlers/index.js";
import type { PackageInfo } from "./packageInfo.js";
import { replaceWithMatchExt, resolveExtension } from "./resolveExt.js";
import { type CollectedObject, isNodeBuiltinModule } from "./utils.js";

interface CollectedDepsInfo {
  dependencies: CollectedObject[];
  collectedNpmModules: string[][];
  collectedNodeModules: string[][];
  collectedWarning: string[][];
}
/**
 * Recursively traverse the given file and its dependencies to collect
 * local, node builtin, and npm dependencies.
 *
 * @param entry The entry file of the project
 * @param pkg The package.json object of the project
 * @param root The root directory of the project
 * @returns An object containing
 * - `dependencies`: An array of objects containing the file path, index, and
 *   imported files of each dependency
 * - `collectedNodeModules`: An array of arrays of node builtin modules used
 *   in each dependency
 * - `collectedNpmModules`: An array of arrays of npm modules used in each
 *   dependency
 * - `collectedWarning`: An array of arrays of unknown dependencies used in
 *   each dependency
 */
function collectDependencies(
  entry: string,
  pkg: PackageInfo,
  root: string
): CollectedDepsInfo {
  const dependencies: CollectedObject[] = [];
  const visited = new Set<string>();
  const collectedNpmModules: string[][] = [];
  const collectedNodeModules: string[][] = [];
  const collectedWarning: string[][] = [];
  function visit(file: string, index: number) {
    const absPath = path.resolve(root, file);
    if (visited.has(absPath)) return;
    visited.add(absPath);
    const { result: checkedAbsPath, ext: matchExt } = resolveExtension(absPath);
    if (!fs.existsSync(checkedAbsPath)) {
      dependencies.push({
        file: absPath,
        index,
        importFiles: [],
      });
      collectedWarning.push([`File not found: ${checkedAbsPath}`]);
      return;
    }
    const content = fs.readFileSync(checkedAbsPath, "utf8");
    const sourceFile = ts.createSourceFile(
      file,
      content,
      ts.ScriptTarget.Latest,
      true
    );
    const importFiles: string[] = [];
    const warn: string[] = [];
    const npmModules: string[] = [];
    const nodeModules: string[] = [];
    function processModule(moduleText: string): void {
      // Handle : Imported local dependencies of a file.
      if (moduleText.startsWith(".") || moduleText.startsWith("..")) {
        // replace with matched extension found by resolveExtension function.
        const checkedModuleText = replaceWithMatchExt(moduleText, matchExt);
        // resolve local imported path to relative path.
        const resolvedImport = path.relative(
          root,
          path.resolve(path.dirname(checkedAbsPath), checkedModuleText)
        );
        importFiles.push(resolvedImport);
      }
      // Handle : Imported dependencies of node builtin modules of a file.
      else if (isNodeBuiltinModule(moduleText)) {
        nodeModules.push(moduleText);
      }
      // Handle : Imported npm dependencies of a file, by checking local package.json
      // currently only check for these dependencies are  installed or not, depend on project's package.json
      // TODO try for provide information such as exported files , to use in bundle process
      else if (pkg.all.includes(moduleText)) {
        npmModules.push(moduleText);
      }
      // Handle : Unknown dependencies,uninstalled npm modules will be collected.
      // local dependencies are checked before by resolveExtension function.
      // TODO try for analyze these errors and provide analyzed report.
      else {
        warn.push(moduleText);
      }
    } //#endregion

    ts.forEachChild(sourceFile, (node) => handlers(node, processModule));

    dependencies.push({
      file: absPath,
      index,
      importFiles,
    });
    collectedNpmModules.push(npmModules);
    collectedNodeModules.push(nodeModules);
    collectedWarning.push(warn);
    // biome-ignore lint/suspicious/useIterableCallbackReturn: Recursively visit local file dependencies
    importFiles.forEach((depFile) => visit(depFile, dependencies.length));
  }
  visit(entry, 0);
  return {
    dependencies,
    collectedNodeModules,
    collectedNpmModules,
    collectedWarning,
  };
}

export type { CollectedDepsInfo };
export default collectDependencies;
