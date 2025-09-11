import fs from "node:fs";
import path from "node:path";

interface PackageInfo {
	type: string;
	// biome-ignore lint/suspicious/noExplicitAny: will change later
	deps: Record<string, any>;
	// biome-ignore lint/suspicious/noExplicitAny: will change later
	type_deps: Record<string, any>;
	all: string[];
}

function getPackageInfo(root: string): PackageInfo {
	const packageJsonPath = path.resolve(root, "package.json");
	const nodeModulesPath = path.resolve(root, "node_modules");
	const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
	const deps = Object.keys(pkg.dependencies ?? {});
	const devDeps = Object.keys(pkg.devDependencies ?? {});
	const allDeps = [...deps, ...devDeps];
	const dependencies = allDeps.filter((i) => !i.startsWith("@types/"));
	const typesDependencies = allDeps.filter((i) => i.startsWith("@types/"));
	const depInfo: PackageInfo = {
		type: pkg.type,
		deps: {},
		type_deps: {},
		all: allDeps,
	};
	for (const dep of dependencies) {
		const pj_path = path.resolve(nodeModulesPath, dep, "package.json");
		const depPkg = JSON.parse(fs.readFileSync(pj_path, "utf8"));
		if (dep !== "typescript") {
			depInfo.deps[dep] = {
				type: depPkg.type ?? undefined,
				main: depPkg.main ?? undefined,
				module: depPkg.module ?? undefined,
				types: depPkg.types ?? undefined,
				exports: depPkg.exports ?? undefined,
			};
		}
	}
	for (const dep of typesDependencies) {
		const pj_path = path.resolve(nodeModulesPath, dep, "package.json");
		const depPkg = JSON.parse(fs.readFileSync(pj_path, "utf8"));
		if (dep !== "@types/node") {
			depInfo.type_deps[dep] = {
				types: depPkg.types ?? undefined,
				exports: depPkg.exports ?? undefined,
			};
		}
	}

	return depInfo;
}

export type { PackageInfo };
export default getPackageInfo;
