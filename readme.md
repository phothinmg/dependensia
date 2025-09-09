# dependensia

[![Ask DeepWiki][deep-wiki-svg]][deep-wiki-project]

## Overview

A static analysis tool designed to examine TypeScript and JavaScript projects and produce dependency graphs,using TypeScript APIs.

### Key Features

- **Dependency Graph Generation:** Analyze TypeScript/JavaScript projects to map file dependencies.
- **Circular Dependency Detection:** Implements depth-first search (DFS) algorithms to identify cycles in the dependency graph, helping developers locate problematic import patterns.
- **Topological Sorting:** Files are ordered according to their dependency relationships, enabling build systems and bundlers to process files in the correct sequence.
- **Leaf & Mutual Dependencies:** Find files with no local imports and mutual (two-way) dependencies.
- **NPM & Node Built-in Detection:** List external and built-in module usage.

## Documentation

A [technical overview and up-to-date documentation][deep-wiki-project] is provided by [DeepWiki][deep-wiki] and is available for asking about the project.

- [Getting Started][getting-started]
- [API Reference][api-reference]
- [Architecture][architecture]
- [Development][development]

### Installation

Install dependensia as a development dependency in your project:

```bash
npm i -D dependensia
```

### Basic Usage

#### ES Modules

```ts
import dependensia from "dependensia";

const entry = "src/index.ts";
const analysis = await dependensia(entry);

// Get topologically sorted files
const sorted = analysis.sort();

// Check for circular dependencies
const circular = analysis.circular();

// Find mutual dependencies
const mutual = analysis.mutual();
```

#### CommonJS

```js
const dependensia = require("dependensia");

const entry = "src/index.js";
dependensia(entry).then((analysis) => {
  console.log("Circular dependencies:", analysis.circular());
  console.log("NPM dependencies:", analysis.npm());
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

See [CONTRIBUTING.md][file-contribute].For more detail [Contributing Guidelines][contributing-guidelines]

## License

[Apache-2.0][file-license] © [Pho Thin Mg][ptm]

<!-- markdownlint-disable MD053 -->

[file-license]: LICENSE
[file-contribute]: CONTRIBUTING.md
[ptm]: https://github.com/phothinmg
[deep-wiki]: https://deepwiki.com/
[deep-wiki-project]: https://deepwiki.com/phothinmg/dependensia
[deep-wiki-svg]: https://deepwiki.com/badge.svg
[getting-started]: https://deepwiki.com/phothinmg/dependensia/2-getting-started
[api-reference]: https://deepwiki.com/phothinmg/dependensia/3-api-reference
[architecture]: https://deepwiki.com/phothinmg/dependensia/4-architecture
[development]: https://deepwiki.com/phothinmg/dependensia/5-development
[contributing-guidelines]: https://deepwiki.com/phothinmg/dependensia/5.1-contributing-guidelines
