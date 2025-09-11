import { exec } from "node:child_process";
import fs from "node:fs";
import { wait } from "./helpers";

const hookLinkPC = ".git/hooks/pre-commit";
const optLinkPC = "opt/git-hooks/pre-commit";
const hookLinkPP = ".git/hooks/pre-push";
const optLinkPP = "opt/git-hooks/pre-push";

const dt = new Date();
const msg = `ptm${dt.getFullYear()}${dt.getMonth()}${dt.getDate()}${dt.getHours()}${dt.getMinutes()}${dt.getSeconds()}`;

const pcJobs = [
	async () => {
		if (fs.existsSync(hookLinkPC)) {
			await fs.promises.unlink(hookLinkPC);
		}
	},
	async () => {
		await wait(1000);
		await fs.promises.copyFile(
			optLinkPC,
			hookLinkPC,
			fs.promises.constants.COPYFILE_EXCL,
		);
	},
	async () => {
		if (fs.existsSync(hookLinkPP)) {
			await fs.promises.unlink(hookLinkPP);
		}
	},
	async () => {
		await wait(1000);
		await fs.promises.copyFile(
			optLinkPP,
			hookLinkPP,
			fs.promises.constants.COPYFILE_EXCL,
		);
	},
	async () => {
		await wait(1000);
		await new Promise<void>((resolve, reject) => {
			const cp = exec("chmod +x .git/hooks/pre-commit");
			cp.stdout?.pipe(process.stdout);
			cp.stderr?.pipe(process.stderr);
			cp.once("exit", (code) => (code === 0 ? resolve() : reject()));
		});
	},
	async () => {
		await wait(1000);
		await new Promise<void>((resolve, reject) => {
			const cp = exec("chmod +x .git/hooks/pre-push");
			cp.stdout?.pipe(process.stdout);
			cp.stderr?.pipe(process.stderr);
			cp.once("exit", (code) => (code === 0 ? resolve() : reject()));
		});
	},
	async () => {
		await wait(1000);
		await new Promise<void>((resolve, reject) => {
			const cp = exec("git add .");
			cp.stdout?.pipe(process.stdout);
			cp.stderr?.pipe(process.stderr);
			cp.once("exit", (code) => (code === 0 ? resolve() : reject()));
		});
	},
	async () => {
		await wait(1000);
		await new Promise<void>((resolve, reject) => {
			const cp = exec(`git commit -S -m "${msg}"`);
			cp.stdout?.pipe(process.stdout);
			cp.stderr?.pipe(process.stderr);
			cp.once("exit", (code) => (code === 0 ? resolve() : reject()));
		});
	},
	async () => {
		await wait(1000);
		await new Promise<void>((resolve, reject) => {
			const cp = exec("git push");
			cp.stdout?.pipe(process.stdout);
			cp.stderr?.pipe(process.stderr);
			cp.once("exit", (code) => (code === 0 ? resolve() : reject()));
		});
	},
];

for (const job of pcJobs) {
	await job();
}
