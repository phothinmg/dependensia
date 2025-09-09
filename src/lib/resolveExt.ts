import path from "node:path";
import ts from "typescript";
/**
 * Resolve a file path with an extension. If the extension is not present, it is
 * automatically resolved from the files in the same directory. If the resolved
 * extension is different from the given extension, the filePath is replaced with
 * the resolved extension.
 *
 * @param filePath The file path to resolve
 * @returns An object containing the resolved file path and the resolved extension
 */
function resolveExtension(filePath: string) {
  const allowedExtensions = new Set(["js", "cjs", "mjs", "ts", "mts", "cts"]);
  const trimmedPath = filePath.trim();
  const dirName = path.dirname(trimmedPath);
  const baseName = path.basename(trimmedPath);
  const [fileName, extName = ""] = baseName.split(".");
  const files = ts.sys.readDirectory(dirName, [
    "js",
    "cjs",
    "mjs",
    "ts",
    "mts",
    "cts",
  ]);

  // Find a file with the same name and allowed extension
  const match = files
    .map((f) => {
      const [name, ext = ""] = path.basename(f).split(".");
      return { name, ext };
    })
    .find((f) => f.name === fileName && allowedExtensions.has(f.ext));

  if (!match) {
    console.log(`Error in ${filePath}`);
    //TODO -> Optionally log a warning here
    throw Error();
    //process.exit(1);
  }

  let result: string;
  if (!extName) {
    result = `${trimmedPath}.${match.ext}`;
  } else if (extName === match.ext) {
    result = trimmedPath;
  } else {
    // detect-non-literal-regexp.detect-non-literal-regexp
    // https://github.com/phothinmg/dependensia/actions/runs/17573584216/job/49914087146
    result = trimmedPath.replace(new RegExp(`\\.${extName}$`), `.${match.ext}`);
  }

  return { result, ext: match.ext };
}
const replaceWithMatchExt = (inputPath: string, ext: string) => {
  const _ext = `.${ext}`;
  const _exn = path.extname(inputPath);
  if (_exn === "") {
    return `${inputPath}${_ext}`;
  } else if (_exn !== "" && _exn !== _ext) {
    return inputPath.replace(`${_exn}`, `${_ext}`);
  } else {
    return inputPath;
  }
};

export { replaceWithMatchExt, resolveExtension };
