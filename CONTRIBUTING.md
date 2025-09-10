# Contributing to dependensia

Thank you for your interest in contributing to **dependensia**! This guide will help you get started and understand the workflow for contributing code, documentation, or ideas.

## Project Structure

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

## Repository Setup Process

The initial setup involves cloning the repository and installing dependencies using the project's standardized make commands.

### Initial Setup Commands

| Step     | Command                                                  | Purpose                  |
| -------- | -------------------------------------------------------- | ------------------------ |
| Clone    | `git clone https://github.com/phothinmg/dependensia.git` | Get source code          |
| Navigate | `cd dependentiae`                                        | Enter project directory  |
| Install  | `make install`                                           | Install all dependencies |
| Verify   | `make lint`                                              | Check code quality       |

> NOTE: `make lint` for check to `src/` and `opt/`, `make format` for format all without checking.

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

| Tool            | Command          | Configuration File              | Purpose                           |
| --------------- | ---------------- | ------------------------------- | --------------------------------- |
| Biome           | `make lint`      | `biome.json`                    | Code formatting and linting       |
| TypeScript      | `tsc`            | `tsconfig.json`                 | Type checking and compilation     |
| CodeQL Advanced | github workflows | `.github/workflows/codeql.yml`  | CodeQL Analysis on push or on P/R |
| Semgrep         | github workflows | `.github/workflows/semgrep.yml` | Code Scanning With Semgrep        |

### Code Style Requirements

- Follow TypeScript strict mode guidelines
