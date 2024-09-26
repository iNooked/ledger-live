import { PlaywrightTestConfig } from "@playwright/test";

// Parse the workers environment variable correctly
const defaultWorkers = process.env.PW_WORKERS
  ? isNaN(Number(process.env.PW_WORKERS))
    ? process.env.PW_WORKERS
    : Number(process.env.PW_WORKERS)
  : "50%";

const config: PlaywrightTestConfig = {
  projects: [
    {
      name: "speculos_tests",
      testDir: "specs/speculos/",
      retries: process.env.CI ? 2 : 0,
    },
    {
      name: "mocked_tests",
      testDir: "specs/",
      testIgnore: ["**/speculos/**", "specs/recorder.spec.ts"],
    },
  ],
  outputDir: "./artifacts/test-results",
  snapshotPathTemplate:
    "{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{-platform}{ext}",
  timeout: process.env.CI ? 190000 : 600000,
  expect: {
    timeout: 41000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.005,
    },
  },
  globalTimeout: 0,
  globalSetup: require.resolve("./utils/global.setup"),
  globalTeardown: require.resolve("./utils/global.teardown"),
  use: {
    ignoreHTTPSErrors: true,
    screenshot: process.env.CI ? "only-on-failure" : "off",
  },
  forbidOnly: !!process.env.CI,
  preserveOutput: process.env.CI ? "failures-only" : "always",
  maxFailures: process.env.CI ? 5 : undefined,
  reportSlowTests: process.env.CI ? { max: 0, threshold: 60000 } : null,
  fullyParallel: true,
  retries: 0,
  workers: defaultWorkers, // Use the parsed value here
  reporter: process.env.CI
    ? [
        ["html", { open: "never", outputFolder: "artifacts/html-report" }],
        ["github"],
        ["line"],
        ["allure-playwright"],
        ["./utils/customJsonReporter.ts"],
      ]
    : [["allure-playwright"]],
};

export default config;
