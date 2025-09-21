# Contributing to dependensia

Thank you for your interest in contributing to **dependensia**! This guide will help you get started and understand the workflow for contributing code, documentation, or ideas.

## Repository Setup Process

The initial setup involves cloning the repository and installing dependencies using the project's standardized make commands.

### Initial Setup Commands

| Step     | Command                                                  | Purpose                  |
| -------- | -------------------------------------------------------- | ------------------------ |
| Clone    | `git clone https://github.com/phothinmg/dependensia.git` | Get source code          |
| Navigate | `cd dependentiae`                                        | Enter project directory  |
| Install  | `npm install`                                            | Install all dependencies |
| Verify   | `npm run lint`                                           | Check code quality       |

> NOTE: `npm run lint` for check to `src/` and `opt/`, `npm run format` for format all without checking.

## Contribution Workflow

The project follows a standard GitHub fork-and-pull-request workflow with specific quality requirements and review processes.

### Branching Guidelines

- Create feature branches from `main` branch
- Use descriptive branch names (e.g., `fix/circular-detection`, `feature/new-handler`)
- Keep branches focused on single features or bug fixes
- Regularly sync with upstream main to avoid conflicts

### Code Quality Standards

The project enforces strict code quality standards through automated tooling and manual review processes.

#### Quality Tools and Commands

| Tool            | Command          | Configuration File                | Purpose                           |
| --------------- | ---------------- | --------------------------------- | --------------------------------- |
| Biome           | `npm run lint`   | `biome.json`                      | Code formatting and linting       |
| TypeScript      | `tsc`            | `tsconfig.json`                   | Type checking and compilation     |
| CI Workflow     | github workflows | `.github/workflows/ci.yml`       | Comprehensive CI checks for PRs   |
| CodeQL Advanced | github workflows | `.github/workflows/codeql.yml`   | CodeQL Analysis on push or on P/R |
| Semgrep         | github workflows | `.github/workflows/semgrep.yml`  | Code Scanning With Semgrep        |
| OSSF Scorecard  | github workflows | `.github/workflows/scorecard.yml`| Security posture scoring          |

### Code Style Requirements

- Follow TypeScript strict mode guidelines
- Use consistent import/export patterns as defined in handlers
- Maintain compatibility with both CommonJS and ES Module outputs
- Document public APIs with TypeScript doc comments
- Ensure all functions have appropriate return type annotations

Please don't use exports with modifiers because of our own bundle process can't handle that see in following example:

```ts
// don't -> exports with modifiers
export const bar = {};
export default function foo() {}
// don't -> anonymous exports(without name)
export default function () {}
export default { foo: "bar" };
// do -> exports with identifier
const bar = {};
function foo() {}
const biz = { foo: "bar" };
export { bar, biz };
export default foo;
```

## Project Structure and Development Areas

Understanding the codebase structure is essential for effective contributions.

### Core Development Areas

```text
root/
├── coverage(codecov report)
├── opt(bundle,lcov)
├── resources(notes of the project)
├── src (main source code)/
│   ├── index.ts(entry point)
│   └── lib(core library modules)/
│       └── handlers(import/require handlers)
├── test(unit test)
├── biome.json(code quality)
├── build.ts(build script)
├── codecov.ts(generate coverage report)
├── Makefile
├── package.json
├── readme.md
└── tsconfig.json
```

### Common Contribution Areas

- **New Import Handlers:** Add support for new import syntaxes in `src/lib/handlers/`
- **Analysis Algorithms:** Enhance detection logic in `src/lib/analyze.ts`
- **Output Formats:** Extend visualization options in `src/lib/visualize.ts`
- **Utility Functions:** Add graph manipulation functions in `src/lib/utils.ts`

## Testing

The project use Node Js built-in modules `node:test` and `node:assert` for unit testing.

### Coverage Report, upload to Codecov

- Generate `lcov` report using cli flag `--experimental-test-coverage` to `test/lcov.info`.
- Convert `lcov` string to codecov json format and write to `coverage/codecov.json` , see in `opt/lcov.ts` and `opt/codecov.ts`.
- Upload to Codecov by Github Action , configuration file at `.github/workflows/codecov.yml`.

## Bundling , Compiling and Build

The project uses own building process , see in:

- `opt/mergeImports.ts`
- `opt/bundle.ts`
- `opt/compile.ts`
- `opt/build.ts`

## Pull Request Process

Pull requests undergo a systematic review process ensuring code quality and project alignment.

### PR Requirements Checklist

- Branch created from `main`
- Code follows project style guidelines
- All automated checks pass (CI, CodeQL, Semgrep)
- Tests added for new functionality
- Documentation updated where necessary
- PR description explains changes clearly
- Related issues referenced
- **Code owner approval required** (as defined in `.github/CODEOWNERS`)

### Required Status Checks

All pull requests must pass the following automated checks before merging:

- **CI Workflow**: Linting, testing, building, and type checking
- **CodeQL Analysis**: Security and code quality scanning
- **Semgrep**: Additional security scanning
- **Code Owner Review**: Manual review and approval from designated code owners

### Review Criteria

- Code quality and maintainability
- Adherence to TypeScript best practices
- Compatibility with existing API surface
- Performance impact consideration
- Documentation completeness

## Branch Protection and Code Ownership

This repository implements branch protection rules to maintain code quality and security:

### Code Ownership

The `.github/CODEOWNERS` file defines code ownership patterns:
- All code requires review and approval from the repository owner (@phothinmg)
- Specific patterns for core areas: source code, build scripts, configuration files
- Security and documentation files have dedicated ownership

### Branch Protection Rules

The `main` branch is protected with the following requirements:
- **Pull Request Required**: Direct pushes are not allowed
- **Required Status Checks**: All CI checks must pass before merging
- **Code Owner Review Required**: At least one code owner must approve changes
- **Up-to-date Branch**: PRs must be current with the base branch before merging

These protections ensure code quality and help maintain a high OSSF Scorecard security rating.

## Documentation

Update `readme.md` or add docs in `documents/` as needed.

## Issue Reporting and Feature Requests

The project uses GitHub Issues for bug tracking and feature requests with structured templates.

- [bug report template](https://github.com/phothinmg/dependensia/blob/main/.github/ISSUE_TEMPLATE/bug_report.md)
- [issue template](https://github.com/phothinmg/dependensia/blob/main/.github/ISSUE_TEMPLATE/feature_request.md)

## Contact and Support

For questions, open an issue , [discussions](https://github.com/phothinmg/dependensia/discussions/1) or contact the maintainer via GitHub.

---

Happy coding!
