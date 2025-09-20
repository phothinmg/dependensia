/**
 * Convert lcov string to codecov json format.
 * @param lcov a string formatted according to lcov spec
 * @returns a json object in codecov format
 */
function lcovToCodecov(lcov: string) {
	const records = lcov
		.split("end_of_record") //split files
		.map((r) => r.trim())
		.filter(Boolean);

	const coverage: { [file: string]: Record<number, number> } = {};
	const regexp = /^.*\.test\.ts$/;
	const re2 = /^test\/(?:esm|ts)\/.*(?:\.js|\.ts)$/;
	for (const record of records) {
		const lines = record
			.split("\n")
			.map((l) => l.trim())
			.filter(Boolean);
		let file = "";
		const lineHits: Record<number, number> = {};

		for (const line of lines) {
			if (line.startsWith("SF:")) {
				// file name
				file = line.slice(3);
			} else if (line.startsWith("DA:")) {
				// DA:10,1
				const [ln, hits] = line.slice(3).split(",").map(Number);
				lineHits[ln] = hits;
			}
		}
		// filter test files
		if (file && !regexp.test(file) && !re2.test(file)) {
			coverage[file] = { ...lineHits };
		}
	}

	const codecovJson = { coverage };

	return codecovJson;
}

export default lcovToCodecov;
