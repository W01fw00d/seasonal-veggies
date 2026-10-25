import path from "node:path";
import coverageLib from "istanbul-lib-coverage";
import reportLib from "istanbul-lib-report";
import reports from "istanbul-reports";
import v8ToIstanbul from "v8-to-istanbul";

const { createCoverageMap } = coverageLib;
const { createContext } = reportLib;

function getApplicationPath(url) {
  const parsedUrl = new URL(url);
  const sourcePath = decodeURIComponent(parsedUrl.pathname);

  if (!/^\/(src|lib)\//.test(sourcePath)) return undefined;
  if (!/\.[cm]?[jt]sx?$/.test(sourcePath)) return undefined;
  if (/\.(spec|test)\.[cm]?[jt]sx?$/.test(sourcePath)) return undefined;
  if (/\.story\.[cm]?[jt]sx?$/.test(sourcePath)) return undefined;

  return path.resolve(process.cwd(), `.${sourcePath}`);
}

export default class PlaywrightCoverageReporter {
  constructor() {
    this.coverageMap = createCoverageMap({});
  }

  async onTestEnd(_test, result) {
    for (const attachment of result.attachments) {
      if (attachment.name !== "browser-coverage.json" || !attachment.body) {
        continue;
      }

      const scripts = JSON.parse(attachment.body.toString());
      for (const script of scripts) {
        const scriptPath = getApplicationPath(script.url);
        if (!scriptPath) continue;

        const converter = v8ToIstanbul(scriptPath, 0, { source: script.source });
        await converter.load();
        converter.applyCoverage(script.functions);
        this.coverageMap.merge(converter.toIstanbul());
      }
    }
  }

  async onEnd() {
    if (this.coverageMap.files().length === 0) {
      throw new Error("Playwright did not collect coverage for application source files.");
    }

    const context = createContext({
      coverageMap: this.coverageMap,
      dir: path.resolve("coverage/playwright"),
    });
    reports.create("json").execute(context);
  }
}
