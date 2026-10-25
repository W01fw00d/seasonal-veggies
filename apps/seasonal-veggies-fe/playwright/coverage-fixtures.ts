import { test as base, expect } from "@playwright/test";

export { expect };

export const test = base.extend({
  page: async ({ page }, registerPage, testInfo) => {
    const session = await page.context().newCDPSession(page);
    const scriptIds = new Map<string, string>();

    session.on("Debugger.scriptParsed", ({ scriptId, url }) => {
      scriptIds.set(scriptId, url);
    });
    await session.send("Debugger.enable");
    await session.send("Profiler.enable");
    await session.send("Profiler.startPreciseCoverage", {
      callCount: false,
      detailed: true,
    });

    try {
      await registerPage(page);
    } finally {
      const { result } = await session.send("Profiler.takePreciseCoverage");
      const scripts = [];

      for (const coverage of result) {
        const url = scriptIds.get(coverage.scriptId);
        if (!url) continue;
        const sourcePath = new URL(url).pathname;
        if (!/^\/(src|lib)\//.test(sourcePath)) continue;
        if (!/\.[cm]?[jt]sx?$/.test(sourcePath)) continue;
        if (/\.(spec|test)\.[cm]?[jt]sx?$/.test(sourcePath)) continue;
        if (/\.story\.[cm]?[jt]sx?$/.test(sourcePath)) continue;

        const { scriptSource } = await session.send("Debugger.getScriptSource", {
          scriptId: coverage.scriptId,
        });
        scripts.push({ url, source: scriptSource, functions: coverage.functions });
      }

      await session.detach();
      await testInfo.attach("browser-coverage.json", {
        body: JSON.stringify(scripts),
        contentType: "application/json",
      });
    }
  },
});
