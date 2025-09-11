import path from "node:path";
import {
	type BundleAnalyzerOptions,
	createAndUploadReport,
	type Options,
} from "@codecov/bundle-analyzer";

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

createAndUploadReport(buildDirs, coreOpts, bundleAnalyzerOpts)
	.then((reportAsJson) =>
		console.log(`Report successfully generated and uploaded: ${reportAsJson}`),
	)
	.catch((error) =>
		console.error("Failed to generate or upload report:", error),
	);
