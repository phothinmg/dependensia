import fs from "node:fs";

function lcovToCodecov(lcovPath: string, outputPath: string) {
  const lcov = fs.readFileSync(lcovPath, "utf-8");
  const records = lcov
    .split("end_of_record") //split files
    .map((r) => r.trim())
    .filter(Boolean);

  const coverage = {};
  const regexp = /^.*\.test\.ts$/;
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
    if (file && !regexp.test(file)) {
      coverage[file] = { ...lineHits };
    }
  }

  const codecovJson = { coverage };

  fs.writeFileSync(outputPath, JSON.stringify(codecovJson));
}

export default lcovToCodecov;
