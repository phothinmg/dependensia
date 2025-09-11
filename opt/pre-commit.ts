import fs from "node:fs";
import { exec } from "node:child_process";
import { wait } from "./helpers";

const hookLink = ".git/hooks/pre-commit";
const optLink = "opt/git-hooks/pre-commit";

const dt = new Date();
const msg = `ptm${dt.getFullYear()}${dt.getMonth()}${dt.getDate()}${dt.getHours()}${dt.getMinutes()}${dt.getSeconds()}`;

const pcJobs = [
  async function () {
    if (fs.existsSync(hookLink)) {
      await fs.promises.unlink(hookLink);
    }
  },
  async function () {
    await wait(1000);
    await fs.promises.copyFile(
      optLink,
      hookLink,
      fs.promises.constants.COPYFILE_EXCL
    );
  },
  async function () {
    await wait(1000);
    await new Promise<void>((resolve, reject) => {
      const cp = exec("chmod +x .git/hooks/pre-commit");
      cp.stdout?.pipe(process.stdout);
      cp.stderr?.pipe(process.stderr);
      cp.once("exit", (code) => (code === 0 ? resolve() : reject()));
    });
  },
  async function () {
    await wait(1000);
    await new Promise<void>((resolve, reject) => {
      const cp = exec("git add .");
      cp.stdout?.pipe(process.stdout);
      cp.stderr?.pipe(process.stderr);
      cp.once("exit", (code) => (code === 0 ? resolve() : reject()));
    });
  },
  async function () {
    await wait(1000);
    await new Promise<void>((resolve, reject) => {
      const cp = exec(`git commit -S -m "${msg}"`);
      cp.stdout?.pipe(process.stdout);
      cp.stderr?.pipe(process.stderr);
      cp.once("exit", (code) => (code === 0 ? resolve() : reject()));
    });
  },
  async function () {
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
