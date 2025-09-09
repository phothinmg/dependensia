import * as fs from "fs";
import * as path from "path";

/**
 * Converts lcov.info to codecov.json format.
 * @param lcovPath Path to lcov.info file
 * @param outputPath Path to output codecov.json file
 */
export function lcovToCodecovJson(lcovPath: string, outputPath: string) {
  const lcov = fs.readFileSync(lcovPath, "utf-8");
  const records = lcov
    .split("end_of_record")
    .map((r) => r.trim())
    .filter(Boolean);

  const coverage = {};

  for (const record of records) {
    const lines = record
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    let file = "";
    const lineHits: Record<number, number> = {};

    for (const line of lines) {
      if (line.startsWith("SF:")) {
        file = line.slice(3);
      } else if (line.startsWith("DA:")) {
        const [ln, hits] = line.slice(3).split(",").map(Number);
        lineHits[ln] = hits;
      }
    }

    if (file) {
      coverage[file] = { ...lineHits };
    }
  }

  const codecovJson = { coverage };

  fs.writeFileSync(outputPath, JSON.stringify(codecovJson, null, 2));
}
lcovToCodecovJson("opt/lcov.info", "opt/coverage/codecov.json");
