import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const temporaryDirectory = await mkdtemp(resolve(tmpdir(), "seasonal-veggies-api-"));

try {
  const npmCli = process.env.npm_execpath;
  if (!npmCli) {
    throw new Error("Run this check through the npm check:api script.");
  }

  const result = spawnSync(
    process.execPath,
    [
      npmCli,
      "exec",
      "--",
      "openapi-ts",
      "-i",
      "../seasonal-veggies-be/openapi.json",
      "-o",
      temporaryDirectory,
      "-p",
      "@hey-api/typescript",
    ],
    { stdio: "inherit" },
  );
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`OpenAPI type generation exited with status ${result.status}.`);
  }

  for (const file of ["index.ts", "types.gen.ts"]) {
    const generated = await readFile(resolve(temporaryDirectory, file), "utf8");
    const checkedIn = await readFile(resolve("src/api", file), "utf8");
    if (generated !== checkedIn) {
      throw new Error(
        `src/api/${file} is out of date. Run npm run generate:api and commit the updated types.`,
      );
    }
  }

  console.log("Generated frontend API types are up to date.");
} finally {
  await rm(temporaryDirectory, { recursive: true, force: true });
}
