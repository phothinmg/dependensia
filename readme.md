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
  console.log(res.mutual());//mutual (two-way) dependencies
});
```

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

### Project Structure

- `src/` — Main source code
  - `lib/` — Core analysis modules (`analyze.ts`, `collect.ts`, etc.)
  - `handlers/` — Import/require handlers
  - `index.ts` — Entry point
- `build.ts` — project bundle and compile scripts
- `package.json`, `tsconfig.json`, `biome.json` — Configuration

See [CONTRIBUTING.md][file-contribute] for guidelines.

## License

[Apache-2.0][file-license] © [Pho Thin Mg][ptm]

<!-- markdownlint-disable MD053 -->

[file-license]: LICENSE
[file-contribute]: CONTRIBUTING.md
[ptm]: https://github.com/phothinmg
