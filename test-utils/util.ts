import ts from "typescript";

export const createES5SourceFile = (str: string) => {
  return ts.createSourceFile("common.ts", str, ts.ScriptTarget.ES5, true);
};
export const createLatestSourceFile = (str: string) => {
  return ts.createSourceFile("esm.ts", str, ts.ScriptTarget.Latest, true);
};
export const processFunction = (arr: string[]) => {
  return function (str: string) {
    arr.push(str);
  };
};
