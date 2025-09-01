# dependensia

## About

Analyze a TypeScript/JavaScript project's dependencies and generates a dependency graph using TypeScript APIs.

## Features

- **Dependency Graph Generation:** Analyze TypeScript/JavaScript projects to map file dependencies.
- **Circular Dependency Detection:** Identify cycles in your codebase.
- **Topological Sorting:** Get files in dependency order.
- **Leaf & Mutual Dependencies:** Find files with no local imports and mutual (two-way) dependencies.
- **NPM & Node Built-in Detection:** List external and built-in module usage.

## Usage

### Install

```bash
npm i dependensia
```

### Use

Import and use in your project:

esm:

```ts
import dependensia from "dependensia";

const entry = "src/index.js";
const graph = await dependensia(entry);
const sorted = graph.sort(); //a list of nodes in topological order
```

commonjs:

```js
const dependensia = require("dependensia");

const entry = "src/index.js";
dependensia(entry).then((res) => {
  console.log(res.mutual()); //mutual (two-way) dependencies
});
```

## API

**dependensia(entry:string)**

Returns a Promise resolved object.

1. `chain: () => Record<string, string[]>;` :: The dependency chain of the graph, where each key is a file and the value is an array of files that the key depends on.

2. `circular: () => CircularDependency[];` :: A circular dependency is when a file depends on another file, either directly or indirectly, and the other file also depends on the first file.

3. `dependents: (file: string) => string[];` :: An array of files that depend on the given file.

4. `deps: () => Record<string, string[]>;` :: The dependency graph as an object where the keys are files and the values are arrays of dependencies.

5. `entryToLeaf: () => string[][];` :: Returns the list of entry files to leaf files dependency chains.

6. `leaf: () => string[];` :: An array of file paths that don't import any other local files.

7. `mutual: () => string[][];` :: An array of arrays, where each sub-array contains two files that depend on each other mutually.

8. `node: () => string[];` :: The list of dependencies that are built-in Node.js modules.

9. `npm: () => string[];` :: Returns the list of NPM dependencies.

10. `sort: () => string[];` :: Returns a list of files in topological order.

11. `textGraph: () => string;` :: The dependency graph as text.

12. `warn: () => string[];` :: The collection of warnings.

## Contributing

Contributions are welcome for bug fixes, features, documentation, and code quality improvements.

### Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/phothinmg/dependensia.git
   cd dependensia
   ```

2. **Install dependencies:**

   ```bash
   make install
   ```

3. **Run code quality checks:**

   ```bash
   make lint
   ```

4. **Build the project:**

   ```bash
   make build
   ```

See [CONTRIBUTING.md][file-contribute].

## License

[Apache-2.0][file-license] © [Pho Thin Mg][ptm]

<!-- markdownlint-disable MD053 -->

[file-license]: LICENSE
[file-contribute]: CONTRIBUTING.md
[ptm]: https://github.com/phothinmg
