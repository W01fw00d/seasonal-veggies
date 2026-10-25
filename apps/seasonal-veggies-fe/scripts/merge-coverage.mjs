import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import coverageLib from "istanbul-lib-coverage";
import reportLib from "istanbul-lib-report";
import reports from "istanbul-reports";

const { createCoverageMap } = coverageLib;
const { createContext } = reportLib;

const coverageMap = createCoverageMap({});

for (const reportPath of [
  "coverage/vitest/coverage-final.json",
  "coverage/playwright/coverage-final.json",
]) {
  const report = JSON.parse(await readFile(path.resolve(reportPath), "utf8"));
  for (const coverage of Object.values(report)) {
    const absolutePath = path.isAbsolute(coverage.path)
      ? coverage.path
      : path.resolve(coverage.path);
    const relativePath = path.relative(process.cwd(), absolutePath);
    coverageMap.addFileCoverage({
      ...coverage,
      path: relativePath.split(path.sep).join("/"),
    });
  }
}

const context = createContext({
  coverageMap,
  dir: path.resolve("coverage"),
});
reports.create("lcovonly").execute(context);

const lcovPath = path.resolve("coverage/lcov.info");
const lcov = await readFile(lcovPath, "utf8");
await writeFile(
  lcovPath,
  lcov.replace(/^SF:(.*)$/gm, (_line, sourcePath) =>
    `SF:${sourcePath.replaceAll("\\", "/")}`,
  ),
);
