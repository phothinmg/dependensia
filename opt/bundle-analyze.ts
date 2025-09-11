import {
	createAndUploadReport,
	type Options,
	type BundleAnalyzerOptions,
} from "@codecov/bundle-analyzer";
import path from "node:path";

const buildDirs = [path.resolve(process.cwd(), "dist")];

const coreOpts: Options = {
	dryRun: true,
	retryCount: 3,
	apiUrl: "https://api.codecov.io",
	bundleName: "dependensia",
	enableBundleAnalysis: true,
	debug: true,
	oidc: {
		useGitHubOIDC: true,
	},
};

const bundleAnalyzerOpts: BundleAnalyzerOptions = {
	beforeReportUpload: async (original) => original,
	ignorePatterns: ["*.map"],
	normalizeAssetsPattern: "[name]-[hash].js",
};

await createAndUploadReport(buildDirs, coreOpts, bundleAnalyzerOpts);
