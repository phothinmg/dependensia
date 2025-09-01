# Contributing to dependensia

Thank you for your interest in contributing to **dependensia**! This guide will help you get started and understand the workflow for contributing code, documentation, or ideas.

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/phothinmg/mhaehko.git
   cd dependentiae
   ```

2. **Install dependencies**

   ```bash
   make install
   ```

3. **Check code quality**

   ```bash
   make lint
   ```

## Project Structure

- `src/` — Main source code
  - `lib/` — Core library modules
  - `handlers/` — Import/require handlers
  - `index.ts` — Entry point
- `notes/` — notes of the project
- `package.json`, `tsconfig.json`, `biome.json` — Project configuration

## How to Contribute

### 1. Issues & Feature Requests

- Use [GitHub Issues](https://github.com/phothinmg/dependentiae/issues) to report bugs or request features.

### 2. Pull Requests

- Fork the repository and create your branch from `main`.
- Follow the code style (see `biome.json`).
- Add tests if applicable.
- Document your changes in the pull request description.

### 3. Code Quality

- Run `make lint` before submitting.
- Ensure your code passes all checks and tests.

### 4. Documentation

- Update `readme.md` or add docs in `documents/` as needed.

## Circular Dependency Detection

This project analyzes TypeScript/JavaScript dependencies and can detect circular dependencies. See `src/lib/analyze.ts` and related modules for implementation details.

## License

See [LICENSE](LICENSE).

## Contact

For questions, open an issue or contact the maintainer via GitHub.

---
Happy coding!
