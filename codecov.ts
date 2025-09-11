import lcovToCodecov from "./opt/lcov";
import { wait, writeOutFile, readFile, resolvePath } from "./opt/helpers";

async function codecov() {
	await wait(3000);
	const lcov = readFile(resolvePath("test/lcov.info"), "utf8") as string;
	const json = lcovToCodecov(lcov);
	writeOutFile(resolvePath("coverage/codecov.json"), JSON.stringify(json));
}

await codecov();
